import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RealtimeDatabaseService } from 'src/app/services/realtime-database.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { dump } from 'src/app/others/utils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  isUploading = false
  task!: Promise<string>

  constructor(private releasesDB: RealtimeDatabaseService, private storage: StorageService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  addObject(): void {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: { info: {} as any }
    })

    dialogRef.afterClosed().subscribe((resultObj) => {
      if (resultObj) {
        this.isUploading = true
        const filePath = `releases/${resultObj.platform}/${Date.now()}_${resultObj.file.name}`
        this.task = this.storage.uploadFile(resultObj.file, filePath)
        this.task.then((fileUrl) => {
          const version = resultObj.version.toString().replace('.', ',')
          const release = {
            version: resultObj.version,
            platform: resultObj.platform,
            architecture: resultObj.architecture,
            language: resultObj.language,
            fileUrl: fileUrl,
            changelog: resultObj.changelog,
            date: Date.now(),
          }
          this.releasesDB.put(`releases/${resultObj.platform}/${version}`, release).subscribe()
          this.releasesDB.put(`releases/${resultObj.platform}/latestVersion`, resultObj.version).subscribe()
          this.isUploading = false
          this.openSnackBar('Uploaded successfully')
        }).catch((error) => {
          console.log(error)
          this.isUploading = false
        })
      }
    })
  }

  cancelUpload() {
    this.task.then(
      (result) => {
        this.storage.deleteFile(result)
        this.openSnackBar('Upload canceled')
      }
    ).catch((error) => {
      console.log("error: " + error)
    })
    this.isUploading = false
  }

  private openSnackBar(text: string) {
    this.snackBar.open(text, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

}
