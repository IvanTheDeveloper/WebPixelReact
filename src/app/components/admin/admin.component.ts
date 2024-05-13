import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RealtimeDatabaseService } from 'src/app/services/realtime-database.service';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  isUploading = false
  task!: Promise<string>

  constructor(private releasesDB: RealtimeDatabaseService, private fileUploader: UploadFileService, public dialog: MatDialog,) { }

  addObject(): void {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: { info: {} as any }
    })

    dialogRef.afterClosed().subscribe((resultObj) => {
      if (resultObj) {
        this.isUploading = true
        const filePath = `releases/${resultObj.platform}/${Date.now()}_${resultObj.file.name}`
        this.task = this.fileUploader.uploadFile(filePath, resultObj.file)
        this.task.then((fileUrl) => {
          const version = resultObj.version.toString().replace('.', ',')
          const release = {
            id: resultObj.version,
            fileUrl: fileUrl,
            changelog: resultObj.changelog,
            date: Date.now(),
          }
          this.releasesDB.put(`releases/${resultObj.platform}/${version}`, release).subscribe()
          this.releasesDB.put(`releases/${resultObj.platform}/latestVersion`, resultObj.version).subscribe()
          this.isUploading = false
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
        this.fileUploader.deleteFile(result)
      }
    ).catch((error) => {
      console.log("error: " + error)
    })
    this.isUploading = false
  }

}
