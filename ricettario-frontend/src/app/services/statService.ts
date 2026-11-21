import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const YT_ID = /^[\w-]{11}$/;

@Injectable({ providedIn: 'root' })
export class StatService {
  private apiUrl = `${environment.apiUrl}/stats`;
  private videoCache = new Map<string, string | null>();

  constructor(private http: HttpClient) {}

  /** Media voti della ricetta (il backend restituisce un numero, 0 se nessun voto). */
  getRatings(recipeId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/ratings/${recipeId}`).pipe(map((v) => Number(v) || 0));
  }

  checkRating(recipeId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-rating/${recipeId}`);
  }

  addRating(recipeId: number, rating: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/rating/${recipeId}`, { rating });
  }

  /** Restituisce un videoId YouTube validato, oppure null. Nessuna chiamata se manca la chiave. */
  getVideoTutorialId(recipeTitle: string): Observable<string | null> {
    if (!environment.youtubeApiKey) return of(null);
    if (this.videoCache.has(recipeTitle)) return of(this.videoCache.get(recipeTitle) ?? null);

    const params = {
      part: 'snippet',
      q: `${recipeTitle} ricetta tutorial`,
      type: 'video',
      videoEmbeddable: 'true',
      maxResults: '1',
      key: environment.youtubeApiKey,
    };
    return this.http
      .get<{ items?: { id?: { videoId?: string } }[] }>('https://www.googleapis.com/youtube/v3/search', { params })
      .pipe(
        map((res) => {
          const id = res.items?.[0]?.id?.videoId;
          return id && YT_ID.test(id) ? id : null;
        }),
        tap((id) => this.videoCache.set(recipeTitle, id))
      );
  }
}
