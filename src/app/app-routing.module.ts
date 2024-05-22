import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { unauthenticatedUsersGuard } from './guards/unauthenticated-users.guard';
import { authenticatedUsersGuard } from './guards/authenticated-users.guard';
import { NotFoundComponent } from './components/basic/not-found/not-found.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { UserSettingsComponent } from './components/auth/user-settings/user-settings.component';
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
import { UnauthorizedComponent } from './components/basic/unauthorized/unauthorized.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';

export const routingTable = {
  landing: 'home', //when the user IS NOT logged in
  home: 'home', //when the user IS logged in
  notFound: '404',
  forbidden: '403',
  unauthorized: '401',
  cookieConsent: 'legal/cookie-consent',
  privacyPolicy: 'legal/privacy-policy',
  termsAndConditions: 'legal/terms-and-conditions',
  login: 'login',
  register: 'register',
  passwordReset: 'reset-password',
  userSettings: 'settings',
  download: 'download',
  about: 'about',
  admin: 'admin',
  test: 'helloworld'
};

const routes: Routes = [
  { path: '', redirectTo: routingTable.landing, pathMatch: 'full' }, //default page on opening
  { //views with complex layout
    path: '',
    component: MainComponent,
    children: [
      { path: routingTable.landing, title: 'Welcome', component: HomeComponent },
      { path: routingTable.home, title: 'Pixel React', component: HomeComponent },
      { path: routingTable.notFound, title: 'Not Found', component: NotFoundComponent },
      { path: routingTable.forbidden, title: 'Forbidden', component: ForbiddenComponent },
      { path: routingTable.unauthorized, title: 'Unauthorized', component: UnauthorizedComponent },

      { path: routingTable.login, title: 'Login', component: LoginComponent, canActivate: [unauthenticatedUsersGuard] },
      { path: routingTable.register, title: 'Register', component: RegisterComponent, canActivate: [unauthenticatedUsersGuard] },
      { path: routingTable.passwordReset, title: 'Reset Password', component: ResetPasswordComponent, },
      { path: routingTable.userSettings, title: 'Settings', component: UserSettingsComponent, canActivate: [authenticatedUsersGuard] },
      { path: routingTable.admin, title: 'Admin', component: AdminComponent, canActivate: [adminGuard] },

      { path: routingTable.about, title: 'About Us', component: AboutComponent },
      { path: routingTable.download, title: 'Download', component: DownloadComponent },
      { path: 'comment/:id', component: CommentComponent },
    ]
  },
  { //views with naked components
    path: '',
    children: [
      { path: routingTable.cookieConsent, component: CookieConsentComponent },
      { path: routingTable.privacyPolicy, component: PrivacyPolicyComponent },
      { path: routingTable.termsAndConditions, component: TermsAndConditionsComponent },
      { path: routingTable.test, component: TestComponent },
    ],
  },
  { path: '**', redirectTo: routingTable.notFound }, //view when the url is invalid
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
