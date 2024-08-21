import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module'; // Ruta al módulo de Material
import { PostsService } from '../posts.service';
import { HttpClient } from '@angular/common/http';
import { Post } from '../post.model';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-post-create',
  standalone: true,
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  imports: [CommonModule, FormsModule, MaterialModule, MatDialogModule]
})
export class PostCreateComponent implements OnInit {
    @Input() editedPost: Post = {
        _id: '',
        title: '',
        content: '',
        items: [],
        steps: [],
        tags: [],
        comments: [],
        status: 'draft',
        views: 0,
        likes: 0,
        author: ''
    };

    @Output() editedPostChange = new EventEmitter<Post>();

    @Input() editing?: boolean;
    @Output() editingChange = new EventEmitter<boolean>();

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
    constructor(private http: HttpClient, private postsService: PostsService) {}

    ngOnInit() {}
  
    // Método para agregar un nuevo post
    onAddPost(form: NgForm) {
        if (form.invalid) return;
        
        const { title, description } = form.value;
        this.myPost.title = title;
        this.myPost.description = description;
        this.myPost._id = (Math.floor(Math.random() * 10000) + 1).toString();
        this.uploadPost(this.myPost, form);
        
    }

    // Método para actualizar un post
    onUpdatePost(form: NgForm) {
        if (form.invalid) return;

        this.myPost._id = form.value._id;
        this.myPost.title = form.value.title;
        this.myPost.description = form.value.description;

        this.editing = false;
        this.editingChange.emit(this.editing);
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
        this.editing = false;
        this.editingChange.emit(this.editing);
    }
  }