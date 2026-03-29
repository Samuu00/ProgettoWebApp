import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { Utente } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';
  private statsCache$?: Observable<any>;

  constructor(private http: HttpClient) {}

  private clearStatsCache() {
    this.statsCache$ = undefined;
  }

  getAllUser(): Observable<Utente[]> {
    return this.http.get<Utente[]>(`${this.apiUrl}/users`);
  }

  getFullStats(): Observable<any> {
    if (!this.statsCache$) {
      this.statsCache$ = this.http.get<any>(`${this.apiUrl}/stats/dashboard`).pipe(
        shareReplay(1)
      );
      setTimeout(() => this.clearStatsCache(), 30000);
    }
    return this.statsCache$;
  }

  toggleUserBlock(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${userId}/toggle-block`, {}).pipe(
      tap(() => this.clearStatsCache())
    );
  }

  updateUserRole(id: number, ruolo: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}/role`, null, {
      params: { ruolo: ruolo.toUpperCase() }
    }).pipe(
      tap(() => this.clearStatsCache())
    );
  }

  getPendingRecipes(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', 'BOZZA');
    return this.http.get<any>(`${this.apiUrl}/moderation`, { params });
  }

  getPendingRecipeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/moderation/${id}`);
  }

  approveRecipe(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/moderation/${id}/approve`, {}).pipe(
      tap(() => this.clearStatsCache())
    );
  }

  rejectRecipe(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/moderation/${id}/reject`, {}).pipe(
      tap(() => this.clearStatsCache())
    );
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/moderation/${id}/delete`).pipe(
      tap(() => this.clearStatsCache())
    );
  }
}
