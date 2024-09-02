import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material/material.module'; // Ruta al módulo de Material

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PostCreateComponent } from '../post-create/post-create.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { SearchComponent } from '../../shared/search/search.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';



@Component({
    selector: 'app-post-list',
    standalone: true,
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
    imports: [CommonModule, MaterialModule, PostCreateComponent, PaginatorComponent, SearchComponent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        AsyncPipe,
    ]
})
export class PostListComponent implements OnInit {
   
    @Input() posts: Post[] = [];
    
    slicedPosts : Post[] = [];
    myControl = new FormControl('');

    filteredPosts$?: Observable<Post[]>;
    editing: boolean = false;


    myPost!: Post;
    postsFiltered: Post[] = [];

    constructor(public postsService: PostsService) {
        
    }

    ngOnInit() {
        this.postsService.getPosts();
    }   

    ngOnChanges(SimpleChanges: any) {
        this.slicedPosts = this.posts.slice(0, 10);
    }

    onSelectingPost(post: Post) {
        console.log('Post selected:', post);
        this.postsService.setSelectedPost(post);
        this.postsService.setIsAuthored(post.author);
    }

    
    fetchFilteredPosts(filteredPosts: Post[]) {
        this.posts = filteredPosts;
    }

}
