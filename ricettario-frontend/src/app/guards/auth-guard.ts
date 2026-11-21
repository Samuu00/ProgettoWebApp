import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  return auth.isLogged()
    ? true
    : inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/** Pagine di login/registrazione: chi e' gia' autenticato va direttamente alle ricette. */
export const guestGuard: CanActivateFn = () => {
  return inject(AuthService).isLogged() ? inject(Router).createUrlTree(['/recipe-list']) : true;
};
