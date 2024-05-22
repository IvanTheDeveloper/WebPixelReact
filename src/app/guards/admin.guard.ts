import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { routingTable } from '../app-routing.module';

export const adminGuard: CanActivateFn = (route, state) => {

  const login = inject(AuthService)
  const router = inject(Router)

  return login.getHighestRole().then(
    (result) => {
      if (result == 'admin') {
        return true
      } else {
        router.navigate([routingTable.forbidden])
        return false
      }
    },
    () => {
      router.navigate([routingTable.forbidden])
      return false
    }
  )

}
