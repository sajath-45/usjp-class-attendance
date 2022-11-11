import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  constructor() {}
  isEventOver(event) {
    let today = moment(new Date());
    let startDate = moment(event.time);
    return today.isAfter(startDate);
  }
}
