import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-signup',
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
  standalone: true,
  imports: [CommonModule, FormsModule, MatCard, MatFormField, MatSpinner, MatError, MatInputModule],  // Importa módulos necesarios
})
export class SignupComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  onSignup(form: NgForm) {
    console.log("PREGISTRO", form.value.email, form.value.password);
    if (form.invalid) {
        console.log("Rechazando formulario");
        return;
    }
    this.isLoading = true;

  }
}
