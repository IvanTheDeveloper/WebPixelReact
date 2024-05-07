import { Injectable } from '@angular/core';
import { firebaseConfig } from '../firebase/firebase.module';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly COOKIE_KEY = 'my_auth_token'
  private firebaseUrl = firebaseConfig.databaseURL
  private firebaseFolder = 'comments'
  private objectList: any[] = []

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  refreshObjectList(obj: any): any[] {
    const index = this.objectList.findIndex(parameter => parameter.id == obj.id)
    if (index >= 0 && index < this.objectList.length) {
      this.objectList[index] = obj
    }
    return this.objectList
  }

  getObjectList(): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.get(this.firebaseUrl + '/' + this.firebaseFolder + '.json?auth=' + token)
  }

  saveObjectList(objList: any): Observable<any> { //objList must be a dictionary (key-value)
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.firebaseUrl + '/' + this.firebaseFolder + '.json?auth=' + token, objList)
  }

  addObject(obj: any): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY);
    return this.http.post(this.firebaseUrl + '/' + this.firebaseFolder + '.json?auth=' + token, obj).pipe(
      switchMap((response: any) => {
        const newId = response.name
        const objWithId = { ...obj, id: newId }
        return this.updateObject(objWithId)
      })
    )
  }

  updateObject(obj: any): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.firebaseUrl + '/' + this.firebaseFolder + '/' + obj.id + '.json?auth=' + token, obj)
  }

  deleteObject(obj: any): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.delete(this.firebaseUrl + '/' + this.firebaseFolder + '/' + obj.id + '.json?auth=' + token)
  }

  deleteObjectById(id: string): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    }
    return this.http.delete(this.firebaseUrl + '/' + this.firebaseFolder + '/' + id + '.json?auth=' + token, httpOptions)
  }

}