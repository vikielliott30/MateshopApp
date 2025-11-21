import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Mate } from './mate.model';
import { AuthService } from './auth.service'
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class MateService {
  apiUrlBookPost = environment.apiUrl + '/mates';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllBookPosts(): Observable<Mate[]> {
    return this.http.get<Mate[]>(this.apiUrlBookPost);
  }


  getBookPostById(bookPostId: number): Observable<Mate> {
    return this.http.get<Mate>(
      this.apiUrlBookPost + '/' + bookPostId
    );
  }

  addBookPost(bookPost: Mate): Observable<Mate> {
    const currentUserId = this.authService.getUserId();
    if (currentUserId == null) {
      alert("Usuario no autenticado");
      return throwError(() => new Error("Usuario no autenticado"));
    }
    
    bookPost.userId = currentUserId;
    
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<Mate>(
      this.apiUrlBookPost, bookPost, httpOptions
    );
  }
  
  updateBookPost(bookPost: Mate): Observable<Mate> {
    const currentUserId = this.authService.getUserId();
    if (currentUserId == null) {
      alert("Usuario no autenticado");
      return throwError(() => new Error("Usuario no autenticado"));
    }

    if (bookPost.userId !== currentUserId) {
      alert("You can only update your own posts.");
      return throwError(() => new Error("Unauthorized update attempt"));
    }

    bookPost.userId = currentUserId;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.put<Mate>(
      this.apiUrlBookPost + '/' + bookPost.id, bookPost, httpOptions
    );
    
  }

  deleteBookPostById(bookPost: Mate) {
    const currentUserId = this.authService.getUserId();
    if (currentUserId === null) {
      alert("Usuario no atenticado");
      return throwError(() => new Error("Usuario no autenticado"));
    }

    if (bookPost.userId !== currentUserId) {
      alert("You can only delete your own posts.");
      return throwError(() => new Error("Unauthorized delete attempt"));
    }
    
    bookPost.userId = currentUserId;
    return this.http.delete(this.apiUrlBookPost + '/' + bookPost.id);
  }
}
