import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/authService';
import { AuthShell, PasswordRules } from '../auth-shell/auth-shell';
import { isStrongPassword } from '../auth-shell/password-rules';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink, AuthShell, PasswordRules, Icon],
  template: `
    <app-auth-shell heading="Scegli una nuova password" sub="Dopo il salvataggio potrai accedere subito." quote="Una chiave nuova per la tua cucina.">
      @if (successMess) {
        <div class="alert alert--success done" role="status"><app-icon name="check" [size]="20" /> {{ successMess }}</div>
        <p class="auth-alt"><a routerLink="/login">Vai all'accesso</a></p>
      } @else {
        <form class="auth-form" (ngSubmit)="onReset()" novalidate>
          <div class="field">
            <label for="pw">Nuova password</label>
            <div class="input-wrap">
              <input id="pw" name="pw" class="input" [type]="showPassword ? 'text' : 'password'" [(ngModel)]="newPassword"
                     autocomplete="new-password" aria-describedby="pw-rules" />
              <button type="button" class="btn btn--ghost btn--icon btn--sm" (click)="showPassword = !showPassword"
                      [attr.aria-label]="showPassword ? 'Nascondi password' : 'Mostra password'" [attr.aria-pressed]="showPassword">
                <app-icon [name]="showPassword ? 'eye-off' : 'eye'" [size]="18" />
              </button>
            </div>
            <app-password-rules [value]="newPassword" />
          </div>
          <div class="field">
            <label for="pw2">Ripeti la password</label>
            <input id="pw2" name="pw2" class="input" [type]="showPassword ? 'text' : 'password'" [(ngModel)]="confirm" autocomplete="new-password" />
          </div>
          @if (errorMess) { <p class="alert" role="alert"><app-icon name="alert" [size]="18" /> {{ errorMess }}</p> }
          <button type="submit" class="btn btn--primary btn--block" [disabled]="isSubmitting">
            @if (isSubmitting) { <span class="spinner" aria-hidden="true"></span> } Salva password
          </button>
        </form>
      }
    </app-auth-shell>
  `,
  styles: `.done { margin-top: var(--s-6); }`,
})
export class ResetPassword implements OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly token = inject(ActivatedRoute).snapshot.paramMap.get('token') ?? '';
  private timer?: ReturnType<typeof setTimeout>;

  newPassword = '';
  confirm = '';
  showPassword = false;
  isSubmitting = false;
  successMess = '';
  errorMess = '';

  onReset(): void {
    this.errorMess = '';
    if (!isStrongPassword(this.newPassword)) {
      this.errorMess = 'La password non rispetta i requisiti indicati.';
      return;
    }
    if (this.newPassword !== this.confirm) {
      this.errorMess = 'Le due password non coincidono.';
      return;
    }
    this.isSubmitting = true;
    this.auth.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.successMess = 'Password aggiornata. Ti portiamo all\'accesso…';
        this.timer = setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMess = 'Il link potrebbe essere scaduto. Richiedi un nuovo link di recupero.';
      },
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
