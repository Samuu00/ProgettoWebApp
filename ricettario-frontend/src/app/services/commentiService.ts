import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Commenti } from '../models/comment';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private apiUrl = `${environment.apiUrl}/commenti`;
  private http = inject(HttpClient);

  getAllComments(): Observable<Commenti[]> {
    return this.http.get<Commenti[]>(`${this.apiUrl}/all`);
  }

  getCommentsByRecipe(recipeId: number): Observable<Commenti[]> {
    return this.http.get<Commenti[]>(`${this.apiUrl}/ricetta/${recipeId}`);
  }

  addComment(recipeId: number, content: string): Observable<Commenti> {
    // L'autore viene ricavato dal token lato backend.
    return this.http.post<Commenti>(`${this.apiUrl}/add`, { content, recipeID: recipeId });
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${commentId}`);
  }
}
