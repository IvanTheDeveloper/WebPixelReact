import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  cursorUrl = '../../../assets/pointers/default.png'

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.delay()
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
