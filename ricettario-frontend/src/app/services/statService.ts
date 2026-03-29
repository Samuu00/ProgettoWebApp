import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Rating } from '../models/rating';

@Injectable({ providedIn: 'root'})
export class StatService {
  private apiUrl = 'http://localhost:8080/api/stats';
  private apiKey = process.env.API_KEY;
  private videoCache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  getRatings(recipeId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/ratings/${recipeId}`);
  }

  checkRating(recipeId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-rating/${recipeId}`);
  }

  addRating(recipeId: number, rating: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/rating/${recipeId}`, { rating });
  }

  getVideoTutorial(recipeTitle: string): Observable<any> {
    if (this.videoCache.has(recipeTitle)) {
      return of(this.videoCache.get(recipeTitle));
    }

    const query = encodeURIComponent(recipeTitle + ' ricetta tutorial');
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoEmbeddable=true&maxResults=1&key=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      tap(res => {
        if (res.items && res.items.length > 0) {
          this.videoCache.set(recipeTitle, res);
        }
      })
    );
  }
}
