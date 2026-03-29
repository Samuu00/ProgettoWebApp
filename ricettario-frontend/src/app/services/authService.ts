import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, tap} from 'rxjs';
import { LoginRequest, AuthResponse, RegisterRequest } from '../models/auth';
import { Utente} from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService{
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient){}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  updateProfile(id: number, username: string): Observable<Utente> {

    const body = { id: id, username: username };

    return this.http.post<Utente>(`${this.apiUrl}/update-profile`, body).pipe(
      tap(updatedUser => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }, { responseType: 'text' as 'json' });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword }, {
      responseType: 'text' as 'json'
    });
  }

  verifyResetToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify-reset-token/${token}`, { responseType: 'text' });
  }

  register(data: RegisterRequest): Observable<any> { return this.http.post(`${this.apiUrl}/register`, data); }

  logOut(): void { localStorage.clear(); }

  getCurrentUser(): Utente | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.ruolo === 'ADMIN';
  }

  isLogged(): boolean {
    return localStorage.getItem('token') !== null;
  }
}
