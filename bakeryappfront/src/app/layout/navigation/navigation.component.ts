import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenu, MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { PostCreateComponent } from '../../posts/post-create/post-create.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, PostCreateComponent, RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

    private authStatusSub?: Subscription;
    public  isAuth: boolean = false;

    constructor(
        private router: Router,
        private authService: AuthService,
        public dialog: MatDialog
      ) {}


    ngOnInit() {
        this.authStatusSub = this.authService
            .getIsAuth()
            .subscribe(
                isAuth => {
                    this.isAuth = isAuth;
            });
    }

    addPostOverlay() {
       
            console.log("subiendo post:  ", this.isAuth);
            this.dialog.open(PostCreateComponent, {
                width: '600px', 
                backdropClass: 'custom-backdrop', 
                data: {
                    editing: false,
                }
            });
        }
        
    

    onLogOut() {
        this.authService.logout();
    }

}
