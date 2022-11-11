import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { ToastController } from '@ionic/angular';
import { DatabaseService } from './database.service';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import * as moment from 'moment';
// import {
//   ILocalNotification,
//   LocalNotifications,
// } from '@awesome-cordova-plugins/local-notifications/ngx';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private toastController: ToastController,
    private router: Router,
    private db: DatabaseService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    // LocalNotifications.checkPermissions().then((data) => {
    //   console.log('check per data', data);
    // });
    // LocalNotifications.requestPermissions().then((data) => {
    //   console.log('req per data', data);
    // });
  }

  initPush() {
    if (Capacitor.getPlatform() !== 'web') this.registerPush();
  }

  async registerPush() {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting

    PushNotifications.requestPermissions().then((result) => {
      console.log(result);
      // alert(JSON.stringify(result));
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ', token.value);
      // this.userService.setUserProp('pushToken', token);
      this.saveTokenToDb(token.value);
      // alert('Push registration success, token: ' + token.value);

      this.userService.user.fcmToken = token.value;
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));

      // alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',

      async (notification: PushNotificationSchema) => {
        // alert('Push received: ' + JSON.stringify(notification));
        console.log('pushNotificationreceived', notification);
        const toast = await this.toastController.create({
          cssClass: '',
          header: notification.title,
          message: notification.body,
          position: 'top',
          mode: 'ios',
          duration: 5000,
        });
        toast.present();
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('pushNotificationActionPerformed', notification);
        // alert(
        //   'pushNotificationActionPerformed: ' + JSON.stringify(notification)
        // );

        // let url = notification.notification.data.url;
        // if (url) {
        //   this.router.navigate([url]);
        // }
      }
    );
  }

  public saveTokenToDb(token) {
    if (!token) return;
    this.db
      .update(`users/${localStorage.getItem('uid')}`, {
        fcmToken: token,
      })
      .then((res) => {
        console.log('saved push tokem', res);
      });
  }

  public removeTokenFromPushToken(token) {
    if (Capacitor.getPlatform() !== 'web') {
      localStorage.removeItem('token');
    }
  }

  sendNotification(title, msg, ids, data = {}) {
    // console.log(ids);
    const body = {
      registration_ids: ids,
      notification: {
        title: title,
        body: msg,
        sound: 'default',
      },
      data: data,
    };
    console.log(body);

    // const param = this.JSON_to_URLEncoded(body);
    // console.log('push body', param);

    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `key=${environment.serverKey}`),
    };
    return this.http.post('https://fcm.googleapis.com/fcm/send', body, header);
  }

  JSON_to_URLEncoded(element, key?, list?) {
    let new_list = list || [];
    if (typeof element === 'object') {
      for (let idx in element) {
        this.JSON_to_URLEncoded(
          element[idx],
          key ? key + '[' + idx + ']' : idx,
          new_list
        );
      }
    } else {
      new_list.push(key + '=' + encodeURIComponent(element));
    }
    return new_list.join('&');
  }

  // async sheduleLocalNotification(date, title, id) {
  //   let time = new Date(date);
  //   var timeAndDate = moment(date).subtract(1, 'minute');
  //   console.log('time shde', timeAndDate);

  //   let notifications: LocalNotificationSchema[] = [];

  //   let notification: LocalNotificationSchema = {
  //     title: title,
  //     body: '',
  //     id: 12, // important to have unique ids
  //     schedule: {
  //       at: timeAndDate.toDate(),
  //     },
  //     actionTypeId: '',
  //     autoCancel: false,
  //   };
  //   notifications.push(notification);

  //   console.log(notifications);

  //   let scheduled = await LocalNotifications.schedule({
  //     notifications,
  //   });
  // }
}
