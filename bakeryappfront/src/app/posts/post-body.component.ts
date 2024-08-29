import { Component } from '@angular/core';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
    selector: 'app-post-body',
    standalone: true,
    imports: [PostListComponent, PostCreateComponent, PostDetailsComponent],
    templateUrl: './post-body.component.html',
    styleUrls: ['./post-body.component.css'] 
})
export class PostBodyComponent {
    
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
