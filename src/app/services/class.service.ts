import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DatabaseService } from './database.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  public completedClasses = [];
  public onGoingClasses = [];
  public upComingClass: any;

  public targetDate: any = new Date();
  public targetTime: any = this.targetDate.getTime();
  public difference: number;

  haveCountDown: boolean = false;
  completedCount: number;
  onGoingCount: number;

  constructor(
    public userService: UserService,
    private dbService: DatabaseService
  ) {}
  isEventOver(event) {
    let today = moment(new Date());
    let startDate = moment(event.dateTime);
    return today.isAfter(startDate);
  }

  getClasses() {
    this.completedClasses = [];
    this.onGoingClasses = [];
    console.log(this.userService.user);
    this.dbService.getMyClasses().then(
      (res) => {
        console.log(res);

        res.forEach((x) => {
          let item = x.data();
          item.classId = x.id;

          if (this.isEventOver(item)) {
            this.completedClasses.push(item);
          } else {
            this.onGoingClasses.push(item);
          }
        });
        if (this.onGoingClasses.length) {
          this.upComingClass = this.onGoingClasses[0];
          this.targetTime = this.onGoingClasses[0].dateTimeUtc;
          this.haveCountDown = true;
        } else {
          this.haveCountDown = false;
        }

        console.log('class as comple', this.completedClasses);
        console.log('class as ongoing', this.onGoingClasses);
        console.log('have count down', this.haveCountDown);
      },
      (err) => {
        console.log(err);
      }
    );

    this.dbService.getCountCompleted().then((res) => {
      console.log(res);
      this.completedCount = res;
    });
    this.dbService.getCountPending().then((res) => {
      console.log(res);
      this.onGoingCount = res;
    });
  }
}
