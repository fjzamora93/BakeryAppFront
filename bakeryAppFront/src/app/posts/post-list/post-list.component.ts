import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; // Ruta al módulo de Material

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PostCreateComponent } from '../post-create/post-create.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-post-list',
    standalone: true,
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
    imports: [CommonModule, MaterialModule, PostCreateComponent, MatPaginatorModule, MatTable]
})
export class PostListComponent implements OnInit, OnDestroy {
    @Output() postSelected = new EventEmitter<Post>();
    posts: Post[] = [];
    startIndex:number = 0;
    endIndex:number = 10;

    slicedPosts : Post[] = [];

    

    private postsSub?: Subscription;
    editing: boolean = false;
    myPost!: Post;
    
    displayedColumns: string[] = ['title', 'description', 'imgUrl'];
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(public postsService: PostsService) {}

    ngOnInit() {
        this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdateListener()
            .subscribe((posts: Post[]) => {
                this.posts = posts;
                this.slicedPosts = this.posts.slice(this.startIndex, this.endIndex);
        });
    }   

    onPaginateChangeFollowing() {
        if (this.endIndex >= this.posts.length) {
            return;
        }
        this.startIndex +=1;
        this.endIndex +=1;
        this.slicedPosts = this.posts.slice(this.startIndex, this.endIndex);
    }

    onPaginateChangePrevious() {
        if (this.startIndex <= 0) {
            return;
        }
  
        this.startIndex -=1;
        this.endIndex -=1;
        this.slicedPosts = this.posts.slice(this.startIndex, this.endIndex);
    }

    ngOnDestroy() {
        this.postsSub?.unsubscribe();
    }

    onDelete(postId: string): void {
        this.postsService.deletePost(postId).pipe(
            tap(response => {
                console.log( response);
                this.postsService.getPosts();
            }),
            catchError(error => {
                console.error('Error deleting post', error);
                // Retorna un observable vacío para manejar el error
                return of(null);
            })
        ).subscribe();
    }

    onUpdate(post: Post) {
        this.editing = true;
        this.myPost._id = post._id;
        this.myPost.title = post.title;
        this.myPost.description = post.description;
    }

    onSelectingPost(post: Post) {
        this.postSelected.emit(post);
    }
   

}
