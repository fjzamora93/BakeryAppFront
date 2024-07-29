import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { HeaderComponent } from "./header/header.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { MaterialModule } from './material/material.module'; // Ruta al módulo de Material

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, CommonModule, PostCreateComponent, HeaderComponent, PostListComponent, MaterialModule]
})
export class AppComponent {
  title = 'bakeryAppFront';
}
