import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PostComponent } from './pages/post/post.component';
import { PostDeactivateGuard } from './pages/post/post.deactivate.guard';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: { title: 'Home Page' },
    },
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login' },
    },
    {
        path: 'post/:postId',
        component: PostComponent,
        canActivate: [AuthGuard],
        canDeactivate: [PostDeactivateGuard],
        data: { title: 'Post' },
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
