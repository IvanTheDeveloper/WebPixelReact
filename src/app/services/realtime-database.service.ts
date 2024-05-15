import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map, switchMap } from 'rxjs';
import { firebaseConfig } from '../firebase/firebase.module';

@Injectable({
  providedIn: 'root'
})
export class RealtimeDatabaseService {
  private readonly COOKIE_KEY = 'auth_token'
  private readonly firebaseUrl = firebaseConfig.databaseURL
  private readonly ObjRootDir = 'releases'
  public localObjList: any[] = [] //get data

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  //#region Performance list operations

  //download data
  pullLocalObjList(): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY);
    return this.http.get(`${this.firebaseUrl}/${this.ObjRootDir}.json?auth=${token}`).pipe(
      map((response: any) => {
        this.localObjList = (response ? Object.values(response) : [])
        return this.localObjList
      })
    )
  }

  /*getObjectList(): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.get(`${this.firebaseUrl}/${this.ObjRootDir}.json?auth=${token}`)
  }*/

  //update data
  changeLocalObjList(obj: any): any[] {
    const index = this.localObjList.findIndex(parameter => parameter.id == obj.id)
    if (index > -1 && index < this.localObjList.length - 1) {
      this.localObjList[index] = obj
    }
    return this.localObjList
  }

  //upload data
  pushLocalObjList(objList: any): Observable<any> { //objList must be a dictionary (key-value)
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(`${this.firebaseUrl}/${this.ObjRootDir}.json?auth=${token}`, objList)
  }

  //#endregion
  //#region Obj CRUD

  get(path: string): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.get(`${this.firebaseUrl}/${path}.json?auth=${token}`)
  }

  post(path: string, obj: any): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.post(`${this.firebaseUrl}/${path}.json?auth=${token}`, obj)
  }

  put(path: string, obj: any): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(`${this.firebaseUrl}/${path}.json?auth=${token}`, obj)
  }

  patch(path: string, obj: any): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.patch(`${this.firebaseUrl}/${path}.json?auth=${token}`, obj)
  }

  delete(path: string): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.delete(`${this.firebaseUrl}/${path}.json?auth=${token}`)
  }

  //#endregion

}