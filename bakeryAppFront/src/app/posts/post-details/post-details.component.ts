import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { MatCardModule, MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PostCreateComponent } from '../post-create/post-create.component';
import { MatDivider } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TagsComponent } from './tags/tags.component';
import { AuthService } from '../../auth/auth.service';
import { UserData } from '../../auth/user-data.model';

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

    private authStatusSub?: Subscription;
    public isLogedIn: boolean = false;

    private userStatusSub?: Subscription;

    //! CUIDADO, la lógica está planteada para que siempre haya un usuario VACÍO (aunque no esté registrado)
    public user?: UserData; 

    public isAuthor: boolean = false;

    content: string[]  = ['Formateo el contenido del post'];
  
    constructor(
        public dialog: MatDialog, 
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
                    if (this.user && this.postDetails) {
                        this.isAuthor = this.user._id === this.postDetails.author;
                    }
            });
    }



    ngOnChanges(changes: SimpleChanges): void {
        if (changes['postDetails'] && changes['postDetails'].currentValue) {
            if (changes['postDetails'].currentValue.content) {
                this.content = changes['postDetails'].currentValue.content.split('\n');
            } 
            this.isAuthor = this.user?._id === this.postDetails?.author;
        }
      }

    openOverlay() {
        this.dialog.open(PostCreateComponent, {
            width: '100vw', // Ajusta el tamaño del overlay según sea necesario
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