import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'; // Import MatSort
import { MatTableDataSource } from '@angular/material/table';
import { RealtimeDatabaseService } from 'src/app/services/realtime-database.service';

@Component({
  selector: 'app-versions-table',
  templateUrl: './versions-table.component.html',
  styleUrls: ['./versions-table.component.scss']
})
export class VersionsTableComponent {
  displayedColumns: string[] = ['id', 'changelog', 'date']
  dataSource: MatTableDataSource<any>
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(private dataService: RealtimeDatabaseService, public dialog: MatDialog, public dialogRef: MatDialogRef<VersionsTableComponent>, @Inject(MAT_DIALOG_DATA) public data: { platform: string }) {
    this.dataSource = new MatTableDataSource<any>()
  }

  ngOnInit(): void {
    this.getObjectList()
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  getObjectList(): void {
    this.dataService.get(`releases/${this.data.platform.toLowerCase()}`).subscribe(
      (response) => {
        if (response) {
          let list: any[] = Object.values(response)
          list.pop() //remove latest version parameter
          this.dataSource.data = list
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  onSubmit(obj: any) {
    this.dialogRef.close(obj)
  }

}
