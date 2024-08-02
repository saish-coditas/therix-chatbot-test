import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const access = inject(AuthService).getConfigData();
  if (access) {
    return true;
  }
  const router = inject(Router);
  setTimeout(() => { router.navigateByUrl('/chat') }, 1000 );
  return false;
};
