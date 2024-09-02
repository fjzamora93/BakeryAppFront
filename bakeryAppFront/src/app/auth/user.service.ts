//!Actualmente toda esta lógica está dentro del AUTH SERVICE, por lo que este servicio NO ESTÁ EN USO


import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, catchError, of, switchMap, tap } from "rxjs";
import { UserData } from "./user-data.model";
import { CsrfService } from "../csrf.service";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class UserService {
    private apiUrl = environment.apiUrl + '/user';
    private userStatusListener = new Subject<UserData>();

  
    constructor(
      private http: HttpClient, 
      private router: Router,
      private csrfService: CsrfService
    ) {}

    getUserStatus() {
      return this.userStatusListener.asObservable();
    }
    setUserStatus(user: UserData) {
      this.userStatusListener.next(user);
    }

    getUserLogedIn():void {
        this.http.get<{ message: string; user: UserData }>(
            `${this.apiUrl}`, 
            { withCredentials: true }
            ).pipe(
                tap(userData => {
                    this.setUserStatus(userData.user);
                }),
                catchError(error => {
                    console.error('Error fetching user:', error);
                    return of({ message: '', user: {} as UserData }); 
                })
            ).subscribe();
        }
}