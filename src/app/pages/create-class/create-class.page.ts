import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ClassService } from 'src/app/services/class.service';
import { DatabaseService } from 'src/app/services/database.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.page.html',
  styleUrls: ['./create-class.page.scss'],
})
export class CreateClassPage implements OnInit {
  classForm: FormGroup;
  uid = localStorage.getItem('uid');
  courses = [];
  public qrCodeDownloadLink: SafeUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private dbService: DatabaseService,
    public util: UtilService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public classService: ClassService,
    public modalCtrl: ModalController
  ) {
    this.createForms();
  }

  ngOnInit() {
    let closeSub = this.dbService.getAll(`course`, 'courseId').subscribe(
      (res) => {
        this.courses = res;
        console.log('corses', this.courses);
        closeSub.unsubscribe();
      },
      (err) => {
        closeSub.unsubscribe();
        console.log(err);
      }
    );
  }

  createForms() {
    this.classForm = this.formBuilder.group({
      course: ['', Validators.required],
      secretCode: [this.makeid(10), Validators.required],
      time: [moment().format()],
      date: [moment().format(), Validators.required],
      description: [''],
      lecturerId: [1, Validators.required],
      qrImage: [''],
      participants: [],
      participantListIds: [],
    });
  }

  onChangeURL(url: any) {
    this.qrCodeDownloadLink = url;
    this.classForm
      .get('qrImage')
      .setValue(url.changingThisBreaksApplicationSecurity);
    console.log(url);
  }

  makeid(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  generateClass(parent) {
    console.log(this.classForm.value);
  }

  private convertBase64ToBlob(Base64Image: any) {
    // SPLIT INTO TWO PARTS
    const parts = Base64Image.split(';base64,');
    // HOLD THE CONTENT TYPE
    const imageType = parts[0].split(':')[1];
    // DECODE BASE64 STRING
    const decodedData = window.atob(parts[1]);
    // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
    const uInt8Array = new Uint8Array(decodedData.length);
    // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // RETURN BLOB IMAGE AFTER CONVERSION
    return new Blob([uInt8Array], { type: imageType });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  onChangeCourse(e) {
    console.log(e);
  }

  submit() {
    console.log('form', this.classForm);

    if (this.classForm.valid) {
      this.util.presentLoading('Creating ..');

      const base64Img =
        document.getElementsByClassName('coolQRCode')[0].children[0]['src'];
      this.dbService
        .upload('qr', 'qr1', this.convertBase64ToBlob(base64Img))
        .then((res) => {
          console.log(res);
          this.classForm.get('qrImage').setValue(res);
          console.log('form', this.classForm);

          this.dbService
            .create(`classes`, this.classForm.value, 'classId')
            .then(
              (res) => {
                this.util.dismissLoading();

                this.classForm.reset();
                this.createForms();
                this.util.showToast(
                  'Successfully Submitted ',
                  'success',
                  'bottom'
                );
              },
              (err) => {
                this.util.dismissLoading();
                console.log(err);
              }
            );
        });
    } else {
      this.util.showToast(
        'Please check if all * fields are filled & valid ',
        'danger',
        'bottom'
      );
    }
  }
}
