import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  user: User = null;
  editForm: FormGroup;

  constructor(
    private router: Router,
    private auth: AuthService,
    public userService: UserService,
    private dbService: DatabaseService,
    private util: UtilService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      lastName: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.email]],
      profilePic: ['', [Validators.required, Validators.email]],
    });
  }

  getUserProfile() {
    let uid = localStorage.getItem('uid');
    let loginType = localStorage.getItem('loginType');
    this.util.presentLoading('').then(async () => {
      this.dbService
        .getOne(`${loginType}/${uid}`)
        .pipe(take(1))
        .subscribe(
          (data: any) => {
            console.log(data.user.user);
            this.editForm.patchValue(data.user.user);
            this.user = data.user.user;
            this.util.dismissLoading();
          },
          (error) => {
            console.log('error---->', error);
            this.util.showToast(
              'Please Try To Login Again',
              'danger',
              'bottom'
            );
            this.auth.userSignOut().then((res) => {});
          }
        );
    });
  }

  updateUserProfile() {}
}
