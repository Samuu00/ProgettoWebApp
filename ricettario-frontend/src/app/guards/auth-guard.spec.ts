import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { authGuard } from './auth-guard';
import { AdminGuard } from './adminGuard';
import { isJwtExpired } from '../services/authService';
import { safeReturnUrl } from '../components/auth/login/login';
import { parseIngredients } from '../components/recipes/recipe-form/recipe-form';

const b64 = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, '');
const jwt = (expSecondsFromNow: number) => `${b64({ alg: 'HS256' })}.${b64({ exp: Math.floor(Date.now() / 1000) + expSecondsFromNow })}.sig`;

function login(token: string, ruolo: 'STANDARD' | 'ADMIN' = 'STANDARD') {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({ id: 1, username: 'chef', email: 'c@x.it', ruolo, stato: false }));
}

describe('auth', () => {
  const state = { url: '/favorites' } as RouterStateSnapshot;
  const route = {} as ActivatedRouteSnapshot;
  const run = (guard: typeof authGuard) => TestBed.runInInjectionContext(() => guard(route, state));

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient()] });
  });

  it('isJwtExpired riconosce token scaduti e malformati', () => {
    expect(isJwtExpired(jwt(3600))).toBeFalse();
    expect(isJwtExpired(jwt(-10))).toBeTrue();
    expect(isJwtExpired('not-a-jwt')).toBeTrue();
  });

  it('authGuard rimanda al login con returnUrl se non autenticato o token scaduto', () => {
    login(jwt(-10));
    const res = run(authGuard) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(res)).toBe('/login?returnUrl=%2Ffavorites');
  });

  it('authGuard lascia passare un token valido', () => {
    login(jwt(3600));
    expect(run(authGuard)).toBeTrue();
  });

  it('AdminGuard blocca gli utenti standard e lascia passare gli admin', () => {
    login(jwt(3600));
    expect(TestBed.inject(Router).serializeUrl(run(AdminGuard) as UrlTree)).toBe('/recipe-list');
    login(jwt(3600), 'ADMIN');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient()] });
    expect(run(AdminGuard)).toBeTrue();
  });

  it('safeReturnUrl rifiuta redirect esterni', () => {
    expect(safeReturnUrl('/recipe/3')).toBe('/recipe/3');
    expect(safeReturnUrl('//evil.com')).toBeNull();
    expect(safeReturnUrl('https://evil.com')).toBeNull();
  });

  it('parseIngredients interpreta quantita, unita e q.b.', () => {
    expect(parseIngredients('320 g riso\nsale')).toEqual([
      { quantita: 320, unitaMis: 'g', name: 'riso' },
      { quantita: 1, unitaMis: 'qb', name: 'sale' },
    ]);
  });
});
