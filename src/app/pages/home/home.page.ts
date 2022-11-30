import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  completedCount: number = 0;
  onGoingCount: number = 0;

  constructor(
    public userService: UserService,
    private router: Router,
    private dbService: DatabaseService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.dbService.getCountCompleted().then((res) => {
      console.log(res);
      this.completedCount = res;
    });
    this.dbService.getCountPending().then((res) => {
      console.log(res);
      this.onGoingCount = res;
    });
    console.log(this.completedCount, this.onGoingCount);
  }
}
