import { Component } from '@angular/core';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';
import { TagsComponent } from './tags/tags.component';
import { SearchComponent } from '../shared/search/search.component';

@Component({
    selector: 'app-post-body',
    standalone: true,
    imports: [PostListComponent, PostCreateComponent, PostDetailsComponent, TagsComponent, SearchComponent],
    templateUrl: './post-body.component.html',
    styleUrls: ['./post-body.component.css'] 
})
export class PostBodyComponent {
    private postDetailStatusSub?: Subscription;
    postDetails?: Post | null;
    posts: Post[] = [];
    isEditing : boolean = false;

    constructor( public postsService: PostsService){}

    ngOnInit() {
        
        this.postsService.getPostUpdateListener()
            .subscribe((posts: Post[]) => {
                console.log('Posts fetched:', posts);
                const randomIndex = Math.floor(Math.random() * posts.length);
                this.posts = posts;
                this.postDetails = posts[randomIndex];
            }); 
        this.postDetailStatusSub = this.postsService
            .getSelectedPost()
            .subscribe(
                post => {
                    this.postDetails = post;
                }
            )
        
        this.postsService.setFilteredPosts() 
    }

    ngOnDestroy() {
        this.postDetailStatusSub?.unsubscribe();
        this.postsService.setFilteredPosts() // Método para resetear cualquier búsqueda que hubiese
    }

    fetchFilteredPosts(filteredPosts: Post[]) {
        this.posts = filteredPosts;
    }
}
