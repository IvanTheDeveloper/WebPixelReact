import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirebaseModule } from './firebase/firebase.module';

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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { CardComponent } from './components/card/card.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AlumnoFormComponent } from './components/alumno-form/alumno-form.component';
import { AlumnoListComponent } from './components/alumno-list/alumno-list.component';
import { ProfesorListComponent } from './components/profesor-list/profesor-list.component';
import { ProfesorFormComponent } from './components/profesor-form/profesor-form.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FilterComponent } from './components/filter/filter.component';
import { TableComponent } from './components/table/table.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { EasterEggComponent } from './components/easter-egg/easter-egg.component';
import { HomeComponent } from './components/home/home.component';
import { TestComponent } from './components/test/test.component';
import { AboutComponent } from './components/about/about.component';
import { DownloadComponent } from './components/download/download.component';
import { NotAuthenticatedComponent } from './components/not-authenticated/not-authenticated.component';

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
    PageNotFoundComponent,
    AlumnoFormComponent,
    AlumnoListComponent,
    ProfesorListComponent,
    ProfesorFormComponent,
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
    NotAuthenticatedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FirebaseModule,
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
    CdkDrag,
    CdkDropList,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }