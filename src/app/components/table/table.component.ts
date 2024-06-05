import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { dump } from 'src/app/others/utils';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  columns: string[] = ['select', 'id', 'username', 'email', 'password', 'isAdmin', 'isMod', 'lastLoginAt', 'createdAt']
  displayedColumns: string[] = this.columns.slice()
  dataSource!: MatTableDataSource<any>
  selection = new SelectionModel<any>(true, [])

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private auth: AuthService) {
    this.auth.getDbAllUsers().then(result => {
      this.dataSource = new MatTableDataSource(result)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  private isVisible(column: string) {
    return this.displayedColumns.includes(column)
  }

  private toggleColumn(column: string) {
    console.log(this.displayedColumns.includes(column))
    if (this.displayedColumns.includes(column)) {
      const index = this.displayedColumns.indexOf(column);
      if (index != -1) {
        this.displayedColumns.splice(index, 1);
      }
    } else {
      this.displayedColumns.push(column);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource?.data.length
    return numSelected == numRows
  }

  toggleAllRows() {
    this.isAllSelected() ? this.selection.clear() : this.selection.select(...this.dataSource.data)
  }

  deleteSelected(): void {
    const length = this.selection.selected.length
    if (length > 0) {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: { title: 'users', quantity: length }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dataSource.data = this.dataSource.data.filter(item => !this.selection.selected.includes(item))
          this.selection.clear()
          this.showSnackbar('Successfully deleted ' + length + ' users')
        }
      })
    } else {
      this.showSnackbar('No users selected')
    }
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    })
  }

}