import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { LeaderboardService } from 'src/app/services/leaderboard.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { dump, encryptDecrypt, isNullOrEmpty } from 'src/app/others/utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { routingTable } from 'src/app/app-routing.module';

@Component({
  selector: 'app-published-game',
  templateUrl: './published-game.component.html',
  styleUrls: ['./published-game.component.scss']
})
export class PublishedGameComponent {
  readonly placeholderImg: string = 'assets/images/placeholder_img.svg'
  @Input() data: any
  @Input() position: any = -1
  author: any

  isModOrAdmin = false
  isLoading = false
  isDeleted = false

  currentUid: string | null = null

  constructor(private auth: AuthService, private dataService: LeaderboardService, private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (isNullOrEmpty(this.data)) {
      this.wait()
    } else {
      this.initData()
    }
  }

  async wait() {
    this.isLoading = true
    await new Promise(f => setTimeout(f, 1000))
    this.auth.getDbUser().then(() => {
      this.getGame()
    })
  }

  getGame() {
    const authorId = this.route.snapshot.paramMap.get('authorId') ?? ''
    const name = this.route.snapshot.paramMap.get('name') ?? ''
    this.dataService.getObjectById(authorId + '/' + name).subscribe(
      (data) => {
        this.data = data ?? this.router.navigate([routingTable.notFound])
        this.initData()
        this.isLoading = false
      }
    )
  }

  isDetailedView() {
    return location.pathname.indexOf('/game/') != -1
  }

  getUser() {
    this.data.authorId ??= this.route.snapshot.paramMap.get('authorId') ?? ''
    this.auth.getDbUserById(this.data.authorId).then((result) => this.author = result).catch((error) => error) //if error simply user deleted
  }

  initData() {
    this.getUser()
    this.auth.getHighestRole().then((result) => {
      this.isModOrAdmin = (result == 'admin' || result == 'mod')
    })
    this.currentUid = this.auth.currentUser?.uid ?? null
  }

  remove() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Delete game', text: 'Are you sure? This action is permanent.' }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteObject(this.data).subscribe(() => {
          this.isDeleted = true
          this.openSnackBar('Game removed successfully')
        },
          (error) => {
            this.openSnackBar(error)
          })
      }
    })
  }

  isAuthor() {
    return this.data.authorId == this.currentUid
  }

  openSnackBar(text: string) {
    this.snackBar.open(text, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

  download() {
    // Convertir el objeto a JSON
    const jsonData = JSON.stringify(this.data, null, 2);

    // Encriptar los datos JSON
    const encryptedData = encryptDecrypt(jsonData);

    // Crear un Blob desde los datos encriptados
    const blob = new Blob([encryptedData], { type: 'application/json' });

    // Crear un elemento enlace
    const link = document.createElement('a');

    // Crear una URL para el Blob y establecerla como el atributo href
    const url = window.URL.createObjectURL(blob);
    link.href = url;

    // Establecer el atributo download con un nombre de archivo
    link.download = 'data.json';

    // Añadir el enlace al cuerpo del documento y hacer clic en él para iniciar la descarga
    document.body.appendChild(link);
    link.click();

    // Limpiar y eliminar el enlace
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }


  setPrivate(value: boolean) {
    this.data.isPrivate = value
    this.update()
  }

  private update() {
    this.dataService.updateObject(this.data, this.data.authorId + '/' + this.data.gameName).subscribe()
  }

  share() {
    const urlToShare = location.origin + '/game/' + this.data.authorId + '/' + this.data.gameName
    const navigator: any = window.navigator

    if (navigator.share) {
      // If Web Share API is supported, use it to share
      navigator.share({
        title: 'Game Review',
        text: 'Check out this game!',
        url: urlToShare
      }).catch((error: any) => console.log('Error sharing:', error))
    } else {
      // Fallback for browsers that don't support Web Share API
      const dummyInput = document.createElement('input')
      document.body.appendChild(dummyInput)
      dummyInput.value = urlToShare
      dummyInput.select()
      document.execCommand('copy')
      document.body.removeChild(dummyInput)
    }
  }

}