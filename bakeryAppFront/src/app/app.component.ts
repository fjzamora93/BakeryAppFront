import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Routes } from '@angular/router';
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { HeaderComponent } from "./header/header.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { MaterialModule } from './material/material.module'; // Ruta al módulo de Material
import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { Post } from './posts/post.model';
import { NavigationComponent } from "./navigation/navigation.component";
import { FooterComponent } from "./footer/footer.component";
import { PostsService } from './posts/posts.service';
import { Subscription } from 'rxjs';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
  ];

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
    isEditing : boolean = false;

    constructor( public postsService: PostsService){}

    ngOnInit() {
        this.postsService.getPostUpdateListener()
            .subscribe((posts: Post[]) => {
                console.log('Posts fetched:', posts);
                const randomIndex = Math.floor(Math.random() * posts.length);
                this.postSelected = posts[randomIndex];
            });    
    }

    onSelectingPost(post: Post) {
        console.log('Post selected:', post); // Verifica que esto muestre el post en la consola
        this.postSelected = post;
    }
  
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }