import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { firebaseConfig } from '../firebase/firebase.module';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameReleaseService {
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

  getObjectById(id: string, route: string): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.get(`${this.firebaseUrl}/${this.ObjRootDir}/${route}/${id}.json?auth=${token}`)
  }

  createObjectAutogenId(obj: any, route: string): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.post(`${this.firebaseUrl}/${this.ObjRootDir}/${route}.json?auth=${token}`, obj).pipe(
      switchMap((response: any) => {
        const dbObjId = response.name
        const objWithId = { ...obj, id: dbObjId }
        return this.updateObject(objWithId, route)
      })
    )
  }

  createObject(obj: any, route: string): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(`${this.firebaseUrl}/${this.ObjRootDir}/${route}/${obj.id}.json?auth=${token}`, obj)
  }

  updateObject(obj: any, route: string): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.patch(`${this.firebaseUrl}/${this.ObjRootDir}/${route}/${obj.id}.json?auth=${token}`, obj)
  }

  deleteObject(obj: any, route: string): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.delete(`${this.firebaseUrl}/${this.ObjRootDir}/${route}/${obj.id}.json?auth=${token}`)
  }

  deleteObjectById(id: string, route: string): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.delete(`${this.firebaseUrl}/${this.ObjRootDir}/${route}/${id}.json?auth=${token}`)
  }

  //#endregion

}