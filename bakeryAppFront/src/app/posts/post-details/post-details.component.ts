import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit  {
    @Input() postDetails?: Post ;

  
    constructor(
      private postsService: PostsService,
      private router: Router
    ) {}
  
    ngOnInit(): void {
        console.log('Inicailizando');
    }
  
  
    
  }