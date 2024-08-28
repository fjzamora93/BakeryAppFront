import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCard, MatFormField, MatSpinner, MatError, MatInputModule],  // Importa módulos necesarios
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
        console.log("Rechazando formulario");
      return;
    }
    console.log("Enviando formulario", form.value);
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password).subscribe(
        response => {
          console.log('Login response:', response);
          // Aquí puedes manejar la respuesta del login
        },
        error => {
          console.error('Login error:', error);
          // Aquí puedes manejar el error del login
        }
    )
  }
  
}
