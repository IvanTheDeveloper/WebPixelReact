import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Auth, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signInWithPopup, signOut, updatePassword, updateProfile } from '@angular/fire/auth';
import { Firestore, collection, collectionData, getFirestore, doc, updateDoc, setDoc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { getRandomHexColor } from '../others/utils';
import { UploadFileService } from './upload-file.service';
import { User } from '../models/user';
const bcrypt = require('bcryptjs'); // wtf? que es esto me quiero morir

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly COOKIE_KEY = 'auth_token'
  private readonly defaultAuthProperties = ['email', 'displayName', 'phoneNumber', 'photoURL',]
  private readonly dataList = ['email', 'password', 'username', 'phone', 'address',]
  private readonly imageList = ['avatarUrl', 'cursorUrl',]
  private readonly roleList = ['admin', 'mod', 'visitor',]

  constructor(private cookieService: CookieService, private auth: Auth, private db: Firestore, private fileUploader: UploadFileService) { }

  //#region Authentication module

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

  signinWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(this.auth, new GoogleAuthProvider()).then(
      (userCredential) => {
        this.setAuthCurrentUserProperty('email', userCredential.user.email ?? '')
        this.setAuthCurrentUserProperty('displayName', userCredential.user.displayName ?? '')
        this.setAuthCurrentUserProperty('photoURL', userCredential.user.photoURL ?? '')
        this.setAuthCurrentUserProperty('phoneNumber', userCredential.user.phoneNumber ?? '')

        const userDocRef = doc(this.db, 'users', userCredential.user.uid)
        return getDoc(userDocRef).then((docSnapshot) => {
          if (!docSnapshot.exists()) {
            const user = new User({
              email: userCredential.user.email!, username: userCredential.user.displayName!,
              phone: userCredential.user.phoneNumber!, avatarUrl: userCredential.user.photoURL!
            })
            return setDoc(userDocRef, { ...user }, { merge: true }).then(
              () => {
                return userCredential
              },
              (error) => {
                deleteUser(userCredential.user)
                return Promise.reject(error)
              }
            )
          } else {
            this.updateLastLogin(userCredential.user.uid)
            return userCredential
          }
        })
      }
    )
  }

  private generateRandomAvatar(name: string) {
    name = encodeURIComponent(name)
    const color = getRandomHexColor()
    return `https://ui-avatars.com/api/?background=${color}&name=${name}`
    //return 'https://source.boringavatars.com'
  }

  register(email: string, password: string, username: string = 'user'): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        const generatedImg = this.generateRandomAvatar(username)
        this.setAuthCurrentUserProperty('displayName', username)
        return this.fileUploader.uploadFileByUrl(`images/${Date.now()}_${username}`, generatedImg).then((avatarUrl) => {
          this.setAuthCurrentUserProperty('photoURL', avatarUrl)

          const userDocRef = doc(this.db, 'users', userCredential.user.uid)
          const user = new User({ email, password: bcrypt.hashSync(password, 10), username, avatarUrl })
          return setDoc(userDocRef, { ...user }, { merge: true }).then(
            () => {
              return userCredential
            },
            (error) => {
              deleteUser(userCredential.user)
              return Promise.reject(error)
            }
          )
        })
      }
    )
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        this.updateLastLogin(userCredential.user.uid)
        return userCredential
      }
    )
  }

  private updateLastLogin(uid: string) {
    const userDocRef = doc(this.db, 'users', uid)
    setDoc(userDocRef, { records: { lastLogin: Date.now() } }, { merge: true })
  }

  logout(): Promise<void> {
    this.cookieService.delete(this.COOKIE_KEY)
    return signOut(this.auth)
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
      return (result.roles.admin ? 'admin' : (result.roles.mod ? 'mod' : ''))
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
    const array = path.split('.')
    const root = array[0]
    const child = array[1]
    if ((root == 'data' && this.dataList.includes(child)) ||
      (root == 'images' && this.imageList.includes(child)) ||
      (root == 'roles' && this.roleList.includes(child))) {
      return true;
    }
    else {
      return false
    }
  }

  //#endregion

}