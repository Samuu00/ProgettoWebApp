import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { Utente } from '../models/user';
import { Ricetta } from '../models/ricetta';
import { RecipeService, toRecipeArray } from './serviziRicetta';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  users?: number;
  recipes?: number;
  mostCommonDiff?: string;
  facile?: number;
  medio?: number;
  difficile?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;
  private statsCache?: Observable<DashboardStats>;

  constructor(private http: HttpClient, private recipes: RecipeService) {}

  private changed() {
    this.statsCache = undefined;
    this.recipes.invalidate();
  }

  getAllUser(): Observable<Utente[]> {
    return this.http.get<Utente[]>(`${this.apiUrl}/users`);
  }

  getFullStats(): Observable<DashboardStats> {
    if (!this.statsCache) {
      const request$ = this.http.get<DashboardStats>(`${this.apiUrl}/stats/dashboard`).pipe(shareReplay(1));
      this.statsCache = request$;
      setTimeout(() => (this.statsCache = undefined), 30000);
      request$.subscribe({ error: () => (this.statsCache = undefined) });
    }
    return this.statsCache;
  }

  toggleUserBlock(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${userId}/toggle-block`, {}).pipe(tap(() => this.changed()));
  }

  updateUserRole(id: number, ruolo: string): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/users/${id}/role`, null, { params: { ruolo: ruolo.toUpperCase() } })
      .pipe(tap(() => this.changed()));
  }

  getPendingRecipes(page: number, size: number): Observable<Ricetta[]> {
    const params = new HttpParams().set('page', page).set('size', size).set('status', 'BOZZA');
    return this.http.get<Ricetta[]>(`${this.apiUrl}/moderation`, { params }).pipe(map(toRecipeArray));
  }

  getPendingRecipeById(id: number): Observable<Ricetta> {
    return this.http.get<Ricetta>(`${this.apiUrl}/moderation/${id}`);
  }

  approveRecipe(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/moderation/${id}/approve`, {}).pipe(tap(() => this.changed()));
  }

  rejectRecipe(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/moderation/${id}/reject`, {}).pipe(tap(() => this.changed()));
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/moderation/${id}/delete`).pipe(tap(() => this.changed()));
  }
}
