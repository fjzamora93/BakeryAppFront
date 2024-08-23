import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; // Ruta al módulo de Material

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PostCreateComponent } from '../post-create/post-create.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';




@Component({
    selector: 'app-post-list',
    standalone: true,
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
    imports: [CommonModule, MaterialModule, PostCreateComponent, PaginatorComponent]
})
export class PostListComponent implements OnInit, OnDestroy {
    @Output() postSelected = new EventEmitter<Post>();
    posts: Post[] = [];
    slicedPosts : Post[] = [];

    private postsSub?: Subscription;
    editing: boolean = false;
    myPost!: Post;


    constructor(public postsService: PostsService) {}

    ngOnInit() {
        this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdateListener()
            .subscribe((posts: Post[]) => {
                this.posts = posts;
                this.slicedPosts = this.posts;
        });
    }   

    ngOnDestroy() {
        this.postsSub?.unsubscribe();
    }


    onSelectingPost(post: Post) {
        this.postSelected.emit(post);
    }
   

}
