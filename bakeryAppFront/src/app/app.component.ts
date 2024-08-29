import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Routes } from '@angular/router';
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { HeaderComponent } from "./layout/header/header.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { MaterialModule } from './shared/material/material.module'; // Ruta al módulo de Material
import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { NavigationComponent } from "./layout/navigation/navigation.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { PostBodyComponent } from "./posts/post-body.component";



@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, CommonModule, HeaderComponent,
   MaterialModule, 
    NavigationComponent, FooterComponent, PostBodyComponent]
})
export class AppComponent {
    title = 'bakeryAppFront';
   
  
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }