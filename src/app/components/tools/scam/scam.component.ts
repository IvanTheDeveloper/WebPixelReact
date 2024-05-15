import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-scam',
  templateUrl: './scam.component.html',
  styleUrls: ['./scam.component.scss']
})
export class ScamComponent {

  constructor(private http: HttpClient) {

  }

  onCopy(event: ClipboardEvent) {
    event.preventDefault()
    const selectedText = window.getSelection()?.toString()
    if (selectedText) {
      const modifiedText = "Beware of this trick: "
      event.clipboardData?.setData('text/plain', modifiedText)
    }
  }

  openGoogleMaps() {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`
      window.open(url, '_blank')
    }, (error) => {
      console.error('Error: ', error)
    })
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org?format=json').subscribe((result: any) => {
      this.http.get('https://api.iplocation.net/?ip=' + result.ip).subscribe((data: any) => {
        alert(JSON.stringify(data))
      })
    })
  }

}
