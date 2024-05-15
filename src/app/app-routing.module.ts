import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { unauthenticatedUsersGuard } from './guards/unauthenticated-users.guard';
import { authenticatedUsersGuard } from './guards/authenticated-users.guard';
import { NotFoundComponent } from './components/basic/not-found/not-found.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { HomeComponent } from './components/basic/home/home.component';
import { ForbiddenComponent } from './components/basic/forbidden/forbidden.component';
import { adminGuard } from './guards/admin.guard';
import { DownloadComponent } from './components/download/download.component';
import { AboutComponent } from './components/basic/about/about.component';
import { CommentComponent } from './components/comment/comment.component';
import { AdminComponent } from './components/admin/admin.component';
import { PrivacyPolicyComponent } from './components/pdf/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './components/pdf/terms-and-conditions/terms-and-conditions.component';
import { MainComponent } from './layouts/main/main.component';
import { CookieConsentComponent } from './components/pdf/cookie-consent/cookie-consent.component';
import { TestComponent } from './components/tools/test/test.component';

const landing = 'home' //when the user IS NOT logged in
const home = 'home' //when the user IS logged in
const forbidden = '403'
const notFound = '404'

const cookieConsent = 'cookie-consent'
const privacyPolicy = 'privacy-policy'
const termsAndConditions = 'terms-and-conditions'

const login = 'login'
const register = 'register'
const userSettings = 'settings'
const admin = 'admin'
const download = 'download'
const about = 'about'

const test = 'helloworld'

const routes: Routes = [
  { path: '', redirectTo: landing, pathMatch: 'full' }, //default page on opening
  { //views with complex layout
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
      { path: forbidden, title: forbidden, component: ForbiddenComponent },
      { path: notFound, title: notFound, component: NotFoundComponent },
    ]
  },
  { //views with naked components
    path: '',
    children: [
      { path: privacyPolicy, component: PrivacyPolicyComponent },
      { path: termsAndConditions, component: TermsAndConditionsComponent },
      { path: cookieConsent, component: CookieConsentComponent },
      { path: test, component: TestComponent },
    ],
  },
  { path: '**', redirectTo: notFound }, //view when the url is invalid
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
