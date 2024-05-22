import { Component } from '@angular/core';
import { routingTable } from 'src/app/app-routing.module';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent {
  readonly routes = routingTable
  readonly placeholderImg = 'assets/images/error403.png'

}
