import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service.service'; // Asegúrate de ajustar la ruta según tu estructura
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Aquí deberías verificar si el usuario está autenticado
    // Por ejemplo, puedes verificar un servicio de autenticación
    const isAuthenticated = this.checkAuthentication();
    
    if (!isAuthenticated) {
      // Redirige al usuario si no está autenticado
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }

  private checkAuthentication(): boolean {
    // Lógica para verificar si el usuario está autenticado
    // Por ejemplo, verificar si el token de autenticación existe
    return !!localStorage.getItem('authToken'); // Ejemplo
  }
}
