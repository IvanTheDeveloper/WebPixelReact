import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private storage: Storage, private http: HttpClient) { }

  uploadFileByUrl(filePath: string, url: string): Promise<any> {
    return this.http.get(url, { responseType: 'blob' }).toPromise().then(
      (blob) => {
        if (blob) {
          return new File([blob], 'newFile', { type: blob.type });
        }
        return Promise.reject('error')
      }).then((file) => {
        return this.uploadFile(filePath, file)
      })
  }

  uploadFile(filePath: string, file: File): Promise<any> {
    const storageRef = ref(this.storage, filePath)
    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise<any>((resolve, reject) => {
      uploadTask.on('state_changed',
        (_snapshot) => { },
        (error) => reject(error),
        () => getDownloadURL(uploadTask.snapshot.ref).then(url => resolve(url))
      )
    })
  }

  deleteFile(filePath: string): Promise<any> {
    const storageRef = ref(this.storage, filePath)
    return deleteObject(storageRef)
  }

}