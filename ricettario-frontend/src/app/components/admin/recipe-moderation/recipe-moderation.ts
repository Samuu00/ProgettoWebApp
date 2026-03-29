import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/adminService';
import { Ricetta } from '../../../models/ricetta';
import { RecipeService } from '../../../services/serviziRicetta';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { Stato } from '../../../models/ricetta';

@Component({
  selector: 'app-recipe-moderation',
  standalone: true,
  imports: [CommonModule, Navbar, Footer, RouterModule],
  templateUrl: './recipe-moderation.html',
  styleUrl: './recipe-moderation.css',
})
export class RecipeModeration implements OnInit {
  ricetteVisualizzate: Ricetta[] = [];
  mostraSoloPendenti: boolean = true;
  paginaCorr: number = 0;
  loading: boolean = false;

  constructor(
    private adminService: AdminService,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.caricaDati();
  }

  caricaDati() {
    this.loading = true;
    this.ricetteVisualizzate = [];

    const observer = {
      next: (res: any) => {
        this.ricetteVisualizzate = Array.isArray(res) ? res : (res.content || []);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Errore nel caricamento:', err);
        this.loading = false;
      }
    };

    if (this.mostraSoloPendenti) {
      this.adminService.getPendingRecipes(this.paginaCorr, 20).subscribe(observer);
    } else {
      this.recipeService.getRecipes(this.paginaCorr, 20).subscribe(observer);
    }
  }

  toggleVisualizzazione(soloPendenti: boolean) {
    if (this.mostraSoloPendenti === soloPendenti) return;
    this.mostraSoloPendenti = soloPendenti;
    this.paginaCorr = 0;
    this.caricaDati();
  }

  azioneApprova(id: number) {
    this.adminService.approveRecipe(id).subscribe({
      next: () => {
        if (this.mostraSoloPendenti) {

          this.ricetteVisualizzate = this.ricetteVisualizzate.filter(r => r.id !== id);
        } else {

          const r = this.ricetteVisualizzate.find(ric => ric.id === id);
          if (r) {
            r.status = Stato.APPROVATA;
          }
        }
      },
      error: (err) => console.error('Errore durante l\'approvazione:', err)
    });
  }

  mostraConfermaEliminazione = false;
  mostraConfermaEliminazioneBozza = false;
  idRicettaDaEliminare: number | null = null;

  azioneElimina(id: number) {
    this.idRicettaDaEliminare = id;
    this.mostraConfermaEliminazione = true;
  }

  azioneEliminaBozza(id: number) {
    this.idRicettaDaEliminare = id;
    this.mostraConfermaEliminazioneBozza = true;
  }

  confermaEliminazioneBozza() {
    if (this.idRicettaDaEliminare) {
      this.adminService.rejectRecipe(this.idRicettaDaEliminare).subscribe({
        next: () => {

          this.ricetteVisualizzate = this.ricetteVisualizzate.filter(r => r.id !== this.idRicettaDaEliminare);
          this.mostraConfermaEliminazioneBozza = false;
          this.idRicettaDaEliminare = null;
        },
        error: (err) => console.error('Errore durante il reject:', err)
      });
    }
  }

  confermaEliminazioneEffettiva() {
    if (this.idRicettaDaEliminare) {
      this.adminService.deleteRecipe(this.idRicettaDaEliminare).subscribe({
        next: () => {

          this.ricetteVisualizzate = this.ricetteVisualizzate.filter(r => r.id !== this.idRicettaDaEliminare);
          this.mostraConfermaEliminazione = false;
          this.idRicettaDaEliminare = null;
        },
        error: (err) => console.error('Errore durante l\'eliminazione definitiva:', err)
      });
    }
  }

  annullaEliminazione() {
    this.mostraConfermaEliminazione = false;
    this.idRicettaDaEliminare = null;
  }

  annullaEliminazioneBozza() {
    this.mostraConfermaEliminazioneBozza = false;
    this.idRicettaDaEliminare = null;
  }
}
