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
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { MainComponent } from './layouts/main/main.component';

const landing = 'home' //when the user IS NOT logged in
const home = 'home' //when the user IS logged in
const notAuthenticated = 'unauthorized'
const notFound = '404'

const cookieConsent = 'cookies'
const privacyPolicy = 'privacy-policy'
const termsAndConditions = 'terms-of-use'

const login = 'login'
const register = 'register'
const userSettings = 'settings'
const admin = 'admin'
const download = 'download'
const about = 'about'

const routes: Routes = [
  { path: '', redirectTo: landing, pathMatch: 'full' }, //default page on opening
  //#region views with complex layout
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'comment/:id', component: CommentComponent },

      { path: download, title: download, component: DownloadComponent },
      { path: about, title: about, component: AboutComponent },
      { path: login, title: login, component: LoginComponent, canActivate: [unauthenticatedUsersGuard] },
      { path: register, title: register, component: RegisterComponent, canActivate: [unauthenticatedUsersGuard] },
      { path: userSettings, title: userSettings, component: UserSettingsComponent, canActivate: [authenticatedUsersGuard] },
      { path: admin, title: admin, component: AdminComponent, canActivate: [adminGuard] },

      { path: landing, title: landing, component: HomeComponent },
      { path: home, title: home, component: HomeComponent },
      { path: cookieConsent, title: cookieConsent, component: HomeComponent },
      { path: privacyPolicy, title: privacyPolicy, component: PrivacyPolicyComponent },
      { path: termsAndConditions, title: termsAndConditions, component: TermsAndConditionsComponent },
      { path: notAuthenticated, title: notAuthenticated, component: NotAuthenticatedComponent },
      { path: notFound, title: notFound, component: PageNotFoundComponent },
    ]
  },
  //#endregion
  //#region views with naked components
  { path: privacyPolicy, component: PrivacyPolicyComponent },
  { path: termsAndConditions, component: TermsAndConditionsComponent },
  { path: cookieConsent, component: TermsAndConditionsComponent },
  //#endregion
  { path: '**', redirectTo: notFound }, //view when the url is invalid
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
