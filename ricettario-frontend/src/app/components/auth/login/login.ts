import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/authService';
import { AuthShell } from '../auth-shell/auth-shell';
import { Icon } from '../../shared/icon/icon';

/** Accetta solo percorsi interni come redirect post-login (niente open redirect). */
export function safeReturnUrl(url: string | null | undefined): string | null {
  return url && url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/login') ? url : null;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, AuthShell, Icon],
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly qp = inject(ActivatedRoute).snapshot.queryParamMap;

  credential = { username: '', password: '' };
  errorMess = '';
  showPassword = false;
  loading = false;
  readonly registered = this.qp.has('registered');
  readonly expired = this.qp.has('expired');

  onLogin(): void {
    this.errorMess = '';
    if (!this.credential.username.trim() || !this.credential.password) {
      this.errorMess = 'Inserisci username e password.';
      return;
    }
    this.loading = true;
    this.auth.login({ username: this.credential.username.trim(), password: this.credential.password }).subscribe({
      next: () => {
        const fallback = this.auth.isAdmin() ? '/admin/dashboard' : '/recipe-list';
        this.router.navigateByUrl(safeReturnUrl(this.qp.get('returnUrl')) ?? fallback);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.credential.password = '';
        this.errorMess =
          err.status === 403
            ? 'Il tuo account è stato disabilitato da un amministratore.'
            : err.status === 0 || err.status >= 500
              ? 'Il server non risponde. Riprova tra qualche istante.'
              : 'Username o password non corretti.';
      },
    });
  }
}
