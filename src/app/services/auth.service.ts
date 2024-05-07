import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Auth, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from '@angular/fire/auth';
import { Firestore, collection, collectionData, getFirestore, doc, updateDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly COOKIE_KEY = 'my_auth_token';
  private properties: string[] = ['email', 'phoneNumber', 'displayName', 'photoURL',]
  private roles: string[] = ['admin', 'mod', 'visitor',]

  constructor(private cookieService: CookieService, private auth: Auth, private db: Firestore) { }

  updateCookieToken() {
    const currentUser = this.auth.currentUser
    if (currentUser) {
      currentUser.getIdToken().then(
        (token) => { this.cookieService.set(this.COOKIE_KEY, token) }
      ).catch(
        () => console.log('Couldnt retrieve token')
      )
    }
  }

  isAuthenticated(): boolean {
    return this.cookieService.check(this.COOKIE_KEY)
  }

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  signinWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider())
  }

  logout(): Promise<void> {
    this.cookieService.delete(this.COOKIE_KEY);
    return signOut(this.auth)
  }

  getUid() {
    return this.auth.currentUser?.uid
  }

  getEmail() {
    return this.auth.currentUser?.email
  }

  getDisplayName() {
    return this.auth.currentUser?.displayName
  }

  getPhotoUrl() {
    return this.auth.currentUser?.photoURL
  }

  getPhoneNumber() {
    return this.auth.currentUser?.phoneNumber
  }

  updateDisplayName(newName: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return updateProfile(currentUser, { displayName: newName });
    } else {
      return Promise.reject('No user signed in.');
    }
  }

  updatePhotoUrl(newPhotoUrl: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return updateProfile(currentUser, { photoURL: newPhotoUrl });
    } else {
      return Promise.reject('No user signed in.');
    }
  }

  getUser(uid: string) {
    return doc(this.db, 'users', uid)
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