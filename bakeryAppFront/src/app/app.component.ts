import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { HeaderComponent } from "./header/header.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { MaterialModule } from './material/material.module'; // Ruta al módulo de Material
import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { Post } from './posts/post.model';
import { NavigationComponent } from "./navigation/navigation.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, CommonModule, PostCreateComponent, HeaderComponent,
    PostListComponent, MaterialModule, PostDetailsComponent,
    NavigationComponent, FooterComponent]
})
export class AppComponent {
    title = 'bakeryAppFront';
    postSelected?: Post;
    addingPost : boolean = false;


    onSelectingPost(post: Post) {
        console.log('Post selected:', post); // Verifica que esto muestre el post en la consola
        this.postSelected = post;
    }

  
}
