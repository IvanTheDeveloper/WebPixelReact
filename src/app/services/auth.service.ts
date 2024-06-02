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
  private readonly DEFAULT_AUTH_PROPERTIES = ['email', 'displayName', 'phoneNumber', 'photoURL',]
  private readonly USER_PROPERTIES = ['email', 'password', 'username', 'phone', 'address', 'avatarUrl', 'cursorUrl', 'admin', 'mod', 'visitor',]

  constructor(private cookieService: CookieService, private auth: Auth, private db: Firestore, private fileUploader: StorageService, private http: HttpClient) {
    //el http aki sobra
  }

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
    const alreadyExists = await this.checkUserExists(userCredential.user)
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
    this.cookieService.set(COOKIE_QR, docRef.id)
    const url = `${location.origin}/auth/${docRef.id}`
    return generateQrCode(url)
  }

  async loginWithQrConfirm(docName: string): Promise<void> {
    const docRef = doc(this.db, 'temp', docName)
    const docSnapshot: any = await getDoc(docRef)
    if (docSnapshot.exists()) {
      const user = await this.getDbUser()
      return setDoc(docRef, { token: this.cookieService.get(COOKIE_TOKEN), email: user.email, password: user.password }, { merge: true })
    }
    return Promise.reject('Auth code doesnt exist')
  }

  async loginWithQrComplete(): Promise<UserCredential> {
    const docRef = doc(this.db, 'temp', this.cookieService.get(COOKIE_QR))
    const docSnapshot: any = await getDoc(docRef)
    if (docSnapshot.exists()) {
      const data = docSnapshot.data()
      if (data.token) {
        const userCredential = await signInWithEmailAndPassword(this.auth, data.email, data.password) //madre mia me cago encima - here i need a function to login using auth, user, token or whatever but not external providers
        const user = new MyUser(userCredential.user)
        user.lastLoginAt = Date.now()
        await this.checkRoles(user)
        await this.updateDbUser(user)
        this.updateCookieToken()
        this.cookieService.delete(COOKIE_QR)
        return userCredential
      }
    }
    return Promise.reject()
  }

  private async deleteWithTimeout(docRef: any) {
    await new Promise(f => setTimeout(f, 60 * 1000))
    await deleteDoc(docRef)
  }

  async logout(): Promise<void> {
    await signOut(this.auth)
    this.cookieService.delete(COOKIE_TOKEN)
  }

  async deleteAccount(user: User = this.auth.currentUser!): Promise<void> {
    await user.delete()
    this.cookieService.delete(COOKIE_TOKEN)
    await this.deleteDbUserInfo()
  }

  //no manda code
  async resetPasswordSend(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email, actionCodeSettings)
  }

  //no manda code
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

  //no se gestiona en la app
  async sendVerificationEmail(user: any = this.auth.currentUser): Promise<void> {
    await sendEmailVerification(user, actionCodeSettings)
  }

  //no se gestiona en la app
  async verifyEmail(code: string): Promise<void> {
    await applyActionCode(this.auth, code)
  }

  async updateUser(newUserData: any, user: any = this.auth.currentUser): Promise<void> {
    await this.updateAuthUser(newUserData, user)
    //if (newUserData.password) newUserData.password = bcrypt.hashSync(newUserData.password, 10)
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
    const userDocRef = doc(this.db, 'users', user.uid)
    await setDoc(userDocRef, { ...newUserData }, { merge: true })
  }

  private async updateCookieToken(): Promise<void> {
    const me = this.auth.currentUser
    if (me) {
      const token = await me.getIdToken()
      this.cookieService.set(COOKIE_TOKEN, token)
      //window.localStorage.setItem(COOKIE_KEY, token)
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
        return Promise.reject('your have been banned')
      }
    } else {
      await setDoc(docRef, { adminEmails: [''], modEmails: [''], bannedIps: [''] })
    }
  }

  private async checkUserExists(user: any = this.auth.currentUser): Promise<boolean> {
    const userDocRef = doc(this.db, 'users', user.uid)
    const docSnapshot = await getDoc(userDocRef)
    const exists = docSnapshot.exists()
    return exists
  }

  //esta funcion se tiene que ir
  changePassword(password: string) {
    const currentUser = this.auth.currentUser
    if (currentUser) {
      return updatePassword(currentUser, password)
    } else {
      return Promise.reject('No user signed in.')
    }
  }

  //esta funcion se tiene que ir
  setAuthCurrentUserProperty(property: string, value: string): Promise<void> {
    const currentUser = this.auth.currentUser
    if (currentUser) {
      if (this.DEFAULT_AUTH_PROPERTIES.includes(property)) {
        //this.setDbCurrentUserProperty(property, value)
        return updateProfile(currentUser, { [property]: value })
        //return updatePassword(currentUser, value)
      } else {
        return Promise.reject('Invalid property.')
      }
    } else {
      return Promise.reject('No user signed in.')
    }
  }

  //#endregion
  //#region Firestore database module

  getHighestRole(): Promise<string> {
    return this.getDbCurrentUser().then((result) => {
      return (result.isAdmin ? 'admin' : (result.isMod ? 'mod' : ''))
    }).catch(() => {
      return Promise.reject()
    })
  }

  isAdmin(): Promise<boolean> {
    return this.getDbCurrentUser().then((result) => {
      return (result.isAdmin)
    }).catch(() => {
      return Promise.reject()
    })
  }

  deleteDbUserInfo(user: any = this.auth.currentUser): Promise<void> {
    if (user) {
      const userDocRef = doc(this.db, 'users', user.uid)
      return deleteDoc(userDocRef).then((result) => {
        return result
      }).catch((error) => {
        return Promise.reject(error)
      })
    } else {
      return Promise.reject('No user signed in.')
    }
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

  getDbAllUsers(): Promise<any[]> {
    const usersRef = collection(this.db, 'users')
    return getDocs(usersRef).then((querySnapshot) => {
      const users: any[] = []
      querySnapshot.forEach((doc) => {
        users.push(doc.data())
      })
      return users
    }).catch((error) => {
      return Promise.reject('Error fetching users data: ' + error)
    })
  }

  getDbUserById(uid: string): Promise<any> {
    const userRef = doc(this.db, 'users', uid)
    return getDoc(userRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        return docSnapshot.data()
      } else {
        return Promise.reject('User document does not exist.')
      }
    }).catch((error) => {
      return Promise.reject('Error fetching user data: ' + error)
    })
  }

  getDbCurrentUser(): Promise<any> {
    const userId = this.auth.currentUser?.uid
    if (userId) {
      const userRef = doc(this.db, 'users', userId)
      return getDoc(userRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          return docSnapshot.data()
        } else {
          return Promise.reject('User document does not exist.')
        }
      }).catch((error) => {
        return Promise.reject('Error fetching user data: ' + error)
      })
    } else {
      return Promise.reject('User not logged in.')
    }
  }

  getDbUserPropertyById(uid: string, property: string): Promise<any> {
    if (this.propertyExists(property)) {
      const userRef = doc(this.db, 'users', uid, property)
      return getDoc(userRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          return docSnapshot.data()
        } else {
          return Promise.reject('Property does not exist for the user.')
        }
      }).catch((error) => {
        return Promise.reject('Error fetching user property: ' + error)
      })
    } else {
      return Promise.reject('Invalid property.')
    }
  }

  getDbCurrentUserProperty(property: string): Promise<any> {
    const userId = this.auth.currentUser?.uid
    if (userId) {
      if (this.propertyExists(property)) {
        const userRef = doc(this.db, 'users', userId, property)
        return getDoc(userRef)
      } else {
        return Promise.reject('Invalid property.')
      }
    } else {
      return Promise.reject('User not logged in.')
    }
  }

  setDbCurrentUserProperty(property: string, value: string): Promise<void> {
    const userId = this.auth.currentUser?.uid
    if (userId) {
      if (this.propertyExists(property)) {
        if (property == 'password') {
          property = bcrypt.hashSync(property, 10)
        }
        const userRef = doc(this.db, 'users', userId)
        return setDoc(userRef, { [property]: value }, { merge: true })
      } else {
        return Promise.reject('Invalid property.')
      }
    } else {
      return Promise.reject('User not logged in.');
    }
  }

  private propertyExists(path: string) {
    return this.USER_PROPERTIES.includes(path)
  }

  //#endregion

}