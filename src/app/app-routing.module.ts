import { NgModule, isDevMode } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { devModeEnabled } from './others/globalProperties';

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
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { PublishedGameComponent } from './components/published-game/published-game.component';
import { RegisterWithVerificationComponent } from './components/auth/register-with-verification/register-with-verification.component';
import { QrCodeComponent } from './components/auth/qr-code/qr-code.component';
import { ChatBubbleComponent } from './components/chat-bubble/chat-bubble.component';


export const routingTable = {
  landing: 'home', //when the user IS NOT logged in
  home: 'home', //when the user IS logged in
  notFound: '404',
  forbidden: '403',
  unauthorized: '401',
  cookieConsent: 'legal/cookies',
  privacyPolicy: 'legal/privacy-policy',
  termsAndConditions: 'legal/tos',
  login: 'login',
  register: 'register',
  passwordReset: 'reset-password',
  userSettings: 'settings',
  download: 'download',
  leaderborad: 'leaderboard',
  about: 'about',
  admin: 'admin',
  support: 'chat',
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
      { path: routingTable.register, title: 'Register', component: devModeEnabled ? RegisterComponent : RegisterWithVerificationComponent, canActivate: [unauthenticatedUsersGuard] },
      { path: 'auth/:code', title: 'QR', component: QrCodeComponent, canActivate: [authenticatedUsersGuard] },
      { path: routingTable.passwordReset, title: 'Reset Password', component: ResetPasswordComponent, canActivate: [unauthenticatedUsersGuard] },
      { path: routingTable.userSettings, title: 'Settings', component: UserSettingsComponent, canActivate: [authenticatedUsersGuard] },
      { path: routingTable.admin, title: 'Admin', component: AdminComponent, canActivate: [adminGuard] },
      { path: routingTable.support, title: 'Support', component: ChatBubbleComponent },

      { path: routingTable.about, title: 'About Us', component: AboutComponent },
      { path: routingTable.download, title: 'Download', component: DownloadComponent },
      { path: routingTable.leaderborad, title: 'Leaderboard', component: LeaderboardComponent },
      { path: 'game/:authorId/:name', title: 'Saved Game', component: PublishedGameComponent },
      { path: 'my-games', title: 'My games', component: LeaderboardComponent, canActivate: [authenticatedUsersGuard] },
      { path: 'comment/:id', title: 'Comment', component: CommentComponent },
    ]
  },
  { //views with naked components
    path: '', //legal
    children: [
      { path: routingTable.cookieConsent, title: 'Cookies', component: CookieConsentComponent },
      { path: routingTable.privacyPolicy, title: 'Privacy Policy', component: PrivacyPolicyComponent },
      { path: routingTable.termsAndConditions, title: 'TOS', component: TermsAndConditionsComponent },
      { path: routingTable.test, title: 'Test', component: TestComponent },
    ],
  },
  { path: '**', redirectTo: routingTable.notFound }, //view when the url is invalid
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
