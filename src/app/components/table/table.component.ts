import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { GameReleaseService } from 'src/app/services/game-release.service';
import { dump } from 'src/app/others/utils';
import { RealtimeDatabaseService } from 'src/app/services/realtime-database.service';

const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
];

function createNewUser(id: number): any {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))];
  return {
    id: id.toString(),
    name: name,
  };
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit {
  columns: string[] = ['select', 'id', 'name',];
  displayedColumns: string[] = this.columns.slice();
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,
    private snackBar: MatSnackBar,) {
    const users = Array.from({ length: 10 }, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource(users)
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  deleteSelected(): void {
    const length = this.selection.selected.length
    if (length > 0) {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: { title: 'users', quantity: length }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dataSource.data = this.dataSource.data.filter(item => !this.selection.selected.includes(item));
          this.selection.clear();
          this.showSnackbar('Successfully deleted ' + length + ' users')
        }
      })
    } else {
      this.showSnackbar('No users selected')
    }
  }

  showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
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

  isVisible(column: string) {
    return this.displayedColumns.includes(column)
  }

  toggleColumn(column: string) {
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
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}