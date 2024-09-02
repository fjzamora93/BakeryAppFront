import { Routes } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { PostBodyComponent } from './posts/post-body.component';
import { ProfileComponent } from './auth/profile/profile.component';

export const routes: Routes = [
    { 
        path: "", 
        component: PostBodyComponent 
    },
    { 
        path: "create", 
        component: PostCreateComponent, canActivate: [AuthGuard] 
    },
    { 
        path: "edit/:postId", 
        component: PostCreateComponent, canActivate: [AuthGuard] 
    },
    { 
        path: "login", 
        component: LoginComponent 
    },
    { 
        path: "signup", 
        component: SignupComponent 
    },
    { 
        path: "profile", 
        component: ProfileComponent, canActivate: [AuthGuard] 
    },
  ];

