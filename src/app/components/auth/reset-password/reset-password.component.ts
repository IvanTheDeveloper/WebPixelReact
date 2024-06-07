import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { routingTable } from 'src/app/app-routing.module';
import { pwdRegExp } from 'src/app/others/password-rules';
import { dump } from 'src/app/others/utils';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  routes = routingTable
  isLoading: boolean = false
  hidePassword: boolean = true
  step = 0
  time = 0

  email: FormControl
  code: FormControl
  password: FormControl

  constructor(private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.email = new FormControl('', [Validators.required, Validators.email])
    this.code = new FormControl('', [Validators.required])
    this.password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(pwdRegExp)])
  }

  async timeout() {
    for (this.time = 10; this.time > 0; this.time--) {
      await new Promise(f => setTimeout(f, 1000))
    }
  }

  onSubmitEmail() {
    this.timeout()
    if (this.email.valid) {
      this.auth.resetPasswordSend(this.email.value).then(
        () => {
          this.step++
          this.openSnackBar('Email sent, check your inbox!')
          this.timeout()
        },
        (error) => {
          dump(error)
        }
      )
    }
  }

  onSubmitCode() {
    if (this.code.valid) {
      this.code.setValue(this.extractOobCode(this.code.value))
      dump(this.code.value + ' a')
      this.auth.resetPasswordCheck(this.code.value, this.password.value).then(
        () => { dump('fatal error') },
        (error) => {
          if (error.code != 'auth/invalid-action-code' && error.code == 'auth/weak-password') {
            this.step++
          } else {
            this.openSnackBar('Wrong code, try again')
          }
        }
      )
    }
  }

  private extractOobCode(url: string): string {
    try {
      const parsedUrl = new URL(url);
      const oobCode = parsedUrl.searchParams.get('oobCode');
      return oobCode ? oobCode : url;
    } catch (error) {
      return url;
    }
  }

  onSubmitPassword() {
    if (this.code.valid) {
      this.auth.resetPasswordCheck(this.code.value, this.password.value).then(
        () => {
          this.openSnackBar('Password has been reset! Welcome')
          this.auth.login(this.email.value, this.password.value)
          this.router.navigate([routingTable.home])
        },
        (error) => {
          dump(error)
        }
      )
    }
  }

  openSnackBar(text: string) {
    this.snackBar.open(text, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

}