import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { routingTable } from 'src/app/app-routing.module';
import { dump } from 'src/app/others/utils';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent {
  success: any = null

  constructor(private auth: AuthService, private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code') ?? ''
    this.auth.loginWithQrConfirm(code).then(() => {
      this.success = true
      this.openSnackBar('Operation completed')
    },
      (error) => {
        this.success = false
        this.openSnackBar(error)
      })
  }

  private openSnackBar(text: string) {
    this.snackBar.open(text, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

}
