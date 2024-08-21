import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatCardModule, MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PostCreateComponent } from '../post-create/post-create.component';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [MatCardModule, MatCard, MatIcon, PostCreateComponent, MatDivider],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit  {
    @Input() postDetails?: Post ;

  
    constructor(public dialog: MatDialog){}
  
    ngOnInit(): void {
        console.log('Inicailizando');
    }

    openOverlay() {
        this.dialog.open(PostCreateComponent, {
          width: '600px', // Ajusta el tamaño del overlay según sea necesario
          backdropClass: 'custom-backdrop', // Para estilos personalizados del fondo
        });
    }

}