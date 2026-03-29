import { Component, OnInit, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../../../services/adminService';
import { Utente } from '../../../models/user';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [Navbar, Footer, RouterModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagement implements OnInit {

  utenti: Utente[] = [];
  loading: boolean = false;
  activeDropdownId: number | null = null;

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.caricaListaUtenti(); }

  @HostListener('document:click')
  closeDropdowns() {
    this.activeDropdownId = null;
  }

  toggleDropdown(userId: number, event: Event) {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === userId ? null : userId;
  }

  caricaListaUtenti() {
    this.loading = true;
    this.adminService.getAllUser().subscribe({
      next: (data) => {
        this.utenti = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  gesticiStatoUtente(userId: number) {
    const user = this.utenti.find(u => u.id === userId);
    if (!user) return;

    const vecchioStato = user.stato;
    user.stato = !vecchioStato;

    this.adminService.toggleUserBlock(userId).subscribe({
      error: () => {
        user.stato = vecchioStato;
        this.cdr.markForCheck();
        alert('Impossibile aggiornare lo stato dell\'utente.');
      }
    });
  }

  selezionaRuolo(user: Utente, nuovoRuolo: 'STANDARD' | 'ADMIN') {
    if (user.ruolo === nuovoRuolo) {
      this.activeDropdownId = null;
      return;
    }

    const vecchioRuolo = user.ruolo;
    user.ruolo = nuovoRuolo;
    this.activeDropdownId = null;

    this.adminService.updateUserRole(user.id!, nuovoRuolo).subscribe({
      next: () => this.cdr.markForCheck(),
      error: () => {

        user.ruolo = vecchioRuolo;
        this.cdr.markForCheck();
        alert('Errore durante il cambio ruolo.');
      }
    });
  }
}
