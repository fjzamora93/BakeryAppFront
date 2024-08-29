import { Routes } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './auth/auth.guard';
import { PostBodyComponent } from './posts/post-body.component';

export const routes: Routes = [
    { 
        path: "", 
        component: PostBodyComponent 
    },
    { 
        path: "create", 
        component: PostCreateComponent, canActivate: [authGuard] 
    },
    { 
        path: "edit/:postId", 
        component: PostCreateComponent, canActivate: [authGuard] 
    },
    { 
        path: "login", 
        component: LoginComponent 
    },
    { 
        path: "signup", 
        component: SignupComponent 
    },
  ];

