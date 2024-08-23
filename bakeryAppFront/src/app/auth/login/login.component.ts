import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.http.post<{ success: boolean; message: string; user?: any }>('http://localhost:3000/api/login', { email, password }, { withCredentials: true })
      .subscribe(response => {
        if (response.success) {
          // Almacena la información del usuario en el localStorage o en algún servicio de autenticación
          localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/']); // Redirige al usuario a la página principal o a donde necesites
        } else {
          // Maneja el error de autenticación
          console.error(response.message);
        }
      });
  }
}
