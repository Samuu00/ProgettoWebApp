import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/adminService';
import { AuthService } from '../../../services/authService';
import { httpErrorText } from '../../../services/http-error';
import { Utente } from '../../../models/user';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-user-management',
  imports: [FormsModule, Icon],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  utenti: Utente[] = [];
  query = '';
  loading = false;
  error = '';
  actionError = '';
  busy = new Set<number>();

  ngOnInit(): void {
    this.caricaListaUtenti();
  }

  get filtrati(): Utente[] {
    const q = this.query.trim().toLowerCase();
    return q ? this.utenti.filter((u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) : this.utenti;
  }

  /** Un admin non puo' bloccare o declassare se stesso dalla UI. */
  isSelf(u: Utente): boolean {
    return u.id === this.auth.getCurrentUser()?.id;
  }

  caricaListaUtenti(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getAllUser().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.utenti = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = httpErrorText(err, 'Elenco utenti non disponibile.');
      },
    });
  }

  /** `stato === true` significa account bloccato. Aggiornamento ottimistico con rollback. */
  toggleBlocco(user: Utente): void {
    if (this.busy.has(user.id)) return;
    const prima = user.stato;
    user.stato = !prima;
    this.busy.add(user.id);
    this.actionError = '';
    this.adminService.toggleUserBlock(user.id).subscribe({
      next: () => this.busy.delete(user.id),
      error: (err) => {
        user.stato = prima;
        this.busy.delete(user.id);
        this.actionError = httpErrorText(err, `Impossibile aggiornare lo stato di ${user.username}.`);
      },
    });
  }

  cambiaRuolo(user: Utente, nuovoRuolo: Utente['ruolo']): void {
    if (user.ruolo === nuovoRuolo) return;
    const prima = user.ruolo;
    user.ruolo = nuovoRuolo;
    this.busy.add(user.id);
    this.actionError = '';
    this.adminService.updateUserRole(user.id, nuovoRuolo).subscribe({
      next: () => this.busy.delete(user.id),
      error: (err) => {
        user.ruolo = prima;
        this.busy.delete(user.id);
        this.actionError = httpErrorText(err, `Cambio ruolo di ${user.username} non riuscito.`);
      },
    });
  }
}
