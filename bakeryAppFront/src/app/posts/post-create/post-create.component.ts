import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module'; // Ruta al módulo de Material
import { PostsService } from '../posts.service';
import { HttpClient } from '@angular/common/http';
import { Post } from '../post.model';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-post-create',
  standalone: true,
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  imports: [CommonModule, FormsModule, MaterialModule, MatDialogModule]
})
export class PostCreateComponent implements OnInit {
    
    @Output() editedPostChange = new EventEmitter<Post>();
    editing: boolean;
    posts: Post[] = []; // Define la propiedad posts
    myPost: Post = {
        _id: '',
        title: '',
        subtitle: '',
        description: '',
        content: '',
        items: [],
        steps: [],
        tags: [],
        url: '',
        imgUrl: '',
        attachedFile: '',
        category: '',
        date: '',
        price: 0,
        status: 'draft',
        views: 0,
        likes: 0,
        comments: [],
        author: ''
    };
    
    private apiUrl = `${environment.apiUrl}/posts`;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, 
        private postsService: PostsService,
        public dialogRef: MatDialogRef<PostCreateComponent>) {
            this.editing = data.editing; 

            if (this.editing){
                this.myPost = data.post;
            }
            
            console.log('Editing:', this.editing);
            console.log('Post:', this.myPost);
      }

    ngOnInit() {}
  
    // Método para agregar un nuevo post
    onAddPost(form: NgForm) {
        if (form.invalid) return;
        const { title, description } = form.value;
        this.myPost.title = title;
        this.myPost.description = description;
        this.myPost._id = (Math.floor(Math.random() * 10000) + 1).toString();
        this.uploadPost(this.myPost, form);
        this.dialogRef.close();
    }

    //Método para eliminar un post
    onDeletePost(postId: string) {
        this.postsService.deletePost(postId).pipe(
            tap(response => {
                console.log('Post deleted successfully:', response);
                this.postsService.getPosts();
            }),
            catchError(error => {
                console.error('Error deleting post:', error);
                return of(null);
            })
        ).subscribe();
        this.dialogRef.close();
    }

    // Método para actualizar un post
    onUpdatePost(form: NgForm) {
        if (form.invalid) return;

        this.myPost._id = form.value._id;
        this.myPost.title = form.value.title;
        this.myPost.description = form.value.description;

        this.postsService.updatePost(this.myPost).pipe(
            tap(response => {
                console.log('Post updated successfully:', response);
                this.postsService.getPosts();
            }),
            catchError(error => {
                
                console.error('Error updating post', error);
                return of(null);
            })
        ).subscribe();
        this.dialogRef.close();
    }



    // Usa el token CSRF al agregar el post
    uploadPost(post: Post, form: NgForm) {
        this.postsService.addPost(this.myPost).subscribe(
            response => {
                console.log('Post added successfully:', response);
                this.postsService.getPosts(); // Actualiza la lista de posts después de agregar uno nuevo
                form.resetForm(); 
            },
            error => {
                console.error('Error adding post:', error);
            }
    )};



    // Método para cancelar la edición de un post
    onCancelEdit() {
        this.dialogRef.close();
    }
  }