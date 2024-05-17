import { Component, Input } from '@angular/core';
import { routingTable } from 'src/app/app-routing.module';

@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.scss']
})
export class RouterComponent {
  @Input() route!: string
  routes: { [key: string]: string } = routingTable

  constructor() {
    if (!(this.route in this.routes)) {
      throw new Error(`Invalid route: ${this.route}. Valid routes are: ${Object.keys(this.routes).join(', ')}`);
    }
  }

}
