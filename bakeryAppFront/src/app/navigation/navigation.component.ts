import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { PostCreateComponent } from '../posts/post-create/post-create.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, PostCreateComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

    constructor(
        private router: Router,
        public dialog: MatDialog
      ) {}


    redirectToBackend() {
       
      }
    
    navigateToFrontendPage() {
        
      }

      addPostOverlay() {
        this.dialog.open(PostCreateComponent, {
            width: '600px', 
            backdropClass: 'custom-backdrop', 
            data: {
                editing: false,
            }
        });
    }

}
