import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/authService';
import { AuthShell } from '../auth-shell/auth-shell';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink, AuthShell, Icon],
  template: `
    <app-auth-shell heading="Password dimenticata" sub="Ti mandiamo un link per sceglierne una nuova." quote="Succede anche ai migliori chef.">
      @if (invalidLink) {
        <p class="alert" role="alert"><app-icon name="alert" [size]="18" /> Il link di recupero non è valido o è scaduto. Richiedine uno nuovo.</p>
      }
      @if (emailSent) {
        <div class="alert alert--success sent" role="status">
          <app-icon name="mail" [size]="20" />
          <div><strong>Controlla la posta.</strong> Se {{ email }} è registrato, riceverai a breve un link valido per un tempo limitato.</div>
        </div>
      } @else {
        <form class="auth-form" (ngSubmit)="onRecover()" #f="ngForm">
          <div class="field">
            <label for="email">Email dell'account</label>
            <input id="email" name="email" type="email" class="input" [(ngModel)]="email" required email autocomplete="email" inputmode="email" />
          </div>
          @if (errorMess) { <p class="alert" role="alert"><app-icon name="alert" [size]="18" /> {{ errorMess }}</p> }
          <button type="submit" class="btn btn--primary btn--block" [disabled]="!f.valid || loading">
            @if (loading) { <span class="spinner" aria-hidden="true"></span> } Invia link di recupero
          </button>
        </form>
      }
      <p class="auth-alt"><a routerLink="/login">Torna all'accesso</a></p>
    </app-auth-shell>
  `,
  styles: `.sent { margin-top: var(--s-6); }`,
})
export class ForgotPassword {
  private readonly auth = inject(AuthService);
  readonly invalidLink = inject(ActivatedRoute).snapshot.queryParamMap.has('invalid');
  email = '';
  emailSent = false;
  loading = false;
  errorMess = '';

  onRecover(): void {
    this.errorMess = '';
    this.loading = true;
    this.auth.forgotPassword(this.email.trim()).subscribe({
      next: () => this.done(),
      error: (err: HttpErrorResponse) => {
        // 4xx ("email non trovata") viene trattato come successo: non riveliamo quali email esistono.
        if (err.status >= 400 && err.status < 500) return this.done();
        this.loading = false;
        this.errorMess = 'Invio non riuscito: il server non risponde. Riprova tra poco.';
      },
    });
  }

  private done(): void {
    this.loading = false;
    this.emailSent = true;
  }
}
