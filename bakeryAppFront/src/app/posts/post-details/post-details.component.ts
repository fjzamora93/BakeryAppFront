import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatCardModule, MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PostCreateComponent } from '../post-create/post-create.component';
import { MatDivider } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TagsComponent } from './tags/tags.component';


@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [MatCardModule, MatCard, MatIcon, PostCreateComponent, MatDivider, MatSnackBarModule, TagsComponent],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit  {
    @Input() postDetails?: Post ;
    @Input() isEditing: boolean = false;
    @Output() isEditingChange = new EventEmitter<boolean>();

    content: string[]  = ['Formateo el contenido del post'];
  
    constructor(public dialog: MatDialog, private snackBar: MatSnackBar){}
  
    ngOnInit(): void {
        console.log('Inicailizando');
    }

    ngOnChanges(): void {
        if (this.postDetails && this.postDetails.content) {
            this.content = this.postDetails.content.split('\n');
        } else {
            this.content = []; // O maneja el caso donde `postDetails` o `content` no están definidos
        }
    }

    openOverlay() {
        this.dialog.open(PostCreateComponent, {
            width: '80vw', // Ajusta el tamaño del overlay según sea necesario
            height: '90vh', // Ajusta el tamaño del overlay según sea necesario
            backdropClass: 'custom-backdrop', // Para estilos personalizados del fondo
            panelClass: 'custom-panel-class',
            data: {
                editing: true, // Aquí defines que editing es true
                post: this.postDetails 
          },
        });
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
        this.postDetails = post;
     }

}