import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { pwdRegExp } from 'src/app/others/password-rules';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  progressBar: boolean = false
  fieldForm: FormGroup
  hidePassword: boolean = true
  hideConfirmPassword: boolean = true

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {

    this.fieldForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(pwdRegExp)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, {
      validators: this.validate('password', 'confirmPassword')
    })
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
    const text = 'Email: ' + this.email?.getRawValue() + '\n' + 'Password: ' + this.password?.getRawValue() + '\n' + 'Login here: ' + location.origin + '/login'
    const fileName = 'credentials.txt';
    const blob = new Blob([text], { type: 'text/plain' });
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
      const email = this.fieldForm.get('email')?.value;
      const password = this.fieldForm.get('password')?.value;
      this.auth.register(email, password).then(
        () => {
          this.downloadTxtFile()
          this.LoginActions()
        }
      ).catch(
        error => {
          const errorMessage = error.code == 'auth/email-already-in-use' ? 'There is already an account with that email' : 'Unknown'
          this.openSnackBar("Register error: " + errorMessage)
        }
      )
    }
  }

  async LoginActions() {
    this.progressBar = true
    this.auth.updateCookieToken()
    await new Promise(f => setTimeout(f, 1000))
    this.router.navigateByUrl('/home')
    this.openSnackBar('Welcome ' + this.auth.getDisplayName() + '!')
  }

  openSnackBar(text: string) {
    this.snackBar.open(text, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

}