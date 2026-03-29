import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, tap} from 'rxjs';
import { Ricetta } from '../models/ricetta';


@Injectable({ providedIn: 'root' })
export class RecipeService {
  private apiUrl = 'http://localhost:8080/api/recipes';
  private recipesCache$ = new Map<string, Observable<any>>();
  private favoritesCache$?: Observable<Ricetta[]>;

  constructor(private http: HttpClient) {}

  private clearCache() {
    this.recipesCache$.clear();
    this.favoritesCache$ = undefined;
  }

  getRecipes(page: number, size: number, filters?: any): Observable<any> {
    const cacheKey = JSON.stringify({ page, size, ...filters });

    if (this.recipesCache$.has(cacheKey)) {
      return this.recipesCache$.get(cacheKey)!;
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', 'APPROVATA');

    if (filters) {
      if (filters.title) params = params.set('title', filters.title);
      if (filters.difficulty) params = params.set('difficulty', filters.difficulty);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.author) params = params.set('author', filters.author);
      if (filters.maxTime !== undefined && filters.maxTime !== null) {
        params = params.set('tempoCottura', filters.maxTime.toString());
      }
    }

    const request$ = this.http.get<any>(`${this.apiUrl}/recipe-list`, { params }).pipe(
      shareReplay(1)
    );

    this.recipesCache$.set(cacheKey, request$);
    setTimeout(() => this.recipesCache$.delete(cacheKey), 60000);

    return request$;
  }

  getRecipeById(id: number): Observable<Ricetta> {
    return this.http.get<Ricetta>(`${this.apiUrl}/${id}`).pipe(shareReplay(1));
  }

  getRecipeByName(name: string): Observable<Ricetta> {
    return this.http.get<Ricetta>(`${this.apiUrl}/name/${name}`).pipe(shareReplay(1));
  }

  toggleFavorite(recipeId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${recipeId}/favorite`, {}).pipe(
      tap(() => this.favoritesCache$ = undefined)
    );
  }

  getRecipeFavoritesById(recipeId: number): Observable<boolean> {
    const token = localStorage.getItem('token');

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return this.http.get<boolean>(`${this.apiUrl}/${recipeId}/favorite/check`, { headers });
  }

  countFavorites(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/favorite/count`);
  }

  getFavorites(): Observable<Ricetta[]> {
    if (!this.favoritesCache$) {
      this.favoritesCache$ = this.http.get<Ricetta[]>(`${this.apiUrl}/favorites`).pipe(
        shareReplay(1)
      );
      setTimeout(() => this.favoritesCache$ = undefined, 30000);
    }
    return this.favoritesCache$;
  }

  createRecipe(recipe: Ricetta): Observable<any> {
    return this.http.post(`${this.apiUrl}/recipe-create`, recipe, { responseType: 'text' as 'json' }).pipe(
      tap(() => this.clearCache())
    );
  }

  updateRecipe(recipeId: number, newRecipe: Partial<Ricetta>): Observable<any> {
    return this.http.put(`${this.apiUrl}/recipe-edit/${recipeId}`, newRecipe, { responseType: 'text' as 'json' }).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }
}
