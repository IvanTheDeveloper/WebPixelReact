import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { routingTable } from 'src/app/app-routing.module';
import { pwdRegExp } from 'src/app/others/password-rules';
import { delay } from 'src/app/others/utils';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  routes = routingTable
  isLoading: boolean = false
  hidePassword: boolean = true
  _goTo: string
  fieldForm: FormGroup
  qrCode: string | null = null
  time = 0

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.fieldForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(pwdRegExp)]]
    })
    const queryParams = new URLSearchParams(window.location.search)
    this._goTo = decodeURIComponent(queryParams.get('goto') ?? this.routes.home)
    this.email?.setValue(decodeURIComponent(queryParams.get('email') ?? ''))
    this.password?.setValue(decodeURIComponent(queryParams.get('password') ?? ''))
  }

  get email() {
    return this.fieldForm.get('email')
  }

  get password() {
    return this.fieldForm.get('password')
  }

  onSubmit() {
    if (this.fieldForm.valid) {
      this.isLoading = true
      const email = this.fieldForm.get('email')?.value
      const password = this.fieldForm.get('password')?.value
      this.auth.login(email, password).then(
        () => {
          this.loginActions()
        }
      ).catch(
        error => {
          this.isLoading = false
          let errorMessage = error
          if (error.code == 'auth/invalid-credential') {
            errorMessage = 'Invalid credentials'
          } else if (error.code == 'auth/too-many-requests') {
            errorMessage = 'Too many attempts, reset your password or try again later'
          }
          this.openSnackBar("Error signing in: " + errorMessage)
        }
      )
    }
  }

  loginGoogle() {
    this.auth.signinWithGoogle().then(
      () => {
        this.loginActions()
      }
    ).catch(
      error => {
        const justCanceled = error.code == 'auth/cancelled-popup-request' || error.code == 'auth/popup-closed-by-user'
        justCanceled ? '' : this.openSnackBar('Error signing in with google: ' + error)
      }
    )
  }

  private async loginActions() {
    await new Promise(f => setTimeout(f, 1000))
    this.router.navigateByUrl(`/${this._goTo}`)
    this.openSnackBar(`Welcome ${this.auth.currentUser?.displayName} !`)
    this.isLoading = false
  }

  private openSnackBar(text: string) {
    this.snackBar.open(text, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

  async loginQr() {
    this.qrCode = await this.auth.loginWithQrInitial()
    this.timeout()
  }

  async timeout() {
    for (this.time = 60; this.time > 0; this.time--) {
      await delay(1000)
      this.auth.loginWithQrComplete().then(
        () => {
          this.loginActions()
        }
      ).catch((error) => error)
    }
    this.qrCode = null
    this.openSnackBar('QR code operation timed out')
  }

}