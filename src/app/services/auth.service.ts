import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Auth, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from '@angular/fire/auth';
import { Firestore, collection, collectionData, getFirestore, doc, updateDoc, setDoc, getDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly COOKIE_KEY = 'my_auth_token'
  private readonly defaultAuthProperties = ['email', 'displayName', 'phoneNumber', 'photoURL',]
  private readonly dataList = ['email', 'password', 'username', 'phone', 'address',]
  private readonly imageList = ['avatarUrl', 'cursorUrl',]
  private readonly roleList = ['admin', 'mod', 'visitor',]

  constructor(private cookieService: CookieService, private auth: Auth, private db: Firestore) { }

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
        const userDocRef = doc(this.db, 'users', userCredential.user.uid)
        return getDoc(userDocRef).then((docSnapshot) => {
          if (!docSnapshot.exists()) {
            const user = {
              data: {
                email: userCredential.user.email,
                password: null,
                username: userCredential.user.displayName,
                phone: userCredential.user.phoneNumber,
                address: null,
              },
              images: {
                avatarUrl: userCredential.user.photoURL,
                cursorUrl: null,
              },
              roles: {
                admin: false,
                mod: false,
              },
              records: {
                accountCreated: Date.now(),
                lastLogin: Date.now(),
              },
            }
            return setDoc(userDocRef, user, { merge: true }).then(
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
  register(email: string, password: string): Promise<UserCredential> {
    password = require('bcryptjs').hashSync(password, 10) //wtf es esto me quiero morir
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        const userDocRef = doc(this.db, 'users', userCredential.user.uid)
        const user = {
          data: {
            email,
            password,
            phone: null,
            username: 'user',
          },
          images: {
            avatarUrl: null,
            cursorUrl: null,
          },
          roles: {
            admin: false,
            mod: false,
          },
          records: {
            accountCreated: Date.now(),
            lastLogin: Date.now(),
          },
        }
        return setDoc(userDocRef, user, { merge: true }).then(
          () => {
            return userCredential
          },
          (error) => {
            deleteUser(userCredential.user)
            return Promise.reject(error)
          }
        )
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
    return getDoc(userRef)
  }

  getDbCurrentUser(): Promise<any> {
    const userId = this.auth.currentUser?.uid
    if (userId) {
      const userRef = doc(this.db, 'users', userId)
      return getDoc(userRef)
    } else {
      return Promise.reject('User not logged in.')
    }
  }

  getDbUserPropertyById(uid: string, property: string): Promise<any> {
    if (uid) {
      if (this.propertyExists(property)) {
        const userRef = doc(this.db, 'users', uid, property)
        return getDoc(userRef)
      } else {
        return Promise.reject('Invalid property.')
      }
    } else {
      return Promise.reject('User not logged in.')
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

  //#region 

}