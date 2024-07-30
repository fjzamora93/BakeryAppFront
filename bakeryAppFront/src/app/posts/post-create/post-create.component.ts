import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module'; // Ruta al módulo de Material
import { PostsService } from '../posts.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post-create',
  standalone: true,
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  imports: [CommonModule, FormsModule, MaterialModule]
})
export class PostCreateComponent implements OnInit {

    constructor(private postsService: PostsService) {}

    ngOnInit() {}
  
    onAddPost(form: NgForm) {
      if (form.invalid) {
        return;
      }
      const { title, content } = form.value;
      // Usa el token CSRF al agregar el post
      this.postsService.addPost(title, content);
      form.resetForm();
    }
  }