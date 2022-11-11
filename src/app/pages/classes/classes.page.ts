import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Trip } from 'src/app/models/class';
import { ClassService } from 'src/app/services/class.service';
import { DatabaseService } from 'src/app/services/database.service';
import { UtilService } from 'src/app/services/util.service';
import { ClassDetailPage } from '../class-detail/class-detail.page';
import { CreateClassPage } from '../create-class/create-class.page';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss'],
})
export class ClassesPage implements OnInit {
  searchName: String;
  completedClasses = [];
  onGoingClasses = [];

  eventList: any[] = [
    {
      className: 'ICT 301 Mobile Technology',
      time: '8.00 am',
      participants: [],
      dateFrom: new Date(),
      venue: 'LCS',
    },
  ];
  type = 'on-going';

  constructor(
    public classService: ClassService,
    public modalCtrl: ModalController,
    private dbService: DatabaseService,
    public util: UtilService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getClasses();
  }

  getClasses() {
    this.completedClasses = [];
    this.onGoingClasses = [];
    this.util.presentLoading('loading..');
    this.dbService.getMyClasses().then(
      (res) => {
        console.log(res);
        this.util.dismissLoading();

        res.forEach((x) => {
          let item = x.data();
          item.classId = x.id;

          if (this.classService.isEventOver(item)) {
            this.completedClasses.push(item);
          } else {
            this.onGoingClasses.push(item);
          }
        });

        console.log('class as comple', this.completedClasses);
        console.log('class as ongoing', this.onGoingClasses);
      },
      (err) => {
        this.util.dismissLoading();
        console.log(err);
      }
    );
  }

  convertIsoDateTime(date) {
    return moment(date).format(' h:mm a');
  }
  convertIsoDate(date) {
    return moment(date).format(' Do MMM YYYY');
  }
  isParticipant(event) {
    return event.participants.includes(localStorage.getItem('email'));
  }
  async openCreateClass() {
    const modal = await this.modalCtrl.create({
      component: CreateClassPage,
      cssClass: 'my-custom-class',
      componentProps: {},
    });

    return await modal.present();
  }

  async onEventClick(item) {
    console.log(item);
    // const modal = await this.modalCtrl.create({
    //   component: ClassDetailPage,
    //   cssClass: 'my-custom-class',
    //   componentProps: { classId: item.classId, classDetail: item },
    // });

    // return await modal.present();
    let navigationExtras: NavigationExtras = { state: { ...item } };
    this.router.navigate(['class-detail'], navigationExtras);
  }

  segmentChanged() {}
}
