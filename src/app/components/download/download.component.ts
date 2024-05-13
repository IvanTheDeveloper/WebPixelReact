import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

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

  url = 'https://firebasestorage.googleapis.com/v0/b/ivandevwebsite.appspot.com/o/releases%2FTest.zip?alt=media&token=02370c7e-b38b-46d7-ba1f-df7964472a15'

  constructor() { }

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

}