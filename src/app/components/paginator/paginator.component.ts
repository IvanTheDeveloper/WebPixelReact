import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  [key: string]: any  //this makes variables accessible by string, example: const field = this.id; this[field] == this.id;

  //data
  dataList: any[] = []
  paginatedList: any[] = []

  //dynamic settings
  pageIndex: number = 0
  pageSize: number = 4
  pageSizeOptions: number[] = [1, 4, 8, 20]

  constructor() { }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.paginateList()
  }

  paginateList(): void {
    const startIndex = this.pageIndex * this.pageSize
    this.paginatedList = this.dataList.slice(startIndex, startIndex + this.pageSize)
  }

}