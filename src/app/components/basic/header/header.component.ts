import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { routingTable } from 'src/app/app-routing.module';
import { darkModeEnabled } from 'src/app/others/globalProperties';
import { MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  routes = routingTable
  darkMode = darkModeEnabled
  any: MatTabNavPanel = new MatTabNavPanel()
  userAuthenticated = false
  username: string | null = null
  role: string | null = null
  avatar: string | null = null

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.delay()
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.update()
      }
    })
  }

  async delay() {
    await new Promise(f => setTimeout(f, 500))
    this.update()
  }

  update() {
    this.userAuthenticated = this.auth.isAuthenticated()
    if (this.userAuthenticated) {
      this.username = this.auth.currentUser?.displayName ?? 'You'
      this.avatar = this.auth.currentUser?.photoURL ?? null
      this.auth.getHighestRole().then(result => {
        this.role = result
      })
    }
  }

  logout() {
    this.auth.logout().then(() => {
      this.update()
      this.router.navigate([this.routes.login])
    })
  }

  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  }

}