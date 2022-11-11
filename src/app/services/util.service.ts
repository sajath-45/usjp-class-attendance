import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  loading: any;
  isLoading = false;
  dummy;
  constructor(
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
    private alertCtrl: AlertController
  ) {}

  async showToast(msg, colors, positon) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color: colors,
      position: positon,
    });
    toast.present();
  }

  public async showAlert(header, message, buttons) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: buttons,
    });
    alert.present();
  }

  async presentLoading(message?) {
    this.isLoading = true;
    return await this.loadingController
      .create({
        message: message,
        mode: 'md',
      })
      .then((a) => {
        a.present().then(() => {
          console.log('presented');
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => console.log('dismissed'));
  }

  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }

  //call number

  callnumber(number) {
    window.open(`tel:${number}`, '_system');
  }

  isError(form: FormGroup, path, error) {
    // console.log('form controls >> ', error);
    if (form.get(path) && form.get(path).touched && form.get(path).errors) {
      // console.log('errors >>> ', form.get(path).errors);
      return form.get(path).errors[error];
    }
    return null;
  }

  highlightForm(formGroup: FormGroup) {
    // console.log(formGroup);

    (<any>Object).values(formGroup.controls).forEach((control) => {
      if (control.controls) {
        // control is a FormGroup
        this.highlightForm(control);
      } else {
        // control is a FormControl
        // console.log(control.value, control.valid);
        control.markAsTouched();
      }
    });
  }
}
