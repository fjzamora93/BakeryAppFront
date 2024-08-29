import { Component, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { Subscription, catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCard, MatFormField, MatSpinner, MatError, MatInputModule],  // Importa módulos necesarios
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;
  private isAuthenticated = false;
  private authListenerSubs?: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Suscribirse al estado de autenticación
    this.authListenerSubs = this.authService
        .getIsAuth()
        .subscribe(isAuth => {
            this.isAuthenticated = isAuth;
            // Aquí puedes hacer algo basado en el estado de autenticación
            if (this.isAuthenticated) {
                console.log('El usuario está autenticado');
                // Lógica para cuando el usuario está autenticado
            } else {
                console.log('El usuario no está autenticado');
                // Lógica para cuando el usuario no está autenticado
            }
        });
    }


  onLogin(form: NgForm) {
    if (form.invalid) {
        console.log("Rechazando formulario");
      return;
    }
    console.log("Enviando formulario", form.value);
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password).pipe(
        tap(response => {
            console.log('Login response:', response);
            // Maneja la respuesta del login, si es necesario
            this.router.navigate(['/']);
        }),
        catchError(error => {
            console.error('Login error:', error);
            this.isLoading = false;  // Detenemos el loading en caso de error
            return of(null);
        })
    ).subscribe(() => {
        setTimeout(() => {
            this.isLoading = false;  
        }, 1000);
        

    });
  }

}
