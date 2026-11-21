import { Component, OnDestroy, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/authService';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, RouterLink, Icon],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnDestroy {
  protected readonly auth = inject(AuthService);
  private timer?: ReturnType<typeof setTimeout>;

  nuovoUsername = this.auth.user()?.username ?? '';
  loading = false;
  errorMess = '';
  completeMess = '';

  salvaNuovoNome(): void {
    this.errorMess = '';
    this.completeMess = '';
    const nome = this.nuovoUsername.trim();
    if (nome.length < 3) {
      this.errorMess = 'Lo username deve avere almeno 3 caratteri.';
      return;
    }
    if (nome === this.auth.user()?.username) {
      this.errorMess = 'È già il tuo username attuale.';
      return;
    }
    this.loading = true;
    this.auth.updateProfile(nome).subscribe({
      next: () => {
        this.loading = false;
        this.completeMess = 'Username aggiornato.';
        clearTimeout(this.timer);
        this.timer = setTimeout(() => (this.completeMess = ''), 4000);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMess = err.status === 400 ? 'Username non disponibile: scegline un altro.' : 'Aggiornamento non riuscito. Riprova.';
      },
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
