import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private serverUrl = 'https://silicon-ultra-babcat.glitch.me';
  private localUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  sendEmail(recipient: string, subject: string, message: string, sender: string): Observable<any> {
    const body = {
      recipient: recipient,
      subject: subject,
      message: message,
      sender: sender
    };
    return this.http.post(this.serverUrl + '/mail', body);
  }

  test(): Observable<any> {
    return this.http.get(this.localUrl);
  }

}
