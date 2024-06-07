import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dump, isNullOrEmpty } from 'src/app/others/utils';
import { RealtimeDatabaseService } from 'src/app/services/realtime-database.service';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent {
  checkoutForm: FormGroup
  latestVersion = 1

  onFileSelect(event: any): void {
    const file = event.target.files[0]
    this.checkoutForm.patchValue({ file: file })
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const droppedFile = event.dataTransfer?.files[0];
    if (droppedFile) {
      this.checkoutForm.patchValue({ file: droppedFile })
    }
    this.removeDragData(event);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.add('dragover');
  }

  onDragLeave(event: DragEvent): void {
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.remove('dragover');
  }

  removeDragData(event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.clearData();
    }
  }

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { info: any }, private firebaseDB: RealtimeDatabaseService) {
    this.checkoutForm = this.formBuilder.group({
      platform: [this.data.info.platform, [Validators.required]],
      architecture: [this.data.info.architecture, [Validators.required]],
      language: [this.data.info.language, [Validators.required]],
      version: [this.data.info.version, [Validators.required, Validators.min(this.latestVersion)]],
      changelog: [this.data.info.changelog, [Validators.required]],
      file: [null, [Validators.required]]
    })
    this.architecture?.setValue('x64')
    this.language?.setValue('en-us')
  }

  getLatestVersion() {
    const selectedPlatform = this.platform?.value
    if (!isNullOrEmpty(selectedPlatform)) {
      this.firebaseDB.get(`releases/${selectedPlatform}/latestVersion`).subscribe(
        (result) => {
          result = result ? result + 0.01 : 1;
          result = parseFloat(result.toFixed(2))
          this.latestVersion = result
          this.version?.setValue(this.latestVersion)
        })
    }
  }

  get platform() {
    return this.checkoutForm.get('platform')
  }

  get architecture() {
    return this.checkoutForm.get('architecture')
  }

  get language() {
    return this.checkoutForm.get('language')
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
      architecture: this.architecture?.value,
      language: this.language?.value,
      changelog: this.changelog?.value,
      file: this.file?.value
    }
    this.checkoutForm.reset()
    this.dialogRef.close(obj)
  }

  cancelClick(): void {
    this.dialogRef.close(false)
  }

}