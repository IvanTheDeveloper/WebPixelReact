import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrEmpty } from 'src/app/others/utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { routingTable } from 'src/app/app-routing.module';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  readonly placeholderImg: string = 'assets/images/placeholder_img.svg'
  @Input() comment: any
  author: any

  isModOrAdmin = false
  isLoading = false
  isCommentDeleted = false
  editModeEnabled = false
  editedMessage = ''

  currentUid: string | null = null
  upvoted = false
  downvoted = false

  constructor(private auth: AuthService, private commentService: CommentService, private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (isNullOrEmpty(this.comment)) {
      this.wait()
    } else {
      this.initData()
    }
  }

  async wait() {
    this.isLoading = true
    await new Promise(f => setTimeout(f, 1000))
    this.auth.getDbCurrentUser().then(() => {
      this.getComment()
    })
  }

  getComment() {
    const id = this.route.snapshot.paramMap.get('id') ?? ''
    this.commentService.getObjectById(id).subscribe(
      (data) => {
        this.comment = data ?? this.router.navigate([routingTable.notFound])
        this.initData()
        this.isLoading = false
      }
    )
  }

  isDetailedView() {
    return location.pathname.indexOf('/comment/') != -1
  }

  getUser() {
    this.auth.getDbUserById(this.comment.authorId).then((result) => this.author = result).catch((error) => error) //if error simply user deleted
  }

  initData() {
    this.getUser()
    this.auth.getHighestRole().then(result => {
      this.isModOrAdmin = (result == 'admin' || result == 'mod')
    })
    this.currentUid = this.auth.currentUser?.uid ?? null
    this.upvoted = this.comment.uidsUpvoted.includes(this.currentUid)
    this.downvoted = this.comment.uidsDownvoted.includes(this.currentUid)
    this.editedMessage = this.comment.message
  }

  edit() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Edit comment', text: 'Are you sure? This will flag your comment as edited.' }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editModeEnabled = false
        this.comment.message = this.editedMessage
        this.comment.isEdited = true
        this.comment.editedAt = Date.now()
        this.update()
        this.openSnackBar('Comment edited successfully')
      }
    })
  }

  cancel() {
    this.editModeEnabled = false
    this.editedMessage = this.comment.message
  }

  remove() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Delete comment', text: 'Are you sure? This action is permanent.' }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commentService.deleteObject(this.comment).subscribe()
        this.isCommentDeleted = true
        this.openSnackBar('Comment removed successfully')
      }
    })
  }

  isAuthor() {
    return this.comment.authorId == this.currentUid
  }

  upvote() {
    if (this.authDialog()) {
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
      this.listUid()
    }
  }

  downvote() {
    if (this.authDialog()) {

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
      this.listUid()
    }
  }

  private listUid() {
    if (this.upvoted) {
      this.comment.uidsUpvoted.push(this.currentUid)
    } else {
      const index = this.comment.uidsUpvoted.indexOf(this.currentUid)
      if (index != -1) {
        this.comment.uidsUpvoted.splice(index, 1)
      }
    }

    if (this.downvoted) {
      this.comment.uidsDownvoted.push(this.currentUid)
    } else {
      const index = this.comment.uidsDownvoted.indexOf(this.currentUid)
      if (index != -1) {
        this.comment.uidsDownvoted.splice(index, 1)
      }
    }

    this.update()
  }

  report() {
    if (this.authDialog()) {
      if (!this.comment.uidsReported.includes(this.currentUid)) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { title: 'Report comment', text: 'Do you want to flag this comment as inappropiate content?' }
        })
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.comment.uidsReported.push(this.currentUid)
            this.comment.reports++
            this.update()
            this.openSnackBar('Comment reported')
          }
        })
      } else {
        this.openSnackBar('You have already reported that comment')
      }
    }
  }

  private update() {
    this.commentService.updateObject(this.comment).subscribe()
  }

  private authDialog() {
    if (!this.auth.isAuthenticated()) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Oops', text: 'You must be authenticated to perform this action. Do you want to sign in?' }
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate([routingTable.login])
        }
      })
      return false
    } else {
      return true
    }
  }

  openSnackBar(text: string) {
    this.snackBar.open(text, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  share() {
    const urlToShare = location.origin + '/comment/' + this.comment.id
    const navigator: any = window.navigator;

    if (navigator.share) {
      // If Web Share API is supported, use it to share
      navigator.share({
        title: 'Game Review',
        text: 'Check out this comment!',
        url: urlToShare
      }).catch((error: any) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      const dummyInput = document.createElement('input');
      document.body.appendChild(dummyInput);
      dummyInput.value = urlToShare;
      dummyInput.select();
      document.execCommand('copy');
      document.body.removeChild(dummyInput);
    }
  }

}