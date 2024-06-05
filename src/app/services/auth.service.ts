import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Auth, AuthCredential, GoogleAuthProvider, User, UserCredential, applyActionCode, confirmPasswordReset, createUserWithEmailAndPassword, deleteUser, fetchSignInMethodsForEmail, isSignInWithEmailLink, sendEmailVerification, sendPasswordResetEmail, sendSignInLinkToEmail, signInWithCredential, signInWithCustomToken, signInWithEmailAndPassword, signInWithEmailLink, signInWithPopup, signOut, updateCurrentUser, updateEmail, updatePassword, updatePhoneNumber, updateProfile } from '@angular/fire/auth';
import { Firestore, collection, collectionData, getFirestore, doc, updateDoc, setDoc, getDoc, deleteDoc, getDocs, addDoc } from '@angular/fire/firestore';
import { dump, generateQrCode, generateRandomAvatar, getRandomHexColor, withTimeout } from '../others/utils';
import { StorageService } from './storage.service';
import { MyUser } from '../models/user';
import { HttpClient } from '@angular/common/http';
const bcrypt = require('bcryptjs'); // wtf? que es esto me quiero morir

export const COOKIE_TOKEN = 'auth_token'
export const COOKIE_QR = 'qr_code'
const actionCodeSettings = {
  url: location.href + '/?email=user@example.com',
  handleCodeInApp: true,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly MAX_TIME = Infinity
  private readonly PWD_HASHING_ENABLED = false
  private readonly USE_LOCAL_STORAGE = false

  constructor(private cookieService: CookieService, private auth: Auth, private db: Firestore, private fileUploader: StorageService, private http: HttpClient) {
    //el http aki sobra
  }

  //#region cookie

  setCookie(cookie: string, value: any): void {
    this.USE_LOCAL_STORAGE ? window.localStorage.setItem(cookie, value) : this.cookieService.set(cookie, value)
  }

  getCookie(cookie: string): string | null {
    return this.USE_LOCAL_STORAGE ? window.localStorage.getItem(cookie) : this.cookieService.get(cookie)
  }

  deleteCookie(cookie: string): void {
    this.USE_LOCAL_STORAGE ? window.localStorage.removeItem(cookie) : this.cookieService.delete(cookie)
  }

  deleteAllCookies(): void {
    this.USE_LOCAL_STORAGE ? window.localStorage.clear() : this.cookieService.deleteAll()
  }

  //#endregion

  //#region Authentication module

  get currentUser() {
    return this.auth.currentUser
  }

  isAuthenticated(): boolean {
    return this.cookieService.check(COOKIE_TOKEN)
  }

  async signinWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(this.auth, provider)
    const alreadyExists = await this.checkDbUserExists(userCredential.user)
    let user: MyUser
    if (alreadyExists) {
      user = new MyUser(userCredential.user)
      user.lastLoginAt = Date.now()
    } else {
      user = MyUser.createFromAuthUserWithDefaults(userCredential.user)
    }
    await this.checkRoles(user)
    await this.updateDbUser(user)
    this.updateCookieToken()
    return userCredential
  }

  async register(email: string, password: string, username: string = 'user'): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
    const generatedImg = generateRandomAvatar(username)
    const path = `images/${userCredential.user.uid}_${Date.now()}`
    const url = await this.fileUploader.uploadFile(generatedImg, path)
    const user = MyUser.createFromAuthUserWithDefaults(userCredential.user)
    user.avatarUrl = url
    user.username = username
    user.password = password
    await this.checkRoles(user)
    await this.updateUser(user)
    this.updateCookieToken()
    return userCredential
  }

  async login(email: string, password: string): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password)
    const user = new MyUser(userCredential.user)
    user.lastLoginAt = Date.now()
    await this.checkRoles(user)
    await this.updateDbUser(user)
    this.updateCookieToken()
    return userCredential
  }

  async registerWithConfirmationInitial(email: string, password: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
    await this.sendVerificationEmail(userCredential.user)
    return userCredential
  }

  async registerWithConfirmationComplete(userCredential: User, password: string, username: string = 'user'): Promise<void> {
    if (userCredential.emailVerified) {
      const generatedImg = generateRandomAvatar(username)
      const path = `images/${userCredential.uid}_${Date.now()}`
      const url = await this.fileUploader.uploadFile(generatedImg, path)
      const user = MyUser.createFromAuthUserWithDefaults(userCredential)
      user.avatarUrl = url
      user.username = username
      user.password = password
      await this.checkRoles(user)
      await this.updateUser(user)
      this.updateCookieToken()
      return Promise.resolve()
    } else {
      return Promise.reject('Still unverified, check your email')
    }
  }

  async loginWithQrInitial() {
    const collectionRef = collection(this.db, 'temp')
    const docRef = await addDoc(collectionRef, { token: null })
    this.deleteWithTimeout(docRef)
    this.setCookie(COOKIE_QR, docRef.id)
    const url = `${location.origin}/auth/${docRef.id}`
    return generateQrCode(url)
  }

  private async deleteWithTimeout(docRef: any) {
    await new Promise(f => setTimeout(f, 60 * 1000))
    await deleteDoc(docRef)
  }

  async loginWithQrConfirm(docName: string): Promise<void> {
    const docRef = doc(this.db, 'temp', docName)
    const docSnapshot: any = await getDoc(docRef)
    if (docSnapshot.exists()) {
      const user = await this.getDbUser()
      return setDoc(docRef, { token: this.getCookie(COOKIE_TOKEN), email: user.email, password: user.password }, { merge: true })
    }
    return Promise.reject('Auth code doesnt exist')
  }

  async loginWithQrComplete(): Promise<UserCredential> {
    try {
      const qrCookie = this.getCookie(COOKIE_QR);
      if (!qrCookie) throw new Error('Cookies are disabled');

      const docRef = doc(this.db, 'temp', qrCookie);
      const docSnapshot: any = await getDoc(docRef);
      if (!docSnapshot.exists()) throw new Error('Operation timed out');

      const data = docSnapshot.data();
      if (!data.token) throw new Error('Not logged in');

      const userCredential = await signInWithEmailAndPassword(this.auth, data.email, data.password) //madre mia me cago encima - here i need a function to login using auth, user, token or whatever but not external providers
      const user = new MyUser(userCredential.user)
      user.lastLoginAt = Date.now()
      await this.checkRoles(user)
      await this.updateDbUser(user)
      this.updateCookieToken()
      this.deleteCookie(COOKIE_QR)

      return userCredential;
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth)
    this.deleteCookie(COOKIE_TOKEN)
  }

  async deleteAccount(user: User = this.auth.currentUser!): Promise<void> {
    await this.deleteDbUserInfo()
    await user.delete()
    this.deleteAllCookies()
  }

  async updateUser(newUserData: any, user: any = this.auth.currentUser): Promise<void> {
    await this.updateAuthUser(newUserData, user)
    await this.updateDbUser(newUserData, user)
  }

  private async updateAuthUser(newUserData: any, user: any = this.auth.currentUser): Promise<void> {
    const { email, password, phone, username, avatarUrl } = newUserData
    if (email && email != user.email) await updateEmail(user, email)
    if (password) await updatePassword(user, password)
    if (phone && phone != user.phoneNumber) await updatePhoneNumber(user, phone)
    if (username && username != user.displayName) await updateProfile(user, { displayName: username })
    if (avatarUrl && avatarUrl != user.photoURL) await updateProfile(user, { photoURL: avatarUrl })
  }

  private async updateDbUser(newUserData: any, user: any = this.auth.currentUser): Promise<void> {
    if (this.PWD_HASHING_ENABLED && newUserData.password) newUserData.password = bcrypt.hashSync(newUserData.password, 10);
    const userDocRef = doc(this.db, 'users', user.uid)
    await setDoc(userDocRef, { ...newUserData }, { merge: true })
  }

  private async updateCookieToken(): Promise<void> {
    const me = this.auth.currentUser
    if (me) {
      const token = await me.getIdToken()
      this.setCookie(COOKIE_TOKEN, token)
    }
  }

  private async checkRoles(user: any = this.auth.currentUser): Promise<void> {
    const docRef = doc(this.db, 'admin', 'userManagement')
    const docSnapshot = await getDoc(docRef)
    if (docSnapshot.exists()) {
      const docData = docSnapshot.data()
      user.isAdmin = docData['adminEmails'].includes(user.email)
      user.isMod = docData['modEmails'].includes(user.email)
      const result: any = await this.http.get('https://api.ipify.org?format=json').toPromise()
      if (docData['bannedIps'].includes(result.ip)) {
        this.deleteAccount(user)
        return Promise.reject('You have been banned')
      }
    } else {
      await setDoc(docRef, { adminEmails: [''], modEmails: [''], bannedIps: [''] })
    }
  }

  //a partir de aqui todo roto

  //no devuelve el codigo
  async resetPasswordSend(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email, actionCodeSettings)
  }

  //no devuelve el codigo
  async resetPasswordCheck(code: string, password: string): Promise<void> {
    await confirmPasswordReset(this.auth, code, password)
  }

  //no funca
  async loginWithLinkSend(email: string) {
    await sendSignInLinkToEmail(this.auth, email, actionCodeSettings)
  }

  //no funca
  async loginWithLinkCheck(email: string, link: string): Promise<UserCredential> {
    if (isSignInWithEmailLink(this.auth, link)) {
      const userCredential = await signInWithEmailLink(this.auth, email, link)
      this.updateCookieToken()
      return userCredential
    } else {
      return Promise.reject()
    }
  }

  //no se gestiona en la web
  async sendVerificationEmail(user: any = this.auth.currentUser): Promise<void> {
    await sendEmailVerification(user, actionCodeSettings)
  }

  //no se gestiona en la web
  async verifyEmail(code: string): Promise<void> {
    await applyActionCode(this.auth, code)
  }

  //#endregion
  //#region Firestore database module

  async getHighestRole(): Promise<string> {
    const user = await this.getDbUser()
    return (user.isAdmin ? 'admin' : (user.isMod ? 'mod' : ''))
  }

  async getDbUser(user: any = this.auth.currentUser): Promise<any> {
    const userRef = doc(this.db, 'users', user.uid)
    const docSnapshot = await getDoc(userRef)
    if (docSnapshot.exists()) {
      return docSnapshot.data()
    } else {
      return Promise.reject('User document does not exist.')
    }
  }

  async getDbUserById(uid: string): Promise<any> {
    const userRef = doc(this.db, 'users', uid)
    const docSnapshot = await getDoc(userRef)
    if (docSnapshot.exists()) {
      return docSnapshot.data()
    } else {
      return Promise.reject('User document does not exist.')
    }
  }

  async getDbAllUsers(): Promise<any[]> {
    const usersRef = collection(this.db, 'users')
    const querySnapshot = await getDocs(usersRef)
    const users: any[] = []
    querySnapshot.forEach((doc) => {
      users.push(doc.data())
    })
    return users
  }

  //esto sobra
  private async checkDbUserExists(user: any = this.auth.currentUser): Promise<boolean> {
    const userDocRef = doc(this.db, 'users', user.uid)
    const docSnapshot = await getDoc(userDocRef)
    const exists = docSnapshot.exists()
    return exists
  }

  async deleteDbUserInfo(user: any = this.auth.currentUser): Promise<void> {
    if (user) {
      const userDocRef = doc(this.db, 'users', user.uid)
      const result = await deleteDoc(userDocRef)
      return result
    } else {
      return Promise.reject('No user signed in.')
    }
  }

  //#endregion

}