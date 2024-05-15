import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userAuthenticated = false
  username: string = ''
  role: string | null = null
  avatar: string | null = null
  darkMode = false

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.update()
      }
    })
  }

  update() {
    this.userAuthenticated = this.auth.isAuthenticated()
    this.username = this.auth.currentUser?.displayName ?? 'You'
    this.avatar = this.auth.currentUser?.photoURL ?? null
    this.auth.getHighestRole().then(result => {
      this.role = result
    })
  }

  logout() {
    this.auth.logout()
  }

  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  }

}