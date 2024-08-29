import { BehaviorSubject, Observable, catchError, of, switchMap, tap } from "rxjs";
import { AuthData } from "./auth-data.model";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { CsrfService } from "../csrf.service";

export class AuthService {
    private apiUrl = environment.apiUrl + '/user';
    private authStatusListener = new BehaviorSubject<boolean>(false);
    private tokenTimer: any;

    constructor(
        private http: HttpClient, 
        private router: Router,
        private csrfService: CsrfService
    ) {}

    getIsAuth(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    login(email: string, password: string): Observable<any> {
        const authData: AuthData = { email, password };
        console.log("Attempting login with:", authData);

        return this.csrfService.getHeaders().pipe(
            tap(headers => console.log('CSRF Headers:', headers)),
            switchMap(headers => {
                return this.http.post(
                    `${this.apiUrl}/login`,
                    authData,
                    { headers, withCredentials: true }
                ).pipe(
                    tap(response => {
                        console.log('Login Response:', response);
                        this.setIsAuth(true);
                    }),
                    catchError(error => {
                        console.error('Error during login:', error);
                        this.setIsAuth(false);
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

    setIsAuth(isAuth: boolean) {
        this.authStatusListener.next(isAuth);
    }

    logout() {
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.setIsAuth(false);
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        console.log("Setting timer: " + duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        if (!token || !expirationDate) {
            return null;
        }
        return {
            token,
            expirationDate: new Date(expirationDate)
        };
    }
}
