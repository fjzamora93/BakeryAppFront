import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  public isLoggedIn = false;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ success: boolean, user: any }>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap(response => {
        this.isLoggedIn = response.success;
        if (response.success) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }),
      map(response => response.success),
      catchError(error => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.isLoggedIn = false;
        localStorage.removeItem('user');
      }),
      catchError(error => {
        console.error('Logout error:', error);
        return of(undefined);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
