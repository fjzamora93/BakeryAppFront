import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserData } from '../user-data.model';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
  standalone: true,
  imports: [CommonModule, FormsModule, MatCard, MatFormField, MatSpinner, MatError, MatInputModule, MatButtonModule],  // Importa módulos necesarios
})
export class SignupComponent {

  isLoading = false;
  newUser?: UserData = {} as UserData;
  signupErrorMessage = '';
  password = '';
  repeatPassword = '';  
    


  constructor(
    public authService: AuthService,
    private router: Router
  ) {}


  onSignup(form: NgForm) {
  
    console.log(this.password, this.repeatPassword);

    if (this.password !== this.repeatPassword) {
        console.log("Las contraseñas no coinciden");
        form.controls['password'].setErrors({'incorrect': true});
        form.controls['repeat-password'].setErrors({'incorrect': true});
        return;
    }

    console.log("PREGISTRO", form.value.email, this.password);
    if (form.invalid) {
        console.log("Rechazando formulario");
        return;
    }
    this.isLoading = true;
    this.authService.createUser(this.newUser!, this.password)
        .pipe(
            tap(response => {
                console.log('Signup response:', response);
            }),
            catchError(error => {
                console.log('Error en el registro:', error);
                this.isLoading = false;  

                // Mostrar el mensaje de error al usuario
                if (error.message === 'User already exists') {
                    this.signupErrorMessage = 'El correo electrónico ya está registrado.';
                } else {
                    this.signupErrorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
                }

                return of(null);
            })
        ).subscribe(() => {
            setTimeout(() => {
                this.isLoading = false;
                this.router.navigate(['login']);
            }, 1000);
        });
    }

}
