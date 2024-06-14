import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DevModeService } from 'src/app/services/dev-mode.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  devModeEnabled = this.devMode.devModeEnabled
  cursorUrl: string = '../../../assets/pointers/default.png'

  constructor(private auth: AuthService, private devMode: DevModeService, private router: Router) { }

  ngOnInit() {
    this.delay()
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.devModeEnabled = this.devMode.devModeEnabled
      }
    })
  }

  private async delay() {
    await new Promise(f => setTimeout(f, 500))
    //this.update()
  }

  private update() {
    this.auth.getDbUser().then((result) => {
      if (result.cursorUrl) {
        console.log(result.cursorUrl)
        this.cursorUrl = result.cursorUrl
      }
    })
  }

}
