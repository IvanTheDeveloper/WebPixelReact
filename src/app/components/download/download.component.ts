import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { VersionsTableComponent } from '../versions-table/versions-table.component';
import { RealtimeDatabaseService } from 'src/app/services/realtime-database.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent {
  protected language = ''
  protected architecture = ''
  protected currentPlatform = ''
  protected selectedPlatform = ''
  protected version: string | null = null
  protected latestVersion = ''
  protected selectedTabIndex: number = 0
  protected url = ''

  constructor(public dialog: MatDialog, private dataService: RealtimeDatabaseService) { }

  ngOnInit() {
    this.language = navigator.language
    this.architecture = navigator.userAgent.includes("x64") ? 'x64' : 'x32'
    const platform = navigator.platform.toLowerCase()
    if (platform == 'win32') {
      this.currentPlatform = 'Windows'
      this.selectedTabIndex = 0
    } else if (platform == 'macintel') {
      this.currentPlatform = 'MacOS'
      this.selectedTabIndex = 1
    } else if (platform == 'linux x86_64') {
      this.currentPlatform = 'Linux'
      this.selectedTabIndex = 2
    }
    this.selectedPlatform = this.currentPlatform

    this.getLatestVersion()
  }

  tabChanged(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index
    if (event.index == 0) {
      this.selectedPlatform = 'Windows'
    } else if (event.index == 1) {
      this.selectedPlatform = 'MacOS'
    } else if (event.index == 2) {
      this.selectedPlatform = 'Linux'
    }
    this.getLatestVersion()
  }

  getLatestVersion(): void {
    this.dataService.get(`releases/${this.selectedPlatform.toLowerCase()}`).subscribe(
      (response) => {
        if (response) {
          this.latestVersion = response.latestVersion
          this.version = this.latestVersion + ' (latest)'
          this.url = response[this.latestVersion]?.fileUrl
        } else {
          this.version = 'not available'
        }
      },
      (error) => {
        alert(error)
        console.log(error)
      }
    )
  }

  dialogTable() {
    const dialogRef = this.dialog.open(VersionsTableComponent, {
      data: { platform: this.selectedPlatform, architecture: this.architecture, language: this.language }
    })
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.url = result.fileUrl
          this.version = result.id
            (this.latestVersion == this.version ? this.version += ' (latest)' : '')
        }
      }
    )
  }

}