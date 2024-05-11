import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrEmpty } from 'src/app/others/utils';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() comment: any
  author: any
  isLoading = false
  readonly placeholderImg: string = 'assets/images/placeholder_img.svg'
  currentUid: any
  upvoted!: boolean
  downvoted!: boolean

  editModeEnabled = false
  editedMessage = ''
  isCommentDeleted = false

  defaultUser = {
    data: {
      username: 'deleted'
    },
    images: {
      avatarUrl: 'https://cdn-icons-png.flaticon.com/512/21/21104.png'
    }
  }

  constructor(private auth: AuthService, private commentService: CommentService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute) { }

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

  private dd(obj: any) {
    alert('obj: ' + JSON.stringify(obj))
  }

  getComment() {
    const id = this.route.snapshot.paramMap.get('id') ?? ''
    this.commentService.getObjectById(id).subscribe(
      (data) => {
        this.comment = data ?? this.router.navigateByUrl('/404')
        this.initData()
        this.isLoading = false
      }
    )
  }

  getUser() {
    this.auth.getDbUserById(this.comment.authorId).then(
      (result) => {
        isNullOrEmpty(result) ? this.author = this.defaultUser : this.author = result
      },
      () => {
        this.author = this.defaultUser
      }
    )
  }

  initData() {
    this.getUser()
    this.currentUid = this.auth.currentUser?.uid
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
      this.update()
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
      this.update()
    }
  }

  private update() {
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

    this.commentService.updateObject(this.comment).subscribe()
  }

  private authDialog() {
    if (!this.auth.isAuthenticated()) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'Oops', text: 'You must be authenticated to perform this action. Do you want to sign in?' }
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigateByUrl('/login')
        }
      })
      return false
    } else {
      return true
    }
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