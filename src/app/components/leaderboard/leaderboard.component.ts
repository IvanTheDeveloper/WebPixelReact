import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder } from '@angular/forms';
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
  sortOption = 'levelsUnlocked'
  uid: any

  constructor(private dataService: LeaderboardService, private auth: AuthService, public dialog: MatDialog, private formBuilder: FormBuilder) { }

  async ngOnInit() {
    await new Promise(f => setTimeout(f, 500))
    this.getData()
  }

  async getData() {
    this.uid = this.auth.currentUser?.uid
    await new Promise(f => setTimeout(f, 500))
    this.dataService.getObjectList().subscribe(
      (response) => {
        let list: any[] = []
        Object.entries(response).forEach(([parentFolderName, subFolder]) => {
          if (typeof subFolder == 'object' && subFolder !== null) {
            Object.values(subFolder).forEach((item: any) => {
              item.authorId = parentFolderName
              if (location.pathname.includes('my-games')) {
                if (parentFolderName == this.uid) {
                  list.push(item)
                }
              } else {
                list.push(item)
              }
            })
          }
        })
        this.objectList = list
      },
      (error) => {
        console.log(error)
      }
    )
    this.progressSpinner = false
  }

  private sortData(data: any[]): any[] {
    if (this.sortOption == 'deathCount') {
      return data.sort((a, b) => a.deathCount - b.deathCount)
    } else if (this.sortOption == 'levelsUnlocked') {
      return data.sort((a, b) => b.levelsUnlocked - a.levelsUnlocked)
    } else {
      return data
    }
  }

  changeSortOption(option: string) {
    this.sortOption = option
    this.objectList = this.sortData(this.objectList)
  }

}