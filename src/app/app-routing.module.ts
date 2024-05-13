import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { unauthenticatedUsersGuard } from './guards/unauthenticated-users.guard';
import { authenticatedUsersGuard } from './guards/authenticated-users.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { HomeComponent } from './components/home/home.component';
import { NotAuthenticatedComponent } from './components/not-authenticated/not-authenticated.component';
import { adminGuard } from './guards/admin.guard';
import { DownloadComponent } from './components/download/download.component';
import { AboutComponent } from './components/about/about.component';
import { CommentComponent } from './components/comment/comment.component';
import { AdminComponent } from './components/admin/admin.component';

const landing = 'home' //when the user IS NOT logged in
const home = 'home' //when the user IS logged in
const notAuthenticated = 'unauthorized'
const notFound = '404'

const login = 'login'
const register = 'register'
const userSettings = 'settings'
const admin = 'admin'
const download = 'download'
const about = 'about'

const routes: Routes = [
  { path: 'comment/:id', component: CommentComponent },

  { path: download, component: DownloadComponent },
  { path: about, component: AboutComponent },
  { path: login, component: LoginComponent, canActivate: [unauthenticatedUsersGuard] },
  { path: register, component: RegisterComponent, canActivate: [unauthenticatedUsersGuard] },
  { path: userSettings, component: UserSettingsComponent, canActivate: [authenticatedUsersGuard] },
  { path: admin, component: AdminComponent, canActivate: [adminGuard] },

  { path: '', redirectTo: landing, pathMatch: 'full' }, //default page for welcoming
  { path: landing, component: HomeComponent },
  { path: home, component: HomeComponent },
  { path: notAuthenticated, component: NotAuthenticatedComponent },
  { path: notFound, component: PageNotFoundComponent },
  { path: '**', redirectTo: notFound }, //view when the url is invalid
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
