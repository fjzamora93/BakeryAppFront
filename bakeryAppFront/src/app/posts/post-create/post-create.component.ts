import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module'; // Ruta al módulo de Material
import { PostsService } from '../posts.service';
import { HttpClient } from '@angular/common/http';
import { Post } from '../post.model';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormlistComponent } from '../../shared/formlist/formlist.component';


@Component({
  selector: 'app-post-create',
  standalone: true,
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  imports: [CommonModule, FormsModule, MaterialModule, MatDialogModule, FormlistComponent]
})
export class PostCreateComponent {
    
    @Output() editedPostChange = new EventEmitter<Post>();
    editing: boolean;
    posts: Post[] = []; // Define la propiedad posts
    myPost: Post;
    file: File | string = "";

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, 
        private postsService: PostsService,
        public dialogRef: MatDialogRef<PostCreateComponent>) {
            this.editing = data.editing; 

            if (this.editing){
                this.myPost = data.post;
            } else {
                this.myPost = {
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
            }
            
            console.log('Editing:', this.editing);
            console.log('Post:', this.myPost);
      }}


  
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



    onUpdatePost(form: NgForm) {
        if (form.invalid) return;
    
        this.myPost._id = form.value._id;
        this.myPost.title = form.value.title;
        this.myPost.description = form.value.description;
        this.myPost.content = form.value.content;
    
        if (this.myPost.imgUrl instanceof File) {
            console.log("EL PUTO FILE ANTES DE QUE PASE POR IMGUR: ", this.myPost.imgUrl);
        }
    
        this.postsService.updatePostFormData(this.myPost).pipe(
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

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
    
        if (input.files && input.files[0]) {
          const file = input.files[0];
    
          // Verificar el tipo de archivo
          if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
            this.myPost.imgUrl! = file;
            console.log('Archivo seleccionado:',  this.myPost.imgUrl);
          } else {
            // Mostrar un mensaje de error o manejar la excepción de tipo de archivo
            console.error('Tipo de archivo no válido. Solo se permiten JPEG, JPG, y PNG.');
          }
        }
      }
    }