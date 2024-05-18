import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { dump, isNullOrEmpty } from 'src/app/others/utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { pwdRegExp } from 'src/app/others/password-rules';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
  image: any
  newImage: any
  password = ''
  hidePassword = true
  username: any
  phone: any
  email: any
  newDisplayName: any
  newPhoneNumber: any
  newEmail: any

  constructor(private auth: AuthService, public dialog: MatDialog, private fileUploader: UploadFileService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.delay()
  }

  async delay() {
    await new Promise(f => setTimeout(f, 500))
    this.refresh()
  }

  refresh() {
    this.image = this.auth.currentUser?.photoURL
    this.username = this.auth.currentUser?.displayName
    this.phone = this.auth.currentUser?.phoneNumber
    this.email = this.auth.currentUser?.email
  }

  isUndefined(any: any) {
    return isNullOrEmpty(any)
  }

  updateDisplayName() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Change username', text: 'Are you sure?' }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.auth.setAuthCurrentUserProperty('displayName', this.newDisplayName)
        this.refresh()
        this.newDisplayName = ''
        this.snackBar.open('Username successfully updated')
      }
    })
  }

  onFileSelected(event: any): void {
    const img = event.target.files[0]
    this.newImage = URL.createObjectURL(img)
  }

  updateImage() {
    if (this.image.match(/\.(jpeg|jpg|gif|png)$/) == null) {
      this.showSnackbar('The selected file is not an image', 'error-message')
      return
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Change profile picture', text: 'Are you sure?' }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const filePath = `images/${Date.now()}_${this.username}`
        if (this.newImage instanceof File) {
          this.fileUploader.uploadFile(filePath, this.newImage).then(
            (url) => {
              this.auth.setAuthCurrentUserProperty('photoURL', url)
              this.refresh()
              this.newImage = ''
            }
          ).catch((error) => {
            console.log("Ha habido un error: " + error)
          })
        } else {
          this.fileUploader.uploadFileByUrl(filePath, this.newImage).then(
            (url) => {
              this.auth.setAuthCurrentUserProperty('photoURL', url)
              this.refresh()
              this.newImage = ''
              this.snackBar.open('Avatar successfully updated')
            }
          ).catch((error) => {
            console.log("Ha habido un error: " + error)
          })
        }
      }
    })
  }

  isValidPwd(): boolean {
    return (pwdRegExp.test(this.password) && this.password.length >= 8 && this.password.length <= 30)
  }

  changePassword() {
    if (!this.isValidPwd()) {
      this.showSnackbar('Invalid password', 'error-message')
      return
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Change password', text: 'Are you sure?' }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.auth.changePassword(this.password)
        this.snackBar.open('Password successfully updated')
      }
    })
  }

  showSnackbar(mensaje: string, clase: string): void {
    this.snackBar.open(mensaje, 'Ok', {
      duration: 3000,
      panelClass: [clase]
    })
  }

}