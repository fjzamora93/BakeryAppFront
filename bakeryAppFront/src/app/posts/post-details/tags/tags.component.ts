import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {MatChipListbox, MatChipsModule} from '@angular/material/chips';
import { PostsService } from '../../posts.service';
import { Post } from '../../post.model';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [MatChipsModule, CdkDropList, CdkDrag, MatChipListbox, MatCard, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent {

    @Input() tagList: string[] | undefined = [];

    @Output() onPostSelected = new EventEmitter<Post>();
    currentTag: string = '';
    similarPosts: Post[] = [];

    constructor(private postsService: PostsService) {}

    ngOnInit() {
        let randIndex= Math.floor(Math.random() * this.tagList!.length);

        this.currentTag = this.tagList![randIndex];
        this.onTagSelected(this.currentTag);
        console.log("Etiqueta inicializada", this.currentTag);
    }

    ngOnChanges() {
        let randIndex= Math.floor(Math.random() * this.tagList!.length);
        this.onTagSelected(this.tagList![randIndex]);
    }

    onTagSelected(tag: string) {
        
        this.similarPosts = this.postsService.getPostsByCategory(tag);
        this.similarPosts = getRandomItems(this.similarPosts, 3);
        console.log(this.similarPosts);   
    }

    selectingPost(post: Post) {
        this.postsService.postSelected = post;
        this.onPostSelected.emit(post);
        this.currentTag = post.category![0];
    }
    
}


// Function to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = array.slice(0); // Create a copy of the array
    let i = array.length, temp, index;

    // While there remain elements to shuffle
    while (i--) {
        // Pick a remaining element
        index = Math.floor(Math.random() * (i + 1));

        // Swap it with the current element
        temp = shuffled[i];
        shuffled[i] = shuffled[index];
        shuffled[index] = temp;
    }

    // Return the first `count` elements from the shuffled array
    return shuffled.slice(0, count);
}