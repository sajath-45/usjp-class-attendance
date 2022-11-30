import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  limit,
  getCountFromServer,
} from '@firebase/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import {
  Storage,
  ref,
  deleteObject,
  uploadBytes,
  uploadString,
  uploadBytesResumable,
  percentage,
  getDownloadURL,
} from '@angular/fire/storage';
import { combineLatest, Observable } from 'rxjs';
import { setDoc } from 'firebase/firestore';
import { UserService } from './user.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  uid: any = localStorage.getItem('uid');
  uploadPercent: Observable<{
    progress: number;
    snapshot: import('@angular/fire/storage').UploadTaskSnapshot;
  }>;

  constructor(
    private readonly firestore: Firestore,
    private storage: Storage,
    public userService: UserService
  ) {}

  getAll(path: string, id) {
    const reference = collection(this.firestore, path);
    return collectionData(reference, {
      idField: id,
    }) as Observable<any[]>;
  }

  getOne(path: string, id = 'id') {
    // console.log(path)
    const reference = doc(this.firestore, path); //path= `trips/${ride.rideId}`
    return docData(reference, { idField: id });
  }

  create(path: string, detail, id: string) {
    // console.log(path)
    const reference = collection(this.firestore, path);
    let docRef = doc(reference);
    console.log(docRef, reference);
    // detail[id] = docRef.id;
    return addDoc(reference, detail);
  }

  set(path: string, id, data) {
    return setDoc(doc(this.firestore, path, id), data);
  }

  update(path: string, detail) {
    //path= `trips/${ride.rideId}`
    // console.log(path,detail )
    const reference = doc(this.firestore, path);
    console.log(reference);
    return updateDoc(reference, { ...detail });
  }

  delete(path: string) {
    // console.log(path)
    const reference = doc(this.firestore, path);
    return deleteDoc(reference);
  }

  async getMyClasses() {
    const classRef = collection(this.firestore, 'classes');
    const classes = query(
      classRef,
      where('course.courseId', 'in', this.userService.myCourses),
      orderBy('dateTimeUtc', 'asc')
    );
    const querySnapshot = await getDocs(classes);

    return querySnapshot;
  }

  async getCountCompleted() {
    let today = new Date().getTime();
    console.log(today);
    const coll = collection(this.firestore, 'classes');
    const query_ = query(
      coll,
      where('course.courseId', 'in', this.userService.myCourses),
      where('dateTimeUtc', '<', today)
    );
    const snapshot = await getCountFromServer(query_);
    return snapshot.data().count;
  }
  async getCountPending() {
    let today = new Date().getTime();

    const coll = collection(this.firestore, 'classes');
    const query_ = query(
      coll,
      where('course.courseId', 'in', this.userService.myCourses),
      where('dateTimeUtc', '>', today)
    );
    const snapshot = await getCountFromServer(query_);
    return snapshot.data().count;
  }

  ///where wuery

  // async searchRide(detail) {
  //   const citiesRef = collection(this.firestore, 'trips');
  //   if (detail.destinationType) {
  //     var trips = query(
  //       citiesRef,
  //       where('status', '==', 'sheduled'),
  //       where('startDate', '==', detail.startDate),
  //       // where('startTime', '>=', detail.startTime),
  //       // where('startTime', '<=', detail.endTime),
  //       where('destinationType', '==', detail.destinationType),
  //       orderBy('startTime'),
  //       orderBy('dateUTC', 'asc')
  //     );
  //   } else {
  //     var trips = query(
  //       citiesRef,
  //       where('status', '==', 'sheduled'),
  //       // where('startDate', '==', detail.startDate),
  //       // where('startTime', '>=', detail.startTime),
  //       where('startTime', '<=', detail.endTime),
  //       orderBy('startTime'),
  //       orderBy('dateUTC', 'asc')
  //     );
  //   }

  //   const querySnapshot = await getDocs(trips);

  //   return querySnapshot;
  // }

  // async getTripByStatus(status, limit) {
  //   const classRef = collection(this.firestore, 'trips');
  //   const data = query(
  //     classRef,
  //     where('status', '==', status),
  //     where('inCarList', 'array-contains', localStorage.getItem('uid'))
  //   );

  //   const querySnapshot = await getDocs(data);

  //   return querySnapshot;
  // }

  // async getTripStats(status) {
  //   const classRef = collection(this.firestore, 'stats');
  //   const data = query(classRef, where('tripId', '==', status));

  //   const querySnapshot = await getDocs(data);

  //   return querySnapshot;
  // }

  // async getMyRideAlerts(detail) {
  //   const classRef = collection(this.firestore, 'alerts');
  //   const data = query(
  //     classRef,
  //     where('uid', '==', detail.uid),
  //     where('startDate', '==', detail.startDate),
  //     where('destinationType', '==', detail.destinationType)
  //   );

  //   const querySnapshot = await getDocs(data);

  //   return querySnapshot;
  // }

  async upload(path: string, name: string, file: File | Blob): Promise<string> {
    // const ext = file!.name.split('.').pop();

    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        this.uploadPercent = percentage(task);
        await task;
        const url = await getDownloadURL(storageRef);
        return url;
      } catch (e: any) {
        console.error(e);
      }
    } else {
      // handle invalid file
    }
  }
}
