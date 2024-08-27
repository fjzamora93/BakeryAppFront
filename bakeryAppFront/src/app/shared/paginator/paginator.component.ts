import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Post } from '../../posts/post.model';
import { PostsService } from '../../posts/posts.service';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnChanges {

    @Input() posts?: Post[];
    @Input() slicedPosts!: Post[];
    @Output() slicedPostsChange = new EventEmitter<Post[]>();

    currentPage:number = 1;
    totalPages:number = 10;
    startIndex:number = 0;
    step: number = 10;

    endIndex:number = this.startIndex + this.step;

    constructor(public postsService: PostsService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['posts'] && this.posts) {
            this.totalPages = Math.ceil(this.posts.length / this.step);
            setTimeout(() => {
                this.slicedPosts = this.posts!.slice(this.startIndex, this.endIndex);
                this.slicedPostsChange.emit(this.slicedPosts);
            });
        }
        
    }

   
        
    
    onPaginateChangeFollowing() {
        this.totalPages = Math.ceil(this.posts!.length / this.step);
        if (this.endIndex >= this.posts!.length) {
            return;
        }
        this.currentPage += 1;
        this.startIndex +=this.step;
        this.endIndex +=this.step;
        this.slicedPostsChange.emit(this.posts!.slice(this.startIndex, this.endIndex));

    }

    onPaginateChangePrevious() {
        if (this.startIndex <= 0) {
            return;
        }
        this.currentPage -= 1;
        this.startIndex -=this.step;
        this.endIndex -=this.step;
        this.slicedPostsChange.emit(this.posts!.slice(this.startIndex, this.endIndex));
    }


}
