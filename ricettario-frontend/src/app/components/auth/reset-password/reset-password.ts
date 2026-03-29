import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/authService';
import { Footer } from '../../shared/footer/footer';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
  imports: [FormsModule, RouterModule, Footer, CommonModule]
})
export class ResetPassword implements OnInit {
  token: string = '';
  newPassword: string = '';
  successMess: string = '';
  errorMess: string = '';
  showPassword = false;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() { this.token = this.route.snapshot.paramMap.get('token') || ''; }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  validatePasswordInline(): boolean {
    const password = this.newPassword;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      this.errorMess = 'La password è obbligatoria';
    } else if (password.length < 8) {
      this.errorMess = 'Deve essere lunga almeno 8 caratteri';
    } else if (!/[A-Z]/.test(password)) {
      this.errorMess = 'Aggiungi almeno una lettera maiuscola';
    } else if (!/\d/.test(password)) {
      this.errorMess = 'Aggiungi almeno un numero';
    } else if (!/[@$!%*?&]/.test(password)) {
      this.errorMess = 'Aggiungi un carattere speciale (@$!%*?&)';
    } else if (!passwordRegex.test(password)) {
      this.errorMess = 'Formato non valido';
    } else {
      this.errorMess = '';
      return true;
    }
    return false;
  }

  onReset() {
    if (!this.validatePasswordInline() || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMess = '';

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.successMess = "Successo! Password aggiornata. Reindirizzamento in corso...";
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMess = "Errore: il link potrebbe essere scaduto. Riprova la procedura.";
      }
    });
  }
}
