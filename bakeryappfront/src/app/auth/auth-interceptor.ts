//! Lo he cambiado a una función, en el original está como una clase

import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";  // Asegúrate de que la ruta es correcta

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);  // Usa inject para obtener una instancia del servicio
  const authToken = authService.getToken();  // Obtén el token de autenticación

  const authRequest = req.clone({
    headers: req.headers.set("Authorization", "Bearer " + authToken)
  });

  return next(authRequest);
};
