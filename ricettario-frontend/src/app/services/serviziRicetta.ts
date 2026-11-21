import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { Ricetta } from '../models/ricetta';
import { RecipeFilter } from '../models/recipeFilter';
import { environment } from '../../environments/environment';

/** Il backend restituisce un array; versioni paginate restituiscono `{ content }`. */
export function toRecipeArray(res: Ricetta[] | { content?: Ricetta[] } | null): Ricetta[] {
  if (Array.isArray(res)) return res;
  return res?.content ?? [];
}

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private apiUrl = `${environment.apiUrl}/recipes`;
  private recipesCache = new Map<string, Observable<Ricetta[]>>();
  private favoritesCache?: Observable<Ricetta[]>;

  constructor(private http: HttpClient) {}

  private clearCache() {
    this.recipesCache.clear();
    this.favoritesCache = undefined;
  }

  getRecipes(page: number, size: number, filters?: RecipeFilter): Observable<Ricetta[]> {
    const cacheKey = JSON.stringify({ page, size, ...filters });
    const cached = this.recipesCache.get(cacheKey);
    if (cached) return cached;

    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('status', 'APPROVATA');

    if (filters?.title) params = params.set('title', filters.title);
    if (filters?.difficulty) params = params.set('difficulty', filters.difficulty);
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.author) params = params.set('author', filters.author);
    if (filters?.maxTime != null) params = params.set('tempoCottura', filters.maxTime);

    const request$ = this.http.get<Ricetta[] | { content?: Ricetta[] }>(`${this.apiUrl}/recipe-list`, { params }).pipe(
      map(toRecipeArray),
      shareReplay(1)
    );

    this.recipesCache.set(cacheKey, request$);
    setTimeout(() => this.recipesCache.delete(cacheKey), 60000);
    // Una richiesta fallita non deve restare in cache.
    request$.subscribe({ error: () => this.recipesCache.delete(cacheKey) });
    return request$;
  }

  getRecipeById(id: number): Observable<Ricetta> {
    return this.http.get<Ricetta>(`${this.apiUrl}/${id}`);
  }

  toggleFavorite(recipeId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${recipeId}/favorite`, {}).pipe(
      tap(() => (this.favoritesCache = undefined))
    );
  }

  isFavorite(recipeId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${recipeId}/favorite/check`);
  }

  countFavorites(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/favorite/count`);
  }

  getFavorites(): Observable<Ricetta[]> {
    if (!this.favoritesCache) {
      const request$ = this.http.get<Ricetta[]>(`${this.apiUrl}/favorites`).pipe(shareReplay(1));
      this.favoritesCache = request$;
      setTimeout(() => (this.favoritesCache = undefined), 30000);
      request$.subscribe({ error: () => (this.favoritesCache = undefined) });
    }
    return this.favoritesCache;
  }

  createRecipe(recipe: Ricetta): Observable<string> {
    return this.http.post(`${this.apiUrl}/recipe-create`, recipe, { responseType: 'text' }).pipe(
      tap(() => this.clearCache())
    );
  }

  updateRecipe(recipeId: number, newRecipe: Partial<Ricetta>): Observable<string> {
    return this.http.put(`${this.apiUrl}/recipe-edit/${recipeId}`, newRecipe, { responseType: 'text' }).pipe(
      tap(() => this.clearCache())
    );
  }

  /** Va chiamato dopo azioni che modificano le ricette fuori da questo service (es. moderazione). */
  invalidate(): void {
    this.clearCache();
  }
}
