import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Auth, GoogleAuthProvider, User, UserCredential, createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signInWithPopup, signOut, updateCurrentUser, updateEmail, updatePassword, updatePhoneNumber, updateProfile } from '@angular/fire/auth';
import { Firestore, collection, collectionData, getFirestore, doc, updateDoc, setDoc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { dump, generateRandomAvatar, getRandomHexColor } from '../others/utils';
import { StorageService } from './storage.service';
import { MyUser } from '../models/user';
const bcrypt = require('bcryptjs'); // wtf? que es esto me quiero morir

export const COOKIE_KEY = 'auth_token'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly MAX_TIME = Infinity
  private readonly defaultAuthProperties = ['email', 'displayName', 'phoneNumber', 'photoURL',]
  private readonly properties = ['email', 'password', 'username', 'phone', 'address', 'avatarUrl', 'cursorUrl', 'admin', 'mod', 'visitor',]

  constructor(private cookieService: CookieService, private auth: Auth, private db: Firestore, private fileUploader: StorageService) { }

  //#region Authentication module

  private updateCookieToken(): void {
    const me = this.auth.currentUser
    if (me) {
      me.getIdToken().then((token) => {
        this.cookieService.set(COOKIE_KEY, token)
      }).catch(
        (error) => console.log('Couldnt retrieve token: ' + error)
      )
    }
  }

  isAuthenticated(): boolean {
    //console.log(JSON.stringify(this.auth.currentUser?.toJSON()))
    return this.cookieService.check(COOKIE_KEY)
  }

  async signinWithGoogle(): Promise<UserCredential> {
    const userCredential = await signInWithPopup(this.auth, new GoogleAuthProvider())
    const user = MyUser.createFromAuthUserWithDefaults(userCredential.user) //arreglar esto
    user.lastLoginAt = Date.now()
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
    user.username = username
    user.avatarUrl = url
    await this.updateAuthUser(user)
    alert(bcrypt.compareSync(user.password, bcrypt.hashSync(password, 10)))
    user.password = bcrypt.hashSync(password, 10)
    await this.updateDbUser(user)
    this.updateCookieToken()
    return userCredential
  }

  async login(email: string, password: string): Promise<UserCredential> {
    const userCredential = await this.withTimeout(signInWithEmailAndPassword(this.auth, email, password), this.MAX_TIME)
    const user = new MyUser({ lastLoginAt: Date.now() })
    await this.withTimeout(this.updateDbUser(user), this.MAX_TIME)
    this.updateCookieToken()
    return userCredential
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject("operation timed out"), timeoutMs)
    )
    return Promise.race([promise, timeout]);
  }

  async updateAuthUser(newUserData: any, user: any = this.auth.currentUser): Promise<void> {
    if (user) {
      const { email, password, phoneNumber: phone, displayName: username, photoURL: avatarUrl } = newUserData
      if (email && email != user.email) await updateEmail(user, email)
      if (password) await updatePassword(user, password)
      if (phone && phone != user.phoneNumber) await updatePhoneNumber(user, phone)
      if (username && username != user.displayName) await updateProfile(user, { displayName: username })
      if (avatarUrl && avatarUrl != user.photoURL) await updateProfile(user, { photoURL: avatarUrl })
    }
  }

  async updateDbUser(newUserData: any, user: any = this.auth.currentUser): Promise<void> {
    const userDocRef = doc(this.db, 'users', user.uid)
    await setDoc(userDocRef, { ...newUserData }, { merge: true })
  }

  async logout(): Promise<void> {
    await signOut(this.auth)
    this.cookieService.delete(COOKIE_KEY)
  }

  changePassword(password: string) {
    const currentUser = this.auth.currentUser
    if (currentUser) {
      return updatePassword(currentUser, password)
    } else {
      return Promise.reject('No user signed in.')
    }
  }

  deleteAccount(): Promise<void> {
    const currentUser = this.auth.currentUser
    if (currentUser) {
      return currentUser.delete().then((result) => {
        //this.deleteDbUserInfo()
        return result
      }).catch((error) => {
        return Promise.reject(error)
      })
    } else {
      return Promise.reject('No user signed in.')
    }
  }

  setAuthCurrentUserProperty(property: string, value: string): Promise<void> {
    const currentUser = this.auth.currentUser
    if (currentUser) {
      if (this.defaultAuthProperties.includes(property)) {
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

  get currentUser() {
    return this.auth.currentUser
  }

  //#endregion
  //#region Firestore database module

  getHighestRole(): Promise<string> {
    return this.getDbCurrentUser().then((result) => {
      return (result.admin ? 'admin' : (result.mod ? 'mod' : ''))
    }).catch(() => {
      return ''
    })
  }

  deleteDbUserInfo(): Promise<void> {
    const currentUser = this.auth.currentUser
    if (currentUser) {
      const userDocRef = doc(this.db, 'users', currentUser.uid)
      return deleteDoc(userDocRef).then((result) => {
        return result
      }).catch((error) => {
        return Promise.reject(error)
      })
    } else {
      return Promise.reject('No user signed in.')
    }
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
    return this.properties.includes(path)
  }

  //#endregion

}