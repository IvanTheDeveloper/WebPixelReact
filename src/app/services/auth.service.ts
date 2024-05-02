import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Auth, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly COOKIE_KEY = 'my_auth_token';

  constructor(private cookieService: CookieService, private auth: Auth) { }

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

}