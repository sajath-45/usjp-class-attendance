import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  showSpinnerButton: boolean;
  user: User;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    public userService: UserService,
    private dbService: DatabaseService,
    private util: UtilService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    let userDetails = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.showSpinnerButton = true;
    this.util.highlightForm(this.loginForm);
    this.util.presentLoading('Logining In..');

    this.auth.loginFirebase(userDetails).then(
      (res) => {
        this.util.dismissLoading();
        this.showSpinnerButton = false;

        console.log(res);
        if (res.user) {
          localStorage.setItem('uid', res.user.uid);
          let userSub = this.dbService
            .getOne(`users/${res.user.uid}`)
            .subscribe(
              (user: User) => {
                console.log(user);

                this.userService.user = user;
                this.notificationService.initPush();

                this.router.navigate(['tabs/home']);
                userSub.unsubscribe();
              },
              (err) => {
                userSub.unsubscribe();
              }
            );
        } else {
          this.util.showAlert('Wrong password', '', ['ok']);
        }
      },
      (error) => {
        this.util.dismissLoading();
        this.showSpinnerButton = false;
        console.log(error);
      }
    );
  }
}
