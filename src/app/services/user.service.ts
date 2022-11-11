import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user: User;
  public myCourses = ['BiDMO3ezPnffhQZVLT48', 'PM0oXuWG6VmAxRjLpPXu'];

  constructor(private alertCtrl: AlertController) {}

  public async showAlert(header, message, buttons) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: buttons,
    });
    alert.present();
  }

  call(number) {
    window.open(`tel:${number}`, '_system');
  }
}
