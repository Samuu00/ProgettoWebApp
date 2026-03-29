import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../services/serviziRicetta';
import { Ricetta } from '../../../models/ricetta';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from '../../shared/footer/footer';
import { Navbar } from '../../shared/navbar/navbar';
import { StatService } from '../../../services/statService';
import { Rating } from '../../../models/rating';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, Footer, Navbar],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  listaPreferiti: Ricetta[] = [];
  loading: boolean = false;
  ratingMedioMap: { [key: number]: number } = {};

  constructor(
    private recipeService: RecipeService,
    private statService: StatService
  ) {}

  ngOnInit() {
    this.caricaPreferiti();
  }

  caricaPreferiti() {
    this.loading = true;
    this.recipeService.getFavorites().subscribe({
      next: (data) => {
        this.listaPreferiti = data;

        this.listaPreferiti.forEach(ricetta => {
          if (ricetta.id) {
            this.caricaRating(ricetta.id);
          }
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento dei preferiti', err);
        this.loading = false;
      }
    });
  }

  caricaRating(id: number) {
    this.statService.getRatings(id).subscribe({
      next: (res: any) => {
        this.ratingMedioMap[id] = res;
      },
      error: (err) => console.error('Errore caricamento rating', err)
    });
  }

  rimuoviDaiPreferiti(recipeId: number) {
    this.recipeService.toggleFavorite(recipeId).subscribe({
      next: () => {
        this.listaPreferiti = this.listaPreferiti.filter(r => r.id !== recipeId);
      },
      error: (err) => {
        console.error('Errore rimozione:', err);
      }
    });
  }
}
