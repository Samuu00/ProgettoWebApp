import { inject } from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import { AuthService } from '../services/authService';

export const AdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isLogged() && authService.isAdmin()){
    return true;
  }else{
    const target = authService.isLogged() ? ['/recipes'] : ['/login'];
    router.navigate(target);
    return false;
  }
}
