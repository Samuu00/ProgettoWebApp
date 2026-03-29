import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const ResetPasswordGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = route.paramMap.get('token');

  if (!token || token === ':token' || token.length < 10) {
    router.navigate(['/login']);
    return false;
  }

  const tokenPattern = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+?)$/;
  if (!tokenPattern.test(token)) {
    router.navigate(['/login']);
    return false;
  }

  return authService.verifyResetToken(token).pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
