import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authenticatedUsersGuard: CanActivateFn = (route, state) => {

  const login = inject(AuthService)
  const router = inject(Router)

  if (login.isAuthenticated()) {
    return true
  } else {
    router.navigateByUrl('/unauthorized')
    return false
  }

}