import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ClassService } from 'src/app/services/class.service';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';
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

  type: 'on-going' | 'completed' = 'on-going';

  constructor(
    public classService: ClassService,
    public modalCtrl: ModalController,
    private dbService: DatabaseService,
    public util: UtilService,
    private router: Router,
    public userService: UserService
  ) {}

  ngOnInit() {}

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

  setReminder(event) {
    // //debugger;
    // if (event.isReminder) {
    // 	event.isReminder = !event.isReminder;
    // 	this.no.offNotification(event.notifId);
    // } else {
    // 	event.isReminder = !event.isReminder;
    // 	let body =
    // 		event.eventTitle +
    // 		'\n' +
    // 		this.convertIsoDate(event.dateFrom) +
    // 		' - ' +
    // 		this.convertIsoDate(event.dateTo) +
    // 		'\n' +
    // 		event.location;
    // 	this.localNotificationService
    // 		.createNotification(
    // 			'Event Notification',
    // 			body,
    // 			event.id,
    // 			event.dateFrom,
    // 			this.eventService.isEventFullDay(event),
    // 			event
    // 		)
    // 		.subscribe((result) => {
    // 			event.notifId = result.notifications[0].id;
    // 			let request = {
    // 				reqType: 6,
    // 				reqId: result.notifications[0].id,
    // 				title: 'Event Notification',
    // 				subTitle: event.eventTitle,
    // 				date: new Date(),
    // 				event: event,
    // 				notificationAt: event.dateFrom,
    // 			};
    // 			this.adminService
    // 				.addLocalNotificationRequest(event.id.toString(), request)
    // 				.subscribe((req) => {
    // 					this.updateGroup(event);
    // 				});
    // 		});
    // }
  }
}
