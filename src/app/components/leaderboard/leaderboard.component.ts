import { Component } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { routingTable } from 'src/app/app-routing.module';
import { LeaderboardService } from 'src/app/services/leaderboard.service';
import { dump } from 'src/app/others/utils';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {
  objectList: any[] = []
  progressSpinner = true
  selected = false
  sortOption = 'votes'

  constructor(private dataService: LeaderboardService, private auth: AuthService, public dialog: MatDialog, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initData()
    this.getData()
  }

  async initData() {
    await new Promise(f => setTimeout(f, 1000))
    this.progressSpinner = false
  }

  getData() {
    this.dataService.getObjectList().subscribe(
      (response) => {
        let list: any[] = []
        Object.entries(response).forEach(([parentFolderName, subFolder]) => {
          if (typeof subFolder === 'object' && subFolder !== null) {
            Object.values(subFolder).forEach((item: any) => {
              item.authorId = parentFolderName
              list.push(item)
            })
          }
        })
        this.objectList = list
      },
      (error) => {
        console.log(error)
      }
    )
  }

  private sortData(data: any[]): any[] {
    if (this.sortOption == 'date') {
      return data.sort((a, b) => b.createdAt - a.createdAt)
    } else if (this.sortOption == 'votes') {
      return data.sort((a, b) => b.votes - a.votes)
    } else {
      return data
    }
  }

  changeSortOption(option: string) {
    this.sortOption = option
    this.objectList = this.sortData(this.objectList)
  }

}