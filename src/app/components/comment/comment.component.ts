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
  user: any
  readonly placeholderImg: string = 'assets/images/placeholder_img.svg'
  upvoted!: boolean
  downvoted!: boolean

  editMode = false
  editedMessage = ''
  deleted = false
  uid: any = undefined

  defaultUser = {
    data: {
      username: 'user'
    },
    images: {
      avatarUrl: 'https://cdn-icons-png.flaticon.com/512/21/21104.png'
    }
  }

  defaultComment = {
    id: null,
    authorId: '',
    message: '',
    votes: 0,
    usersUpvoted: [''],
    usersDownvoted: [''],
    isEdited: false,
    editedAt: null,
    createdAt: Date.now(),
  }

  constructor(private auth: AuthService, private commentService: CommentService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    isNullOrEmpty(this.comment) ? this.comment = this.defaultComment : ''
    isNullOrEmpty(this.user) ? this.user = this.defaultUser : ''
  }

  ngOnInit() {
    this.uid = this.auth.currentUser?.uid
    isNullOrEmpty(this.comment) ? this.getComment() : this.initData()
  }

  getComment() {
    const id = this.route.snapshot.paramMap.get('id') ?? ''
    this.commentService.getObjectById(id).subscribe(data => {
      alert(JSON.stringify(data))
      this.comment = data
      this.initData()
    })
  }

  getUser() {
    this.user = this.auth.getDbUserById(this.comment.userId)
  }

  initData() {
    this.upvoted = this.comment.usersUpvoted.includes(this.uid)
    this.downvoted = this.comment.usersDownvoted.includes(this.uid)
    this.editedMessage = this.comment.message
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
      })
        .then(() => console.log('Successful share'))
        .catch((error: any) => console.log('Error sharing:', error));
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

  remove() {
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
    if (this.authDialog())

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
    if (this.authDialog())

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
    if (!isNullOrEmpty(this.comment))

      if (this.upvoted) {
        this.comment.usersUpvoted.push(this.auth.currentUser?.uid)
      } else {
        const index = this.comment.usersUpvoted.indexOf(this.auth.currentUser?.uid)
        if (index != -1) {
          this.comment.usersUpvoted.splice(index, 1)
        }
      }

    if (this.downvoted) {
      this.comment.usersDownvoted.push(this.auth.currentUser?.uid)
    } else {
      const index = this.comment.usersDownvoted.indexOf(this.auth.currentUser?.uid)
      if (index != -1) {
        this.comment.usersDownvoted.splice(index, 1)
      }
    }

    this.commentService.updateObject(this.comment).subscribe()
  }

  authDialog() {
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

  isAuthor() {
    return this.comment.authorId == this.auth.currentUser?.uid
  }

}