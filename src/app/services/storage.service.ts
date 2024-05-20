import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage, private http: HttpClient) { }

  deleteFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path)
    return deleteObject(storageRef)
  }

  uploadFile(fileOrUrl: any, path: string = `files/file_${Date.now()}`): Promise<string> {
    if (fileOrUrl instanceof File) {
      return this.storeByFile(fileOrUrl, path)
    } else {
      return this.storeByUrl(fileOrUrl, path)
    }
  }

  private storeByUrl(url: string, path: string): Promise<string> {
    return this.http.get(url, { responseType: 'blob' }).toPromise().then(
      (blob) => {
        if (blob) {
          return new File([blob], 'fileName', { type: blob.type });
        }
        return Promise.reject('error')
      }).then((file) => {
        return this.storeByFile(file, path)
      })
  }

  private storeByFile(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path)
    const uploadTask = uploadBytesResumable(storageRef, file)
    return new Promise<any>((resolve, reject) => {
      uploadTask.on('state_changed',
        (_snapshot) => { },
        (error) => reject(error),
        () => getDownloadURL(uploadTask.snapshot.ref).then(url => resolve(url))
      )
    })
  }

}