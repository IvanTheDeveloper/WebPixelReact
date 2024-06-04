import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirebaseModule } from './firebase/firebase.module';
import { CookieModule } from './cookie/cookie.module';

import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/basic/header/header.component';
import { FooterComponent } from './components/basic/footer/footer.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { CardComponent } from './components/card/card.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { NotFoundComponent } from './components/basic/not-found/not-found.component';
import { AlumnoFormComponent } from './components/alumno-form/alumno-form.component';
import { AlumnoListComponent } from './components/alumno-list/alumno-list.component';
import { NoResultsComponent } from './components/basic/no-results/no-results.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FilterComponent } from './components/filter/filter.component';
import { TableComponent } from './components/table/table.component';
import { UserSettingsComponent } from './components/auth/user-settings/user-settings.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { EasterEggComponent } from './components/tools/easter-egg/easter-egg.component';
import { HomeComponent } from './components/basic/home/home.component';
import { TestComponent } from './components/tools/test/test.component';
import { AboutComponent } from './components/basic/about/about.component';
import { DownloadComponent } from './components/download/download.component';
import { ForbiddenComponent } from './components/basic/forbidden/forbidden.component';
import { DevComponent } from './components/tools/dev/dev.component';
import { LoggerComponent } from './components/tools/logger/logger.component';
import { CommentBoxComponent } from './components/comment-box/comment-box.component';
import { CommentComponent } from './components/comment/comment.component';
import { AdminComponent } from './components/admin/admin.component';
import { FormDialogComponent } from './components/form-dialog/form-dialog.component';
import { PrivacyPolicyComponent } from './components/pdf/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './components/pdf/terms-and-conditions/terms-and-conditions.component';
import { MainComponent } from './layouts/main/main.component';
import { VersionsTableComponent } from './components/versions-table/versions-table.component';
import { CookieConsentComponent } from './components/pdf/cookie-consent/cookie-consent.component';
import { CountryFlagEmojiPipe } from './pipes/country-flag-emoji.pipe';
import { UnauthorizedComponent } from './components/basic/unauthorized/unauthorized.component';
import { MyRouterDirective } from './directives/my-router.directive';
import { CustomTagComponent } from './components/tools/custom-tag/custom-tag.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { PublishedGameComponent } from './components/published-game/published-game.component';
import { RegisterWithVerificationComponent } from './components/auth/register-with-verification/register-with-verification.component';
import { QrCodeComponent } from './components/auth/qr-code/qr-code.component';
import { KeyboardComponent } from './components/tools/keyboard/keyboard.component';
import { ArrowComponent } from './components/tools/arrow/arrow.component';
import { PopupComponent } from './components/tools/popup/popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    DeleteDialogComponent,
    CardComponent,
    CardListComponent,
    NotFoundComponent,
    AlumnoFormComponent,
    AlumnoListComponent,
    NoResultsComponent,
    PaginatorComponent,
    FilterComponent,
    TableComponent,
    UserSettingsComponent,
    ConfirmationDialogComponent,
    EasterEggComponent,
    HomeComponent,
    TestComponent,
    AboutComponent,
    DownloadComponent,
    ForbiddenComponent,
    DevComponent,
    LoggerComponent,
    CommentBoxComponent,
    CommentComponent,
    AdminComponent,
    FormDialogComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    MainComponent,
    VersionsTableComponent,
    CookieConsentComponent,
    CountryFlagEmojiPipe,
    UnauthorizedComponent,
    MyRouterDirective,
    CustomTagComponent,
    ResetPasswordComponent,
    LeaderboardComponent,
    PublishedGameComponent,
    RegisterWithVerificationComponent,
    QrCodeComponent,
    KeyboardComponent,
    ArrowComponent,
    PopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FirebaseModule,
    CookieModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatDividerModule,
    MatMenuModule,
    MatSidenavModule,
    MatCardModule,
    MatTabsModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    CdkDrag,
    CdkDropList,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }