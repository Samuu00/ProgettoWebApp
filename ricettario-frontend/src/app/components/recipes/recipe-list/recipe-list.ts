import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../services/serviziRicetta';
import { Ricetta } from '../../../models/ricetta';
import { StatService } from '../../../services/statService';
import { RecipeFilter } from '../../../models/recipeFilter';
import { Rating } from '../../../models/rating';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, Navbar, Footer],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.css',
})
export class RecipeList implements OnInit {
  ricette: Ricetta[] = [];
  loading: boolean = false;
  isDropdownOpen = false;
  ratingMedioMap: { [key: number]: number } = {};

  filtri: RecipeFilter = {
    title: '',
    difficulty: '',
    category: '',
    maxTime: undefined
  };

  paginaCorr: number = 0;
  totalePag: number = 0;
  size: number = 6;

  constructor(private recipeService: RecipeService, private statService: StatService) {}

  ngOnInit() {
    this.caricaRicette();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectDifficulty(val: string) {
    this.filtri.difficulty = val;
    this.isDropdownOpen = false;
    this.applicaFiltri();
  }

  getSelectedLabel() {
    switch (this.filtri.difficulty) {
      case 'FACILE': return '🟢 Facile';
      case 'MEDIO': return '🟡 Medio';
      case 'DIFFICILE': return '🔴 Difficile';
      default: return '✨ Ogni Difficoltà';
    }
  }

  caricaRicette() {
    this.loading = true;
    this.recipeService.getRecipes(this.paginaCorr, this.size, this.filtri).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.ricette = response;
          this.totalePag = 1;
        } else if (response && response.content) {
          this.ricette = response.content;
          this.totalePag = response.totalPages;
        }

        this.ricette.forEach(ricetta => {
          if (ricetta.id) {
            this.caricaRating(ricetta.id);
          }
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento', err);
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

  applicaFiltri() {
    this.paginaCorr = 0;
    this.caricaRicette();
  }

  resetFiltri() {
    this.filtri = {
      title: '',
      difficulty: '',
      category: '',
      maxTime: undefined
    };
    this.paginaCorr = 0;
    this.caricaRicette();
  }

}
