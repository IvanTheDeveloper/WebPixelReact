import { Component } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { routingTable } from 'src/app/app-routing.module';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss']
})
export class CommentBoxComponent {
  objectList: any[] = []
  progressSpinner = true
  formController!: FormGroup
  selected = false
  sortOption = 'votes'

  constructor(private dataService: CommentService, private auth: AuthService, public dialog: MatDialog, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.getComments()
    this.initData()
    this.formController = this.formBuilder.group({
      message: ['', [Validators.required, Validators.maxLength(1000)]],
    })
  }

  async initData() {
    await new Promise(f => setTimeout(f, 1000))
    this.progressSpinner = false
  }

  getComments() {
    this.dataService.getObjectList().subscribe(
      (response) => {
        let list: any[] = Object.values(response)
        this.objectList = this.sortComments(list)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  sortComments(comments: any[]): any[] {
    if (this.sortOption == 'date') {
      return comments.sort((a, b) => b.createdAt - a.createdAt)
    } else if (this.sortOption == 'votes') {
      return comments.sort((a, b) => b.votes - a.votes)
    } else {
      return comments
    }
  }

  changeSortOption(option: string) {
    this.sortOption = option
    this.objectList = this.sortComments(this.objectList)
  }

  get message() {
    return this.formController.get('message')
  }

  onSubmit() {
    if (!this.auth.isAuthenticated()) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Oops', text: 'You must be authenticated to perform this action. Do you want to sign in?' }
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate([routingTable.login])
        }
      })
    } else if (this.formController.valid) {
      const comment = {
        id: null,
        authorId: this.auth.currentUser?.uid,
        message: this.message?.value,
        votes: 0,
        uidsUpvoted: [''],
        uidsDownvoted: [''],
        reports: 0,
        uidsReported: [''],
        isEdited: false,
        editedAt: null,
        createdAt: Date.now(),
      }
      this.dataService.createObject(comment).subscribe(
        () => {
          this.getComments()
          this.formController.reset()
        },
        (error) => {
          alert(error)
        }
      )
    }
  }


}