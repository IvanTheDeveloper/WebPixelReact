import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { routingTable } from 'src/app/app-routing.module';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  routes = routingTable
  fieldForm: FormGroup

  recipient: string = 'ivan.v.h.2004@gmail.com';

  constructor(private emailService: EmailService, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.fieldForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]]
    })
  }

  get email() {
    return this.fieldForm.get('email')
  }

  get subject() {
    return this.fieldForm.get('subject')
  }

  get message() {
    return this.fieldForm.get('message')
  }

  sendEmail() {
    this.emailService.sendEmail(this.recipient, this.subject?.value, this.message?.value, this.email?.value).subscribe()
    this.showSnackbar('Correo enviado exitosamente');
    this.fieldForm.reset()
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    })
  }

}