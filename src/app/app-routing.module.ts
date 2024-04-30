import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { unauthenticatedUsersGuard } from './guards/unauthenticated-users.guard';
import { authenticatedUsersGuard } from './guards/authenticated-users.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfesorListComponent } from './components/profesor-list/profesor-list.component';
import { AlumnoListComponent } from './components/alumno-list/alumno-list.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { TableComponent } from './components/table/table.component';

const landingPage = '/login' //when the user IS NOT logged in
const mainPage = '/orlas' //when the user IS logged in
const notFoundPage = undefined

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [unauthenticatedUsersGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [unauthenticatedUsersGuard] },
  { path: 'orlas', component: CardListComponent },
  { path: 'tabla', component: TableComponent },
  { path: 'alumnos', component: AlumnoListComponent, canActivate: [authenticatedUsersGuard] },
  { path: 'profesores', component: ProfesorListComponent, canActivate: [authenticatedUsersGuard] },
  { path: '', redirectTo: landingPage, pathMatch: 'full' }, //default page for welcoming
  { path: 'main', redirectTo: mainPage, pathMatch: 'full' }, //main website page
  { path: '**', redirectTo: notFoundPage, component: PageNotFoundComponent }, //view when the url is invalid
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
