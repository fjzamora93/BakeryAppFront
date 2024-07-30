import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Post } from './post.model';
import { CsrfService } from '../csrf.service';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private csrfService: CsrfService) {}

  // Método para obtener posts
  getPosts(): void {
    this.http.get<{ message: string; posts: Post[] }>('http://localhost:3000/api/posts')
      .pipe(
        tap(postData => {
          this.posts = postData.posts;
          this.postsUpdated.next([...this.posts]);
          console.log('Posts fetched:', this.posts);
        }),
        catchError(error => {
          console.error('Error fetching posts:', error);
          return of({ message: '', posts: [] }); // Retorna un observable vacío en caso de error
        })
      )
      .subscribe(); // Suscribirse para iniciar la solicitud
  }

  // Método para obtener un observable de actualizaciones de posts
  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  // Método para agregar un nuevo post
  addPost(title: string, content: string): Observable<any> {
    console.log('Preparing to add post:', title, content);
    this.csrfService.getCsrfToken().subscribe(); // Obtener el token CSRF
    // Obtener encabezados con el token CSRF
    return this.csrfService.getHeaders().pipe(
      switchMap(headers => {
        console.log('Using headers for post request:', headers);
        console.log('CSRF Token in addPost:', this.csrfService.getToken());
        
        // Preparar el cuerpo de la solicitud
        const body = { title, content };
        console.log('Request body:', body);

        // Realizar la solicitud POST
        return this.http.post<{ message: string; post: Post }>('http://localhost:3000/api/posts', body, { headers }).pipe(
          tap(response => {
            console.log('Response from server:', response);

            // Actualizar el array de posts y emitir la nueva lista
            this.posts.push(response.post);
            this.postsUpdated.next([...this.posts]);
          }),
          catchError(error => {
            console.error('Error adding post:', error);
            return of(error); // Manejar errores devolviendo un observable con el error
          })
        );
      }),
      catchError(error => {
        console.error('Error in the addPost process:', error);
        return of(error); // Manejar errores devolviendo un observable con el error
      })
    );
  }
}
