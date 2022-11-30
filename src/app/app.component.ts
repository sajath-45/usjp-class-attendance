import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { DatabaseService } from './services/database.service';
import { NotificationService } from './services/notification.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router,
    private dbService: DatabaseService,
    public userService: UserService,
    private notificationService: NotificationService,
    private auth: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then((val) => {
      let uid = localStorage.getItem('uid');
      let loginType = localStorage.getItem('loginType');
      console.log(loginType);

      if (uid && loginType) {
        let userSub = this.dbService
          .getOne(`${loginType}/${uid}`)
          .pipe(take(1))
          .subscribe(
            (user: User) => {
              this.userService.user = user;
              this.userService.myCourses = user.courses;
              this.notificationService.initPush();
              console.log(user);
              userSub.unsubscribe();
            },
            (err) => {
              userSub.unsubscribe();
            }
          );
      } else {
        this.auth.userSignOut().then((res) => {});
      }
    });
  }
}
