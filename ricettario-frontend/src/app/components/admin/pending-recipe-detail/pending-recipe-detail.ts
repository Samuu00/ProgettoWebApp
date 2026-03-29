import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Ricetta } from '../../../models/ricetta';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { AdminService } from '../../../services/adminService';

@Component({
  selector: 'app-pending-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Footer],
  templateUrl: './pending-recipe-detail.html',
  styleUrl: './pending-recipe-detail.css'
})
export class PendingRecipeDetail implements OnInit {
  ricetta: Ricetta | null = null;
  loading: boolean = true;
  mostraConfermaEliminazioneBozza = false;
  idRicettaDaEliminare: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.caricaDettaglioBozza(id);
    }
  }

  caricaDettaglioBozza(id: number): void {
    this.loading = true;
    this.adminService.getPendingRecipeById(id).subscribe({
      next: (data) => {
        this.ricetta = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel recupero della bozza:', err);
        this.loading = false;
        this.router.navigate(['/admin/moderation']);
      }
    });
  }

  azioneApprova(): void {
    if (this.ricetta?.id) {
      this.adminService.approveRecipe(this.ricetta.id).subscribe({
        next: () => {
          console.log('Ricetta Approvata con successo');
          this.router.navigate(['/admin/moderation']);
        },
        error: (err) => console.error('Errore durante l\'approvazione:', err)
      });
    }
  }

  azioneEliminaBozza(): void {
    this.mostraConfermaEliminazioneBozza = true;
  }

  confermaEliminazioneBozza(): void {
    if (this.ricetta?.id) {
      this.adminService.rejectRecipe(this.ricetta.id).subscribe({
        next: () => {
          this.mostraConfermaEliminazioneBozza = false;
          console.log('Ricetta Scartata con successo');
          this.router.navigate(['/admin/moderation']);
        },
        error: (err) => console.error('Errore durante lo scarto:', err)
      });
    }
  }

  annullaEliminazioneBozza() {
    this.mostraConfermaEliminazioneBozza = false;
    this.idRicettaDaEliminare = null;
  }
}
