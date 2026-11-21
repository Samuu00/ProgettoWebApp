import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/authService';
import { AuthShell, PasswordRules } from '../auth-shell/auth-shell';
import { isStrongPassword } from '../auth-shell/password-rules';
import { Icon } from '../../shared/icon/icon';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, AuthShell, PasswordRules, Icon],
  templateUrl: './register.html',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  userData = { username: '', email: '', password: '', confirmPassw: '' };
  touched = { username: false, email: false, password: false, confirmPassw: false };
  showPassword = false;
  loading = false;
  errorMess = '';

  get errors() {
    const d = this.userData;
    return {
      username: d.username.trim().length < 3 ? 'Almeno 3 caratteri.' : '',
      email: !EMAIL.test(d.email.trim()) ? 'Inserisci un indirizzo email valido.' : '',
      password: !isStrongPassword(d.password) ? 'La password non rispetta i requisiti.' : '',
      confirmPassw: d.confirmPassw !== d.password || !d.confirmPassw ? 'Le password non coincidono.' : '',
    };
  }

  show(field: keyof Register['touched']): string {
    return this.touched[field] ? this.errors[field] : '';
  }

  onRegister(): void {
    this.errorMess = '';
    this.touched = { username: true, email: true, password: true, confirmPassw: true };
    if (Object.values(this.errors).some(Boolean)) return;

    this.loading = true;
    const { username, email, password } = this.userData;
    this.auth.register({ username: username.trim(), email: email.trim(), password }).subscribe({
      next: () => this.router.navigate(['/login'], { queryParams: { registered: 1 } }),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMess =
          err.status === 400 || err.status === 409
            ? 'Username o email già in uso. Prova con altri dati o accedi.'
            : 'Registrazione non riuscita. Riprova tra qualche istante.';
      },
    });
  }
}
