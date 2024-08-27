import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject, catchError, of, switchMap, tap } from "rxjs";
import { authGuard } from "../auth.guard";
import { AuthData } from "./auth-data.model";
import { CsrfService } from "../csrf.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token?: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(
        private http: HttpClient, 
        private router: Router,
        private csrfService: CsrfService) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    console.log("Registrando usuario", authData.email, authData.password);
    return this.csrfService.getHeaders().pipe(
        switchMap(headers => {
            return this.http.post(
                "http://localhost:3000/api/user/signup", 
                authData, 
                { headers, withCredentials: true }
            ).pipe(
            catchError(error => {
                console.error('Error adding user:', error);
                return of(error);
            })
            );
        })
    );
    
    
    // this.http
    //   .post("http://localhost:3000/api/user/signup", authData)
    //   .subscribe(response => {
    //     console.log(response);
    //   });
  }

  login(email: string, password: string): Observable<any> {
    const authData: AuthData = { email: email, password: password };
    console.log("Attempting login with:", authData);
  
    return this.csrfService.getHeaders().pipe(
      tap(headers => console.log('CSRF Headers:', headers)),
      switchMap(headers => {
        return this.http.post(
          "http://localhost:3000/api/user/login",
          authData,
          { headers, withCredentials: true }
        ).pipe(
          tap(response => console.log('Login Response:', response)),
          catchError(error => {
            console.error('Error during login:', error);
            return of(error);
          })
        );
      }),
      catchError(error => {
        console.error('Error in getHeaders:', error);
        return of(error);
      })
    );
  }
  

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = undefined;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
