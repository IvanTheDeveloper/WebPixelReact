import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { StorageService } from 'src/app/services/storage.service';
import { dump, isNullOrEmpty } from 'src/app/others/utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { pwdRegExp } from 'src/app/others/password-rules';
import { Router } from '@angular/router';
import { routingTable } from 'src/app/app-routing.module';
import { MyUser } from 'src/app/models/user';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
  username: any
  newUsername: any
  password = ''
  hidePassword = true
  profilePicture: any
  newProfilePicture: any
  cursorIcon: any
  newCursorIcon: any

  constructor(private auth: AuthService, private storage: StorageService, private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.delay()
  }

  async delay() {
    await new Promise(f => setTimeout(f, 500))
    this.refresh()
  }

  async refresh() {
    const user = await this.auth.getDbUser()
    this.username = user.username
    this.profilePicture = user.avatarUrl
    this.cursorIcon = user.cursorUrl
    //this.password = user.password
  }

  updateDisplayName() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Change username', text: 'Are you sure?' }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const user = new MyUser()
        user.username = this.newUsername
        this.auth.updateUser(user).then(() => {
          this.refresh()
          this.newUsername = ''
          this.showSnackbar('Username successfully updated')
        })
      }
    })
  }

  updatePassword() {
    if (!this.isValidPwd()) {
      this.showSnackbar('Invalid password')
      return
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Change password', text: 'Are you sure?' }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const user = new MyUser()
        user.password = this.password
        this.auth.updateUser(user).then(() => {
          this.password = ''
          this.showSnackbar('Password successfully updated')
        })
      }
    })
  }

  isValidPwd(): boolean {
    return (pwdRegExp.test(this.password) && this.password.length >= 8 && this.password.length <= 30)
  }

  onAvatarFileSelected(event: any): void {
    const img = event.target.files[0]
    if (img.name.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) == null) {
      this.showSnackbar('The selected file is not an image')
      this.newProfilePicture = ''
    } else {
      this.newProfilePicture = URL.createObjectURL(img)
    }
  }

  updateProfilePicture() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Change profile picture', text: 'Are you sure?' }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const filePath = `images/${Date.now()}_${this.username}`
        this.storage.uploadFile(this.newProfilePicture, filePath).then(
          (url) => {
            const user = new MyUser()
            user.avatarUrl = url
            this.auth.updateUser(user).then(() => {
              this.storage.deleteFile(this.profilePicture)
              this.refresh()
              this.newProfilePicture = ''
              this.showSnackbar('Profile picture successfully updated')
            })
          }
        ).catch((error) => {
          console.log("Error: " + error)
        })

      }
    })
  }

  onCursorFileSelected(event: any): void {
    const img = event.target.files[0]
    if (img.name.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) == null) {
      this.showSnackbar('The selected file is not an image')
      this.newCursorIcon = ''
    } else {
      this.newCursorIcon = URL.createObjectURL(img)
    }
  }

  updateCursorIcon() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Change profile picture', text: 'Are you sure?' }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const filePath = `images/${Date.now()}_${this.username}`
        this.storage.uploadFile(this.newCursorIcon, filePath).then(
          (url) => {
            const user = new MyUser()
            user.cursorUrl = url
            this.auth.updateUser(user).then(() => {
              this.storage.deleteFile(this.cursorIcon)
              this.refresh()
              this.newCursorIcon = ''
              this.showSnackbar('Cursor icon successfully updated')
            })
          }
        ).catch((error) => {
          console.log("Error: " + error)
        })

      }
    })
  }

  deleteAccount() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Delete account', text: 'Are you sure?' }
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.auth.deleteAccount().then(() => {
          this.router.navigate([routingTable.landing])
          this.showSnackbar('Goodbye!')
        })
      }
    })
  }

  isUndefined(any: any) {
    return isNullOrEmpty(any)
  }

  showSnackbar(mensaje: string): void {
    this.snackBar.open(mensaje, 'Ok', {
      duration: 3000,
    })
  }

}