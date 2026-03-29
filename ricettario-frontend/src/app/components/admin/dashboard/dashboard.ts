import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/authService';
import { RecipeService } from '../../../services/serviziRicetta';
import { Ricetta } from '../../../models/ricetta';
import { Utente } from '../../../models/user';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/adminService';
import { Rating } from '../../../models/rating';
import { StatService } from '../../../services/statService';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Navbar, Footer, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit{
  utenteLocale: Utente | null = null;
  mieRicette: Ricetta[] = [];
  preferiti: number = 0;
  ratingMedioMap: { [key: number]: number } = {};

  constructor(private recipeService: RecipeService, private statsService: StatService , private authService: AuthService, private router: Router, private adminService: AdminService) {}

  ngOnInit(){
    this.utenteLocale = this.authService.getCurrentUser();

    if(this.utenteLocale){
      this.caricaDatiUtente();
    }
  }

  caricaDatiUtente() {
    const username = this.utenteLocale?.username;
    const id = this.utenteLocale?.id;

    if (username) {
      this.recipeService.getRecipes(0, 10, { author: username }).subscribe(res => {

        if (Array.isArray(res)) {
          this.mieRicette = res;
        } else if (res && res.content) {
          this.mieRicette = res.content;
        }

        this.mieRicette.forEach(ricetta => {
          if (ricetta.id) {
            this.getRecipeRating(ricetta.id);
          }
        });
      });

      this.recipeService.countFavorites(id!).subscribe(res => {
        this.preferiti = res;
      });
    }
  }

  getRecipeRating(id: number) {
    this.statsService.getRatings(id).subscribe({
      next: (rating: any) => {
        this.ratingMedioMap[id] = rating;
      },
      error: (err) => console.error(err)
    });
  }

  azioneEdit(id: number) {
    this.router.navigate(['/recipe-edit', id]);
  }

  mostraConfermaEliminazione = false;
  idRicettaDaEliminare: number | null = null;

  azioneElimina(id: number) {
    this.idRicettaDaEliminare = id;
    this.mostraConfermaEliminazione = true;
  }

  confermaEliminazioneEffettiva() {
    if (this.idRicettaDaEliminare) {
      this.adminService.deleteRecipe(this.idRicettaDaEliminare).subscribe({
        next: () => {

          this.mieRicette = this.mieRicette.filter(r => r.id !== this.idRicettaDaEliminare);
          this.mostraConfermaEliminazione = false;
          this.idRicettaDaEliminare = null;

          console.log('Ricetta rimossa visivamente');
        },
        error: (err) => console.error('Errore durante l\'eliminazione:', err)
      });
    }
  }

  annullaEliminazione() {
    this.mostraConfermaEliminazione = false;
    this.idRicettaDaEliminare = null;
  }
}

