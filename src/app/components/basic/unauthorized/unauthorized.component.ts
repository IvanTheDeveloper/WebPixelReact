import { Component } from '@angular/core';
import { routingTable } from 'src/app/app-routing.module';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {
  readonly routes = routingTable
  readonly placeholderImg = 'assets/images/error401.svg'

}
