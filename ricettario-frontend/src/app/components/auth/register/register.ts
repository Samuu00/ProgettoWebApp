import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, Footer],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  userData = {
    username: '',
    email: '',
    password: '',
    confirmPassw: '',
    role: 'STANDARD'
  };

  inlineErrors = {
    username: '',
    email: '',
    password: '',
    confirmPassw: ''
  };

  showPassword = false;
  showConfirmPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  lookRotation = 0;
  isStealingRecipe = false;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isStealingRecipe) {
      this.lookRotation = 0; // Se si nasconde, la testa torna dritta
      return;
    }

    const centerX = window.innerWidth / 2;
    const mouseX = event.clientX;

    const offset = (mouseX - centerX) / centerX;

    this.lookRotation = offset * 20;
  }

  setStealingRecipe(value: boolean) {
    this.isStealingRecipe = value;
  }

  errorMess: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  validateEmailInline() {
    const email = this.userData.email;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      this.inlineErrors.email = "L'email è obbligatoria";
      return;
    }

    if (!emailRegex.test(email)) {
      this.inlineErrors.email = "Inserisci un indirizzo email valido (es. chef@gmail.com)";
      return;
    }

    const allowedDomains = ['gmail.com', 'outlook.it', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
    const domain = email.split('@')[1].toLowerCase();

    if (!allowedDomains.includes(domain)) {
      this.inlineErrors.email = `Il dominio @${domain} non è esistente`;
    } else {
      this.inlineErrors.email = '';
    }
  }

  validatePasswordInline() {
    const password = this.userData.password;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      this.inlineErrors.password = 'La password è obbligatoria';
    } else if (password.length < 8) {
      this.inlineErrors.password = 'Deve essere lunga almeno 8 caratteri';
    } else if (!/[A-Z]/.test(password)) {
      this.inlineErrors.password = 'Aggiungi almeno una lettera maiuscola';
    } else if (!/\d/.test(password)) {
      this.inlineErrors.password = 'Aggiungi almeno un numero';
    } else if (!/[@$!%*?&]/.test(password)) {
      this.inlineErrors.password = 'Aggiungi un segno speciale (es. @, $, !, %, *, ?, &)';
    } else if (!passwordRegex.test(password)) {
      this.inlineErrors.password = 'Formato non valido';
    } else {
      this.inlineErrors.password = '';
    }

    this.validateConfirmPasswordInline();
  }

  validateConfirmPasswordInline() {
    if (this.userData.password !== this.userData.confirmPassw) {
      this.inlineErrors.confirmPassw = 'Le password non corrispondono';
    } else {
      this.inlineErrors.confirmPassw = '';
    }
  }

  validateUsernameInline() {
    if (this.userData.username.length < 3) {
      this.inlineErrors.username = 'Lo username deve avere almeno 3 caratteri';
    } else {
      this.inlineErrors.username = '';
    }
  }

  isFormInvalid(): boolean {
    return !!(this.inlineErrors.email || this.inlineErrors.password ||
      this.inlineErrors.confirmPassw || this.inlineErrors.username ||
      !this.userData.username || !this.userData.email || !this.userData.password);
  }

  onRegister(){
    this.errorMess = '';
    const { confirmPassw, ...dataToSubmit } = this.userData;
    this.authService.register(dataToSubmit).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if(err.status === 409){
          this.errorMess = 'Username o email già esistenti';
        }else{
          this.errorMess = 'Errore durante la registrazione, Riprova più tardi';
        }
      }
    });
  }
}
