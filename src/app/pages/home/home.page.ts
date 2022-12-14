import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ClassService } from 'src/app/services/class.service';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  completedCount: number = 0;
  onGoingCount: number = 0;

  @ViewChild('days', { static: true }) days: ElementRef;
  @ViewChild('hours', { static: true }) hours: ElementRef;
  @ViewChild('minutes', { static: true }) minutes: ElementRef;
  @ViewChild('seconds', { static: true }) seconds: ElementRef;
  constructor(
    public userService: UserService,
    private router: Router,
    private dbService: DatabaseService,
    public classService: ClassService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    console.log(this.userService.myCourses);

    console.log(this.completedCount, this.onGoingCount);
  }
  ngAfterViewInit() {
    setInterval(() => {
      this.tickTock();
    }, 1000);
  }

  tickTock() {
    // console.log('target', this.classService.haveCountDown);

    if (this.classService.haveCountDown) {
      this.classService.difference =
        this.classService.targetTime - new Date().getTime();
      var days = Math.floor(
        this.classService.difference / (1000 * 60 * 60 * 24)
      );
      var hours = Math.floor(
        (this.classService.difference % (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      );
      var minutes = Math.floor(
        (this.classService.difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      var seconds = Math.floor(
        (this.classService.difference % (1000 * 60)) / 1000
      );

      this.days.nativeElement.innerText = days;
      this.hours.nativeElement.innerText = hours;
      this.minutes.nativeElement.innerText = minutes;
      this.seconds.nativeElement.innerText = seconds;
      // console.log(days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ');
    }
  }
  async onEventClick(item) {
    console.log(item);

    let navigationExtras: NavigationExtras = { state: { ...item } };
    this.router.navigate(['class-detail'], navigationExtras);
  }

  convertIsoDateTime(date) {
    return moment(date).format(' h:mm a');
  }
  convertIsoDate(date) {
    return moment(date).format(' Do MMM YYYY');
  }
}
