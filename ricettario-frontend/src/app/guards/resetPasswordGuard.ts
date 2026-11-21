import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/authService';

const JWT_PATTERN = /^[\w-]+\.[\w-]+\.[\w-]+$/;

export const ResetPasswordGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = route.paramMap.get('token');
  const invalid = router.createUrlTree(['/forgot-password'], { queryParams: { invalid: 1 } });

  if (!token || !JWT_PATTERN.test(token)) {
    return invalid;
  }

  return authService.verifyResetToken(token).pipe(
    map(() => true),
    catchError(() => of(invalid))
  );
};
