import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UploadFileService } from 'src/app/services/upload-file.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent {
  language = ''
  architecture = ''
  platform = ''
  selectedTabIndex: number = 0;

  fileName = ''
  isUploading = false
  task!: Promise<string>
  url = 'https://firebasestorage.googleapis.com/v0/b/ivandevwebsite.appspot.com/o/releases%2FTest.zip?alt=media&token=02370c7e-b38b-46d7-ba1f-df7964472a15'

  constructor(private uploadFileService: UploadFileService) { }

  ngOnInit() {
    this.language = navigator.language
    this.architecture = navigator.userAgent.includes("x64") ? 'x64' : 'x32'
    const platform = navigator.platform.toLowerCase()
    if (platform == 'win32') {
      this.platform = 'Windows'
      this.selectedTabIndex = 0
    } else if (platform == 'macintel') {
      this.platform = 'MacOS'
      this.selectedTabIndex = 1
    } else if (platform == 'linux x86_64') {
      this.platform = 'Linux'
      this.selectedTabIndex = 2
    }
  }

  tabChanged(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index;
  }

  onFileSelected(event: any) {
    /*const filePath = `releasaes/widows/installer.exe`;
    filePath = `releases/linux/portable.zip`;*/
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const filePath = `releases/${this.fileName}`; //${Date.now()}_
      this.task = this.uploadFileService.uploadFile(filePath, file)
      this.isUploading = true
      this.task.then(
        (result) => {
          this.url = result;
          alert(this.url)
          this.reset()
        }
      ).catch((error) => {
        console.log("error: " + error)
        this.reset()
      })
    }
  }

  cancelUpload() {
    this.task.then(
      (result) => {
        this.uploadFileService.deleteFile(result)
      }
    ).catch((error) => {
      console.log("error: " + error)
    })
    this.reset()
    this.fileName = ''
    this.url = ''
  }

  reset() {
    this.isUploading = false
  }

}