import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, Subscription, catchError, of, switchMap, tap, throwError } from "rxjs";

import { AuthData } from "./auth-data.model";
import { CsrfService } from "../csrf.service";
import { environment } from "../../environments/environment";
import { UserData } from "./user-data.model";
import { UserService } from "./user.service";

interface LoginResponse {
    success: boolean;
    message: string;
    user: UserData;
};
  

@Injectable({ providedIn: "root" })
export class AuthService {
    private apiUrl = environment.apiUrl + '/user';

    private token?: string;
    private tokenTimer: any;
    private authStatusListener = new BehaviorSubject<boolean>(false);
    private userStatusListener = new BehaviorSubject<UserData>({} as UserData);

    constructor(
      private http: HttpClient, 
      private router: Router,
      private csrfService: CsrfService,
    ) {}
  
    getToken() {
      return this.token;
    }
  
    getIsAuth(): Observable<boolean> {
      return this.authStatusListener.asObservable();
    }
  
    setIsAuth(isAuth: boolean) {
      this.authStatusListener.next(isAuth);
    }

    getUserStatus() {
        return this.userStatusListener.asObservable();
    }
    setUserStatus(user: UserData) {
        this.userStatusListener.next(user);
    }
  
    login(email: string, password: string): Observable<any> {
      const authData: AuthData = { email: email, password: password };
      console.log("Attempting login with:", authData);
      return this.csrfService.getHeaders().pipe(
        switchMap(headers => {
          return this.http.post<LoginResponse>(
            `${this.apiUrl}/login`,
            authData,
            { headers, withCredentials: true }
          ).pipe(
            tap(response => {
              console.log('Login Response:', response);
              this.setUserStatus(response.user);
              this.setIsAuth(response.success);
            }),
            catchError(error => {
              console.error('Error during login:', error);
              this.setIsAuth(false); // Asegúrate de manejar el estado de autenticación en error
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
    
    logout() {
        this.token = undefined;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.setIsAuth(false);
        this.router.navigate(["/"]);
    }
    
    
    createUser(user: UserData,  password: string) {
        const userSignUp: any = { user: user, password: password };
        console.log("Registrando usuario", userSignUp.user, userSignUp.password);
        return this.csrfService.getHeaders().pipe(
            switchMap(headers => {
                return this.http.post(
                    `${this.apiUrl}/signup`, 
                    userSignUp, 
                    { headers, withCredentials: true }
                ).pipe(
                catchError(error => {
                    console.error('Error adding user:', error);
                    if (error.status === 409) {
                        return throwError(() => new Error('User already exists'));
                      }
                      return throwError(() => new Error('An unknown error occurred'));
                })
                );
            })
        );
        
    }

    addToBookmark(postId: string) {
        let user = this.userStatusListener.value;
        if (user.bookmark.includes(postId)) {
            let bookmarkCopy = user.bookmark.filter(id => id !== postId);
            user.bookmark = bookmarkCopy;
        } else {
            user.bookmark.push(postId);
            this.setUserStatus(user);
        }

        const body = { postId, userId: this.userStatusListener.value._id };
        console.log("Adding bookmark", this.apiUrl);
        return this.csrfService.getHeaders().pipe(
            switchMap(headers => {
                return this.http.post(
                    `${this.apiUrl}/bookmark`, 
                    body , 
                    { headers, withCredentials: true }
                ).pipe(
                tap(response => {
                    console.log('Bookmark Response:', body,  response);
                }),
                catchError(error => {
                    console.error('Error adding bookmark:', error);
                    return throwError(() => new Error('An unknown error occurred'));
                })
                );
            })
        );
    }

    //TODO: MÉTODOS SIN IMPLMENTAR AÚN
    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.setIsAuth(true);
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
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
