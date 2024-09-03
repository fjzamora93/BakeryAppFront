import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, from, of, map, throwError } from 'rxjs';
import { catchError, last, switchMap, tap } from 'rxjs/operators';
import { Post } from './post.model';
import { CsrfService } from '../csrf.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { UserData } from '../auth/user-data.model';

@Injectable({ providedIn: 'root' })
export class PostsService {

    //TODO CAMBIAR URL DE LA API
    private apiUrl = environment.apiUrl + '/posts';
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();
    private filteredPosts = new Subject<Post[]>();
    private filteredPostsValue: Post[] = [];

    private selectedPost = new BehaviorSubject<Post | null>(null);
    private isAuthered = new BehaviorSubject<boolean>(false);
    private user?: UserData;

    /** @deprecated */
    public postSelected?: Post;

    constructor(
        private http: HttpClient, 
        private csrfService: CsrfService,
        private authService: AuthService
    ) {
        this.authService.getUserStatus().subscribe(user => {
            this.user = user;
        });

        this.getPostUpdateListener().subscribe(posts => {
            this.posts = posts;
            this.setSelectedPost(this.posts[this.posts.length - 1]);
        });
        
    }

    // Método para obtener un post seleccionado
    getSelectedPost(): Observable<Post | null> {
        return this.selectedPost.asObservable();
    }

    setSelectedPost(post: Post | null): void {
        this.selectedPost.next(post);
    }


    setFilteredPosts(filter: string = '', searchString:string = '', resetSearchBar:boolean= false) {
        switch (filter) {
            case 'bookmarked':
                this.filteredPostsValue = this.posts.filter(post => this.user!.bookmark.includes(post._id));
                this.setSelectedPost(this.filteredPostsValue [0]);
                this.filteredPosts.next([...this.filteredPostsValue]);
                return this.filteredPostsValue ;
            case 'authored':
                this.filteredPostsValue  = this.posts.filter(post => post.author === this.user!._id);
                this.setSelectedPost(this.filteredPostsValue [0]);
                this.filteredPosts.next([...this.filteredPostsValue]);
                return this.filteredPostsValue ;
            case 'searchbar':
                if (resetSearchBar){
                    this.filteredPostsValue = this.posts;
                }
                let searchResult = this.filteredPostsValue.filter(post => post.title.toLowerCase().includes(searchString.toLowerCase()));
                this.filteredPosts.next([...searchResult]);
                return searchResult ;
            default:
                return this.posts;
        }
        
    }

    getFilteredPostUpdateListener(): Observable<Post[]> {
        return this.filteredPosts.asObservable();
    }

    //TODO: EL BUSCADOR BUSCA EN LA LISTA GENÉRICA, NO EN LAS LISTAS FILTRADAS
    getPostFilteredByString(searchString: string) {
        return this.posts.filter(post => post.title.toLowerCase().includes(searchString.toLowerCase()));
      }
    
    getPostsByCategory(category: string): Post[] {
        console.log(this.posts.filter(post => post.category!.includes(category)))
        return this.posts.filter(post => post.category!.includes(category));
    }

    
    // Método para obtener posts
    getPosts(): void {
        this.http.get<{ message: string; posts: Post[] }>(this.apiUrl, { withCredentials: true })
            .pipe(
                tap(postData => {
                    this.posts = postData.posts;
                    this.filteredPostsValue = this.posts;
                    this.postsUpdated.next([...this.posts]);
                    this.filteredPosts.next([...this.posts]);
                }),
                catchError(error => {
                    console.error('Error fetching posts:', error);
                    return of({ message: '', posts: [] }); 
                })
            )
            .subscribe(); 
    }

    // Método para obtener un observable de actualizaciones de posts
    getPostUpdateListener(): Observable<Post[]> {
        return this.postsUpdated.asObservable();
    }


    // Método para agregar un nuevo post
    addPostFormData(post: Post): Observable<any> {
        const formData: FormData = new FormData();
        // Agrega los campos del post a FormData
        formData.append('title', post.title);
        formData.append('description', post.description || '');
        formData.append('content', post.content || '');
        formData.append('status', post.status || '1');
        formData.append('date', post.date || '30 minutos');
        formData.append('author', post.author || '');
        // Enviar cada elemento de 'items', 'categoria' y 'steps' individualmente
        if (post.category) {
            post.category.forEach((cat, index) => {
                formData.append(`category[${index}]`, cat);
            });
        }
        if (post.items) {
            post.items.forEach((item, index) => {
                formData.append(`items[${index}]`, item);
            });
        }
        if (post.steps) {
            post.steps.forEach((step, index) => {
                formData.append(`steps[${index}]`, step);
            });
        }
        //! 'file' es el nombre que configuramos para recibir en el backend el MULTER!
        if (post.imgUrl instanceof File) {
            formData.append('file', post.imgUrl); 
        }
        return this.csrfService.getHeaders().pipe(
            switchMap(headers => {
                return this.http.post<Post>(
                    this.apiUrl, 
                    formData, {
                    headers: headers,
                    withCredentials: true
                }).pipe(
                    catchError(error => {
                        console.error('Error updating post:', error);
                        return of(error);
                    })
                );
            })
        );
    }

    // Método para borrar un post
    deletePost(postId: string): Observable<any> {
        return this.csrfService.getHeaders().pipe(
            switchMap(headers => {
                console.log('Intentando borrar en el front:', postId, `${this.apiUrl}/${postId}`)
                return this.http.delete(`${this.apiUrl}/${postId}`, { headers, withCredentials: true }).pipe(
                    catchError(error => {
                        console.error('Error deleting post:', error);
                        return of(error);
                    })
                );
            })
        );
    }

    

    updatePostFormData(post: Post): Observable<any> {
        const postId = post._id; 
        const formData: FormData = new FormData();
    
        // Agrega los campos del post a FormData
        formData.append('title', post.title);
        formData.append('description', post.description || '');
        formData.append('content', post.content || '');
        formData.append('status', post.status || '1');
        formData.append('date', post.date || '30 minutos');
      
        // Enviar cada elemento de 'items', 'categoria' y 'steps' individualmente

        if (post.category) {
            post.category.forEach((cat, index) => {
                console.log('Categoría:', cat);
                formData.append(`category[${index}]`, cat);
            });
        }

        if (post.items) {
            post.items.forEach((item, index) => {
                formData.append(`items[${index}]`, item);
            });
        }

        if (post.steps) {
            post.steps.forEach((step, index) => {
                formData.append(`steps[${index}]`, step);
            });
        }
        
        //! 'file' es el nombre que configuramos para recibir en el backend el MULTER!
        if (post.imgUrl instanceof File) {
            formData.append('file', post.imgUrl); 
        }
    
        return this.csrfService.getHeaders().pipe(
            switchMap(headers => {
                // No se puede usar 'Content-Type': 'multipart/form-data' porque el navegador lo establece automáticamente
                const updatedHeaders = headers.delete('Content-Type');
                return this.http.put(`${this.apiUrl}/${postId}`, formData, {
                    headers: updatedHeaders,
                    withCredentials: true
                }).pipe(
                    catchError(error => {
                        console.error('Error updating post:', error);
                        return of(error);
                    })
                );
            })
        );
    }
    
    getIsAuthored(): Observable<boolean> {
        return this.isAuthered.asObservable();
    }

    setIsAuthored(postId: string = '' ): void {
        if (!this.user || !postId) {
            this.isAuthered.next(false);
            return;
        }
        const isAuth = this.user._id === postId;
        this.isAuthered.next(isAuth);
    }

     /**
     * @deprecated
     * Este método envía un JSON en lugar de un FormData, lo que impide el manejo de archivos e imágenes.
     */
     updatePostJSON(post: Post): Observable<any> {
        return this.csrfService.getHeaders().pipe(
            switchMap(headers => {
                console.log('Intentando actualizar en el front:', post);
                return this.http.put(this.apiUrl + '/' + post._id, post, { headers, withCredentials: true }).pipe(
                    catchError(error => {
                        console.error('Error updating post:', error);
                        return of(error);
                    })
                );
            })
        );
    }

    /**
     * @deprecated
     * Subida de imágenes desde el front, ahora las subimos desde el backend
     */
    uploadToImgur(file: File): Observable<string> {
        const formData: FormData = new FormData();
        formData.append('image', file);
    
        return new Observable<string>(observer => {
            fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: {
                    Authorization: 'Client-ID 5365eaee691c9f3',
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("DATA: ", data.data.link);
                    observer.next(data.data.link);  // Emitir el enlace de la imagen
                    observer.complete();  // Completar el Observable
                } else {
                    observer.error(new Error(data.data.error));  // Emitir un error si la respuesta no es exitosa
                }
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                observer.error(error);  // Emitir un error si hay problemas con fetch
            });
        });
    }


    addToBookmark(postId: string, userId: string) {
        const body = { postId, userId};
        console.log("Adding bookmark", this.apiUrl);
        return this.csrfService.getHeaders().pipe(
            switchMap(headers => {
                return this.http.post(
                    `${this.apiUrl}/bookmark`, 
                    body , 
                    { headers, withCredentials: true }
                ).pipe(
                tap(response => {
                    console.log('Bookmark Response:', body,  response);
                }),
                catchError(error => {
                    console.error('Error adding bookmark:', error);
                    return throwError(() => new Error('An unknown error occurred'));
                })
                );
            })
        );
    }
}



