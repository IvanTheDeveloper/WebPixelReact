import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { routingTable } from '../app-routing.module';

export const authenticatedUsersGuard: CanActivateFn = (route, state) => {

  const login = inject(AuthService)
  const router = inject(Router)

  if (login.isAuthenticated()) {
    return true
  } else {
    router.navigate([routingTable.unauthorized])
    return false
  }

}