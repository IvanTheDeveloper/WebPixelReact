import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() comment: any
  user: any
  placeholderImg: string = 'assets/images/placeholder_img.svg'
  upvoted!: boolean
  downvoted!: boolean

  editMode = false
  editedMessage = ''
  deleted = false

  default = {
    data: {
      username: 'carlitos'
    },
    images: {
      avatarUrl: 'https://cdn-icons-png.flaticon.com/512/21/21104.png'
    }
  }

  constructor(private auth: AuthService, private commentService: CommentService, public dialog: MatDialog,) {
    this.user = this.default
  }

  ngOnInit() {
    this.upvoted = this.comment.usersUpvoted.includes(this.auth.getUid())
    this.downvoted = this.comment.usersDownvoted.includes(this.auth.getUid())
    this.editedMessage = this.comment.message
    this.user = this.auth.getUser(this.comment.userId)
  }

  isAuthor() {
    return this.comment.authorId == this.auth.getUid()
  }

  edit() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Edit comment', text: 'Are you sure? This will flag your comment as edited.' }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editMode = false
        this.comment.message = this.editedMessage
        this.comment.isEdited = true
        this.comment.editedAt = Date.now()
        this.update()
      }
    })
  }

  cancel() {
    this.editMode = false
    this.editedMessage = this.comment.message
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Delete comment', text: 'Are you sure? This action is permanent.' }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commentService.deleteObject(this.comment).subscribe()
        this.deleted = true
      }
    })
  }

  upvote() {
    if (!this.upvoted) {
      this.comment.votes++
      this.upvoted = true
      if (this.downvoted) {
        this.comment.votes++
        this.downvoted = false
      }
    } else {
      this.comment.votes--
      this.upvoted = false
    }
    this.update()
  }

  downvote() {
    if (!this.downvoted) {
      this.comment.votes--
      this.downvoted = true
      if (this.upvoted) {
        this.comment.votes--
        this.upvoted = false
      }
    } else {
      this.comment.votes++
      this.downvoted = false
    }
    this.update()
  }

  update() {
    const uid = this.auth.getUid()

    if (this.upvoted) {
      this.comment.usersUpvoted.push(uid)
    } else {
      const index = this.comment.usersUpvoted.indexOf(uid)
      if (index != -1) {
        this.comment.usersUpvoted.splice(index, 1)
      }
    }

    if (this.downvoted) {
      this.comment.usersDownvoted.push(uid)
    } else {
      const index = this.comment.usersDownvoted.indexOf(uid)
      if (index != -1) {
        this.comment.usersDownvoted.splice(index, 1)
      }
    }

    this.commentService.updateObject(this.comment).subscribe()
  }

}