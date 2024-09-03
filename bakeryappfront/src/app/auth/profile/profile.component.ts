import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatCardModule, MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { MatDivider } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../auth/auth.service';
import { UserData } from '../../auth/user-data.model';
import { TagsComponent } from '../../posts/tags/tags.component';
import { PostCreateComponent } from '../../posts/post-create/post-create.component';
import { Post } from '../../posts/post.model';
import { PostsService } from '../../posts/posts.service';
import { PostDetailsComponent } from "../../posts/post-details/post-details.component";
import { PostListComponent } from '../../posts/post-list/post-list.component';
import { MatButtonModule } from '@angular/material/button';
import { SearchComponent } from "../../shared/search/search.component";


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatCard, MatIcon, MatButtonModule, SearchComponent,
    PostCreateComponent, MatDivider, MatSnackBarModule, TagsComponent, PostDetailsComponent, PostListComponent, SearchComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit  {
    postDetails?: Post | null;

    private postDetailStatusSub?: Subscription;
    private authStatusSub?: Subscription;
    private userStatusSub?: Subscription;
    private isAuthoredSub?: Subscription;
    private postsSub?: Subscription;

    public isLogedIn: boolean = false;
    public isAuthor: boolean = false;
    public user!: UserData; 

    public searchFilter: string = 'authored';

  
    
    public posts: Post[] = [];
    public bookmarks: Post[] = [];
    public authoredPosts: Post[] = [];

    constructor(
        private cd: ChangeDetectorRef,
        private postsService: PostsService,
        private snackBar: MatSnackBar,
        private authService: AuthService
    ){}
  
    ngOnInit(): void {
        this.authStatusSub = this.authService
            .getIsAuth()
            .subscribe(
                isAuth => {
                    this.isLogedIn = isAuth;
            });
        this.userStatusSub = this.authService
            .getUserStatus()
            .subscribe(
                user => {
                    this.user = user;
            });

        this.postDetailStatusSub = this.postsService
            .getSelectedPost()
            .subscribe(
                post => {
                    this.postDetails = post;
                }
            )
        this.isAuthoredSub = this.postsService
            .getIsAuthored()
            .subscribe(
                isAuthor => {
                    if (this.isLogedIn) this.isAuthor = isAuthor;
                }
            )
        this.postsService.getPosts();
        this.postsSub = this.postsService
            .getFilteredPostUpdateListener()
            .subscribe((posts: Post[]) => {
                this.posts = posts;
        });
    }

    ngAfterViewInit(){
        setTimeout(() => {
        this.onSelectingAuthored();
        }, 2000);
    }

    onSelectingBookmarks(){
        this.searchFilter = 'bookmarked';
        this.postsService.setFilteredPosts(this.searchFilter);
    }

    onSelectingAuthored(){
        this.searchFilter = 'authored';
        this.postsService.setFilteredPosts(this.searchFilter);
    }
            

    showMessage() {
        this.snackBar.open('¡Añadido a favoritos!', 'Ok', {
          duration: 3000, 
          verticalPosition: 'top', // 'top' o 'bottom'
          horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right',
          panelClass: ['custom-snackbar'], // Clases personalizadas
        });
        
      }

     changingPost(post: Post){
        this.postsService.setSelectedPost(post);
        this.postsService.setIsAuthored(this.postDetails!.author);
     }

     ngOnDestroy() {
        console.log('ProfileComponent destroyed');
        this.postDetailStatusSub?.unsubscribe();
        this.postsService.setFilteredPosts() // Método para resetear cualquier búsqueda que hubiese
    }

}