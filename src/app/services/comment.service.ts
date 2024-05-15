import { Injectable } from '@angular/core';
import { firebaseConfig } from '../firebase/firebase.module';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly COOKIE_KEY = 'auth_token'
  private readonly FIREBASE_URL = firebaseConfig.databaseURL
  private readonly DB_FOLDER = 'comments'
  private objectList: any[] = []
  private token: any
  private options: any

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  private updateHttp() {
    this.token = this.cookieService.get(this.COOKIE_KEY)
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    }
  }

  refreshObjectList(obj: any): any[] {
    const index = this.objectList.findIndex(parameter => parameter.id == obj.id)
    if (index >= 0 && index < this.objectList.length) {
      this.objectList[index] = obj
    }
    return this.objectList
  }

  getObjectById(id: string): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.get(this.FIREBASE_URL + '/' + this.DB_FOLDER + '/' + id + '.json?auth=' + token)
  }

  getObjectList(): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.get(this.FIREBASE_URL + '/' + this.DB_FOLDER + '.json?auth=' + token)
  }

  addObjectList(objList: any): Observable<any> { //objList must be a dictionary (key-value)
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.FIREBASE_URL + '/' + this.DB_FOLDER + '.json?auth=' + token, objList)
  }

  createObject(obj: any): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY);
    return this.http.post(this.FIREBASE_URL + '/' + this.DB_FOLDER + '.json?auth=' + token, obj).pipe(
      switchMap((response: any) => {
        const newId = response.name
        const objWithId = { ...obj, id: newId }
        return this.updateObject(objWithId)
      })
    )
  }

  updateObject(obj: any): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.FIREBASE_URL + '/' + this.DB_FOLDER + '/' + obj.id + '.json?auth=' + token, obj)
  }

  deleteObject(obj: any): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.delete(this.FIREBASE_URL + '/' + this.DB_FOLDER + '/' + obj.id + '.json?auth=' + token)
  }

  deleteObjectById(id: string): Observable<any> {
    this.updateHttp()
    return this.http.delete(this.FIREBASE_URL + '/' + this.DB_FOLDER + '/' + id + '.json?auth=' + this.token, this.options)
  }


}