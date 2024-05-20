import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { dump } from 'src/app/others/utils';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent {

  constructor(private http: HttpClient) { }

  @HostListener('copy', ['$event'])
  onCopy(event: ClipboardEvent) {
    event.preventDefault()
    const selectedText = window.getSelection()?.toString()
    if (selectedText) {//set to true to capture all copy events
      const modifiedText = "Beware of this trick"
      event.clipboardData?.setData('text/plain', modifiedText)
    }
  }

  openGoogleMaps() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`
        window.open(url, '_blank')
      }, () => {
        console.error('Geolocation ermission denied')
      })
  }

  sendData() {
    const backendUrl = ''
    const userData = {
      userAgent: navigator.userAgent,
      language: navigator.language
    }
    this.http.post(backendUrl, userData)
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org?format=json').subscribe((result: any) => {
      this.http.get('https://api.iplocation.net/?ip=' + result.ip).subscribe((data: any) => {
        alert(JSON.stringify(data))
      })
    })
  }

}
