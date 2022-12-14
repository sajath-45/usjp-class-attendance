import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    public dbService: DatabaseService,
    public router: Router
  ) {}

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
        const newUser: User = {
          uid: user.user.uid,
          ...detail,
        };

        return this.dbService.set(newUser.type, newUser.uid, newUser);
      } else {
        return null;
      }
    } catch (e) {
      return e;
    }
  }

  public userSignOut() {
    console.log('sign out called');
    return this.auth.signOut().then(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });

    // this.router.navigate(['/sign-in']);
  }
}
