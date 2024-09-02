import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getIsAuth().pipe(
      take(1), // Tomamos solo el primer valor de la autenticación
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true; // Si el usuario está autenticado, permite el acceso
        } else {
          this.router.navigate(['/login']); // Si no, redirige al login
          return false;
        }
      })
    );
  }
}
