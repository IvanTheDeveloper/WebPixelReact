import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { MyUser } from 'src/app/models/user';

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

  editingElement: any = null
  editingColumn: string | null = null
  editControl = new FormControl()

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
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex)
  }

  startEdit(element: any, column: string) {
    this.editingElement = element
    this.editingColumn = column
    this.editControl.setValue(element[column])
  }

  confirmEdit(element: any, column: string) {
    const newValue = this.editControl.value
    if (element[column] != newValue) {
      element[column] = newValue

      const user = new MyUser()
      user[column] = newValue
      this.auth.updateUser(user)
      this.showSnackbar('Successfully edited user')
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingElement = null
    this.editingColumn = null
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource?.data.length
    return numSelected == numRows
  }

  toggleAllRows() {
    this.isAllSelected() ? this.selection.clear() : this.selection.select(...this.dataSource.data)
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    })
  }

}