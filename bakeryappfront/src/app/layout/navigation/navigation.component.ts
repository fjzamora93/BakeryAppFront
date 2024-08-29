import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenu, MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { PostCreateComponent } from '../../posts/post-create/post-create.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, PostCreateComponent, RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

    constructor(
        private router: Router,
        private authService: AuthService,
        public dialog: MatDialog
      ) {}


    redirectToBackend() {
       
      }
    
    navigateToFrontendPage() {
        
      }

    addPostOverlay() {
        if (!this.authService.getIsAuth()) {
            this.router.navigate(['/login']);
            console.log('User is not authenticated');
        }else{
            this.dialog.open(PostCreateComponent, {
                width: '600px', 
                backdropClass: 'custom-backdrop', 
                data: {
                    editing: false,
                }
            });
        }
        
    }

}
