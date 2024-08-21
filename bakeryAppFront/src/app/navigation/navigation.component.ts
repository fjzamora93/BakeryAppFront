import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
    @Input() addPost: boolean = false;
    @Output() addPostChange = new EventEmitter<boolean>();

    constructor(
        private router: Router
      ) {}

    onAddPost() {
        const adding = false === this.addPost;
        this.addPostChange.emit(adding);
        console.log('Adding post:', adding);
    }

    redirectToBackend() {
        // Redirige a una URL externa (backend)
        window.location.href = 'http://localhost:3000';
      }
    
    navigateToFrontendPage() {
        // Navega a una ruta interna en el frontend (Angular)
        this.router.navigate(['http://localhost:4200']);
      }

}
