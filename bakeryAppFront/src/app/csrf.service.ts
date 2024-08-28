import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {
  private csrfToken: string | null = null;
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // Obtiene el token CSRF del servidor
  getCsrfToken(): Observable<string> {
    console.log('Fetching CSRF token...', this.apiUrl);
    return this.http.get<{ csrfToken: string }>(`${this.apiUrl}/csrf-token`, { withCredentials: true }).pipe(
      tap(response => {
        this.csrfToken = response.csrfToken;
        console.log('CSRF Token received:', this.csrfToken, '=>', response, this.apiUrl);
      }),
      map(response => response.csrfToken),
      catchError(error => {
        console.error('Error fetching CSRF token:', error);
        return of(''); // Retorna un observable con un token vacío en caso de error
      })
    );
  }

  // Obtiene los encabezados HTTP necesarios para las solicitudes
  getHeaders(): Observable<HttpHeaders> {
    return this.getCsrfToken().pipe(
      map(token => new HttpHeaders({
        'X-CSRF-Token': token
      }))
    );
  }

  // Método para obtener el token CSRF almacenado
  getToken(): string | null {
    console.log('CSRF Token in service:', this.csrfToken);
    return this.csrfToken;
  }
}
