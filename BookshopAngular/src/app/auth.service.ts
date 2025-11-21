import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'; // Importa el environment

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrlAuth = environment.apiUrl + '/auth/login';  // Usa el valor de environment
  
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrlAuth, { username, password });
  }

  // Simulo token de autenticacion guardando userId en localStorage
  saveUserId(userId: number): void {
    localStorage.setItem('userId', userId.toString());
  }

  // Obtener userId desde localStorage
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.getUserId() !== null;
  }

  // Eliminar el userId de localstorage al hacer logout
  logout(): void {
    localStorage.removeItem('userId');
  }
}
