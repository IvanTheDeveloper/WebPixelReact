import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { routingTable } from 'src/app/app-routing.module';
import { pwdRegExp } from 'src/app/others/password-rules';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  routes = routingTable
  goTo?: string
  isLoading: boolean = false
  hidePassword: boolean = true
  hideConfirmPassword: boolean = true
  downloadCredentials = false
  fieldForm: FormGroup

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.fieldForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(pwdRegExp)]),
      confirmPassword: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
    }, {
      validators: this.validate('password', 'confirmPassword')
    })
  }

  ngOnInit(): void {
    const queryParams = new URLSearchParams(window.location.search)
    const param = queryParams.get('goto')
    this.goTo = param && Object.values(this.routes).includes(param) ? param : this.routes.home
  }

  get email() {
    return this.fieldForm.get('email')
  }

  get password() {
    return this.fieldForm.get('password')
  }

  get confirmPassword() {
    return this.fieldForm.get('confirmPassword')
  }

  get username() {
    return this.fieldForm.get('username')
  }

  doPasswordsMatch() {
    const password = this.fieldForm.get('password')
    const confirmPassword = this.fieldForm.get('confirmPassword')
    return confirmPassword && (password === confirmPassword)
  }

  validate(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName)
      const matchingControl = abstractControl.get(matchingControlName)

      if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
        return null
      }

      if (control!.value !== matchingControl!.value) {
        const error = { confirmedValidator: 'Passwords do not match.' }
        matchingControl!.setErrors(error)
        return error
      } else {
        matchingControl!.setErrors(null)
        return null
      }
    }
  }

  genPwd() {
    const numbers = "0123456789";

    const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const specialCharacters = "@#$%&¿?¡!*^-_";
    const regexUpper = /[A-Z]{1, 7}$/g;
    const regexLower = /[a-z]{1, 7}$/g;
    const regexDigit = /[0-9]{1, 7}$/g;
    const regexSplCharacters = /[@#$%&¿?¡!*^-_]{1, 7}$/g;
    const pwndMinLength = 8;
    const pwndMaxLength = 30;
    let generatedPassword = "";

    const characterList = numbers + upperCaseLetters + lowerCaseLetters + specialCharacters;
    const characterListLength = characterList.length;

    const generateRandom = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;

    if (!regexLower.test(generatedPassword)) {
      const characterIndex = Math.round(generateRandom() * (lowerCaseLetters.length - 1));
      generatedPassword = generatedPassword + lowerCaseLetters.charAt(characterIndex);
    }
    if (!regexUpper.test(generatedPassword)) {
      const characterIndex = Math.round(generateRandom() * (upperCaseLetters.length - 1));
      generatedPassword = generatedPassword + upperCaseLetters.charAt(characterIndex);
    }
    if (!regexDigit.test(generatedPassword)) {
      const characterIndex = Math.round(generateRandom() * (numbers.length - 1));
      generatedPassword = generatedPassword + numbers.charAt(characterIndex);
    }
    if (!regexSplCharacters.test(generatedPassword)) {
      const characterIndex = Math.round(generateRandom() * (specialCharacters.length - 1));
      generatedPassword = generatedPassword + specialCharacters.charAt(characterIndex);
    }

    for (let i = 0; i < Math.round(generateRandom() * (pwndMaxLength - pwndMinLength)) + pwndMinLength; i++) {
      const characterIndex = Math.round(generateRandom() * (characterListLength - 1));
      generatedPassword = generatedPassword + characterList.charAt(characterIndex);
    }

    this.fieldForm.get('password')?.setValue(generatedPassword)
    navigator.clipboard.writeText(generatedPassword)
    this.openSnackBar('Password copied to clipboard!')
  }

  downloadTxtFile() {
    const text = `[InternetShortcut]
    URL=${location.origin}/login?email=${this.email?.value}&password=${this.password?.value}`;
    const fileName = 'credentials.url';
    const blob = new Blob([text], { type: 'application/internet-shortcut' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }


  onSubmit(): void {
    if (this.fieldForm.valid) {
      this.isLoading = true
      this.auth.register(this.email?.value, this.password?.value, this.username?.value).then(
        () => {
          this.LoginActions()
        }
      ).catch(
        error => {
          this.isLoading = false
          const errorMessage = (error.code == 'auth/email-already-in-use' ? 'There is already an account with that email' : 'Unknown: ' + error)
          this.openSnackBar("Register error: " + errorMessage)
        }
      )
    }
  }

  async LoginActions() {
    if (this.downloadCredentials) this.downloadTxtFile();
    await new Promise(f => setTimeout(f, 1000))
    this.router.navigateByUrl(`/${this.goTo}`)
    this.openSnackBar('Welcome ' + this.auth.currentUser?.displayName + '!')
    this.isLoading = false
  }

  openSnackBar(text: string) {
    this.snackBar.open(text, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

}