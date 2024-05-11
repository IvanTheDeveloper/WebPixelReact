import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
  photoUrl: any
  displayName: any
  phoneNumber: any
  email: any

  newPhotoUrl: any
  newDisplayName: any
  newPhoneNumber: any
  newEmail: any

  constructor(private auth: AuthService, public dialog: MatDialog) { }

  ngOnInit() {
    this.delay()
  }

  async delay() {
    await new Promise(f => setTimeout(f, 500))
    this.refresh()
  }

  refresh() {
    this.photoUrl = this.auth.currentUser?.photoURL
    this.displayName = this.auth.currentUser?.displayName
    this.phoneNumber = this.auth.currentUser?.phoneNumber
    this.email = this.auth.currentUser?.email
  }

  updateDisplayName() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Change username', text: 'Are you sure?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.auth.setAuthCurrentUserProperty('displayName', this.displayName)
        this.refresh()
        this.newDisplayName = ''
      }
    });

  }

}