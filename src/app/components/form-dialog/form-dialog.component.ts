import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dd, isNullOrEmpty } from 'src/app/others/utils';
import { RealtimeDatabaseService } from 'src/app/services/realtime-database.service';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent {
  checkoutForm: FormGroup;

  latestVersion = 1

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { info: any }, private firebaseDB: RealtimeDatabaseService) {
    this.checkoutForm = this.formBuilder.group({
      platform: [this.data.info.platform, [Validators.required]],
      version: [this.data.info.version, [Validators.required, Validators.min(this.latestVersion)]],
      changelog: [this.data.info.changelog, [Validators.required]],
      file: [null]
    })
  }

  getLatestVersion() {
    const selectedPlatform = this.platform?.value
    if (!isNullOrEmpty(selectedPlatform)) {
      this.firebaseDB.get(`releases/${selectedPlatform}/latestVersion`).subscribe(
        (result) => {
          this.latestVersion = result
          this.version?.setValue(this.latestVersion)
        })
    }
  }

  get platform() {
    return this.checkoutForm.get('platform')
  }

  get version() {
    return this.checkoutForm.get('version')
  }

  get changelog() {
    return this.checkoutForm.get('changelog')
  }

  get file() {
    return this.checkoutForm.get('file')
  }

  onSubmit(): void {
    const obj: any = {
      version: this.version?.value,
      platform: this.platform?.value,
      changelog: this.changelog?.value,
      file: this.file?.value
    }
    this.checkoutForm.reset()
    this.dialogRef.close(obj)
  }

  cancelClick(): void {
    this.dialogRef.close(false)
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    this.checkoutForm.patchValue({ file: file })
  }


}