import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { QrScannerPage } from '../qr-scanner/qr-scanner.page';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.page.html',
  styleUrls: ['./class-detail.page.scss'],
})
export class ClassDetailPage implements OnInit {
  classDetail: any;
  contentVisibility = '';
  uid = localStorage.getItem('uid');
  lecturerDetail;

  constructor(
    public actionSheetController: ActionSheetController,
    private dbService: DatabaseService,
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    private router: Router,
    private util: UtilService,
    public userService: UserService
  ) {}

  ngOnInit() {
    let routeSubscription = this.activatedRoute.queryParams.subscribe((_p) => {
      const navParams = this.router.getCurrentNavigation().extras.state;
      console.log('navParams-->', navParams);
      if (navParams) {
        this.classDetail = navParams;
        console.log(this.classDetail);

        if (this.classDetail?.lecturerId) {
          this.getLectureProfile();
        }
      }
    });
  }

  getLectureProfile() {
    this.dbService.getOne(`lecturer/${this.classDetail?.lecturerId}`).subscribe(
      (res) => {
        this.lecturerDetail = res;
        console.log('lecturer details-->', res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async scanQr() {
    // const modal = await this.modalCtrl.create({
    //   component: QrScannerPage,
    //   cssClass: 'my-custom-class',
    //   componentProps: { classDetail: this.classDetail },
    // });
    // await modal.present();
    // const { data, role } = await modal.onWillDismiss();
    // console.log(data);
    this.startScan();
  }

  async startScan() {
    try {
      await BarcodeScanner.checkPermission({ force: true });
      await BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      this.contentVisibility = 'hidden';
      const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
      console.log(result);
      this.contentVisibility = '';
      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');

      // if the result has content
      if (result.hasContent) {
        console.log(result.content); // log the raw scanned content
        if (result.content == this.classDetail.secretCode) {
          this.pushParticipant();
          this.util.showToast('Submitted Attendance', 'success', 'bottom');
        } else {
          this.util.showToast('Inavlid Qr', 'danger', 'bottom');
        }
        // this.modalCtrl.dismiss(result.content);
      } else {
        // this.modalCtrl.dismiss();
      }
    } catch (e) {
      console.log(e);
      this.stop();
    }
  }
  stop() {
    this.contentVisibility = '';
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
  }
  pushParticipant() {
    if (!this.classDetail.participantListIds.includes(this.uid)) {
      this.classDetail.participantListIds.push(this.uid);
      this.classDetail.participants.push({
        uid: this.uid,
        name: this.userService.user.firstName,
      });
    } else {
      this.util.showToast('Already in class', 'danger', 'bottom');
    }
  }

  ngOnDestroy() {
    if (Capacitor.getPlatform() !== 'web') this.stop();
  }
}
