import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { routingTable } from '../app-routing.module';

type AllowedRoutes = keyof typeof routingTable;

@Directive({
  selector: '[appMyRouter]'
})
export class MyRouterDirective {
  @Input('appMyRouter') appMyRouter!: AllowedRoutes

  constructor(private router: Router) { }

  @HostListener('click') onClick() {
    this.router.navigate([routingTable[this.appMyRouter]]);
  }

}
