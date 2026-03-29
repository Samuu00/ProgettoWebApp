import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Commenti } from '../models/comment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/commenti';

  constructor(private http: HttpClient) {}

  getAllComments(): Observable<Commenti[]> {
    return this.http.get<Commenti[]>(`${this.apiUrl}/all`);
  }

  getCommentsByRecipe(recipeId: number): Observable<Commenti[]> {
    return this.http.get<Commenti[]>(`${this.apiUrl}/ricetta/${recipeId}`);
  }

  addComment(recipeId: number, content: string): Observable<Commenti> {
    const userStr = localStorage.getItem('user');
    let username = 'Anonimo';
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        username = userObj.username || 'Anonimo';
      } catch (e) {
        username = userStr;
      }
    }

    const commentoDto = {
      content: content,
      recipeID: recipeId,
      authUsername: username
    };

    return this.http.post<Commenti>(`${this.apiUrl}/add`, commentoDto);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${commentId}`);
  }
}
