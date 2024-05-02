import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Firestore, collection, collectionData, getFirestore, doc, updateDoc, setDoc } from '@angular/fire/firestore';
import { firebaseConfig } from '../firebase/firebase.module';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private properties: string[] = ['email', 'phoneNumber', 'displayName', 'photoURL',]
  private roles: string[] = ['admin', 'visitor',]

  constructor(private auth: Auth, private db: Firestore) { }

  setPhoneNumber(phoneNumber: string): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (userId) {
      const userRef = doc(this.db, 'users', userId);
      return setDoc(userRef, { phoneNumber: phoneNumber }, { merge: true });
    } else {
      return Promise.reject('User not logged in.');
    }
  }

  setDisplayName(newName: string) {
    this.setProperty('displayName', newName)
  }

  setProperty(property: string, value: string): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (userId && this.properties.includes(property)) {
      const userRef = doc(this.db, 'users', userId);
      return setDoc(userRef, { [property]: value }, { merge: true });
    } else {
      return Promise.reject('User not logged in.');
    }
  }

  setRole(role: string, enabled: boolean): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (userId && this.roles.includes(role)) {
      const userRef = doc(this.db, 'users', userId);
      return setDoc(userRef, { [`roles.${role}`]: enabled }, { merge: true });
    } else {
      return Promise.reject('User not logged in.');
    }
  }

}
