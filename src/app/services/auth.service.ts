import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from '@angular/fire/auth';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, public dbService: DatabaseService) {}

  async loginFirebase({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      return e;
    }
  }

  async registerFirebase({ email, password }, detail) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      if (user) {
        const newUser = {
          uid: user.user.uid,
          ...detail,
        };

        return this.dbService.create('students', newUser, newUser.uid);
      } else {
        return null;
      }
    } catch (e) {
      return e;
    }
  }
}
