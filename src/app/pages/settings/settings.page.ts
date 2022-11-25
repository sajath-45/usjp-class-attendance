import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {}
  logout() {
    this.authService.userSignOut().then((res) => {
      console.log(res);
      this.router.navigate(['/login']);
    });
  }
}
