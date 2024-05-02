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
    this.photoUrl = this.auth.getPhotoUrl()
    this.displayName = this.auth.getDisplayName()
    this.phoneNumber = this.auth.getPhoneNumber()
    this.email = this.auth.getEmail()
  }

  updateDisplayName() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Change username', text: 'Are you sure?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.auth.updateDisplayName(this.newDisplayName)
        this.refresh()
        this.newDisplayName = ''
      }
    });

  }

}