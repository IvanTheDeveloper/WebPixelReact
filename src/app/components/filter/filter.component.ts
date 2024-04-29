import { DataSource } from '@angular/cdk/collections';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  [key: string]: any  //this makes variables accessible by string, example: const field = this.id; this[field] == this.id;

  //data
  public dataList: any[] = []
  public filteredList: any[] = []

  //fields tracked by the filter
  private allFields = ['id', 'name', 'enabled']
  protected displayedFields = ['name']  //this.allFields
  protected id = ''
  protected name = ''
  protected enabled = ''

  constructor() { }

  public applyFilter() {
    this.filteredList = this.dataList.filter(item => {
      return this.allFields.every(field => {
        const value = item[field].toLowerCase()
        return value.includes(this[field].toLowerCase())
      })
    })
  }

  public resetFields() {
    this.allFields.forEach(field => {
      this[field] = ''
    })
    this.filteredList = this.dataList
  }

}