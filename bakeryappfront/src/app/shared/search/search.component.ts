import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Post } from '../../posts/post.model';
import { PostsService } from '../../posts/posts.service';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatAutocompleteModule,
      ReactiveFormsModule,
      AsyncPipe,
    ],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']  // Asegúrate de usar `styleUrls` en plural para un array.
  })
  export class SearchComponent  {
    @Input() resetSearchBar: boolean = false; //En caso de que sea true, buscará en todos los posts
    @Output() filteredPosts = new EventEmitter<Post[]>();
    myControl = new FormControl('');
    posts: Post[] = [];
    postsSub: Subscription = new Subscription();
  
    constructor(public postsService: PostsService) {}

    ngOnInit() {
        this.postsSub = this.postsService
            .getPostUpdateListener()
            .subscribe((posts: Post[]) => {
            this.posts = posts;
        });
     
    }

    onInputChange(value: any) {
        // let filtrado: Post[] = [];
        // if (this.searchAll = true){
        //     filtrado = this.postsService.getPostFilteredByString(value.target.value);

        // } else {
        this.postsService.setFilteredPosts(
            'searchbar', 
            value.target.value, 
            this.resetSearchBar
        );

        
        // this.filteredPosts.emit(filtrado);

    }
  
   
  }