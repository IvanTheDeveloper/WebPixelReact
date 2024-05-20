import { Component } from '@angular/core';
import { routingTable } from 'src/app/app-routing.module';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
  readonly routes = routingTable
  readonly placeholderImg = 'assets/images/error404.svg'

}