import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginRequest, AuthResponse, RegisterRequest } from '../models/auth';
import { Utente } from '../models/user';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/** Legge il claim `exp` di un JWT senza verificarne la firma (lo fa il backend). */
export function isJwtExpired(token: string, now = Date.now()): boolean {
  try {
    const payload = token.split('.')[1];
    if (!payload) return true;
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof json.exp === 'number' ? json.exp * 1000 <= now : false;
  } catch {
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly userState = signal<Utente | null>(this.readUser());

  /** Utente corrente, reattivo: la navbar si aggiorna dopo login/logout/modifica profilo. */
  readonly user = this.userState.asReadonly();
  readonly isAdminSignal = computed(() => this.userState()?.ruolo === 'ADMIN');

  constructor(private http: HttpClient) {
    if (!this.getToken()) this.clearSession();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.token);
        this.storeUser(response.user);
      })
    );
  }

  /** L'utente da modificare viene ricavato dal token lato backend. */
  updateProfile(username: string): Observable<Utente> {
    return this.http
      .post<Utente>(`${this.apiUrl}/update-profile`, { username })
      .pipe(tap((updatedUser) => this.storeUser(updatedUser)));
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }, { responseType: 'text' });
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword }, { responseType: 'text' });
  }

  verifyResetToken(token: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/verify-reset-token/${encodeURIComponent(token)}`, { responseType: 'text' });
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  logOut(): void {
    this.clearSession();
  }

  /** Token valido e non scaduto, altrimenti null. */
  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    return token && !isJwtExpired(token) ? token : null;
  }

  getCurrentUser(): Utente | null {
    return this.userState();
  }

  /** Solo per la UI: l'autorizzazione reale deve essere applicata dal backend. */
  isAdmin(): boolean {
    return this.isLogged() && this.isAdminSignal();
  }

  isLogged(): boolean {
    if (this.getToken()) return true;
    if (this.userState()) this.clearSession();
    return false;
  }

  private storeUser(user: Utente): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userState.set(user);
  }

  private readUser(): Utente | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as Utente) : null;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userState.set(null);
  }
}
