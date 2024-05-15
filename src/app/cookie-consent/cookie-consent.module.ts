import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'localhost'
  },
  position: 'bottom',
  theme: 'classic',
  palette: {
    popup: {
      background: '#000000',
      text: '#ffffff',
      link: '#ffffff'
    },
    button: {
      background: '#f1d600',
      text: '#000000',
      border: 'transparent'
    }
  },
  type: 'info',
  content: {
    message: 'We use cookies to ensure you get the best experience on our website.',
    dismiss: 'Got it!',
    deny: 'Refuse cookies',
    link: 'Learn more',
    href: 'privacy-policy',
    policy: 'Cookie Policy'
  }
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
  ]
})
export class CookieConsentModule { }
