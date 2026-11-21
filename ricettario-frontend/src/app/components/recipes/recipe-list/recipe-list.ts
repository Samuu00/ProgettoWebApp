import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../../services/serviziRicetta';
import { StatService } from '../../../services/statService';
import { Ricetta } from '../../../models/ricetta';
import { RecipeFilter } from '../../../models/recipeFilter';
import { RecipeCard } from '../../shared/recipe-card/recipe-card';
import { Icon } from '../../shared/icon/icon';

const PAGE_SIZE = 12;
const emptyFilters = (): RecipeFilter => ({ title: '', difficulty: '', category: '', maxTime: undefined });

@Component({
  selector: 'app-recipe-list',
  imports: [FormsModule, RouterLink, RecipeCard, Icon],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.css',
})
export class RecipeList implements OnInit {
  private readonly recipeService = inject(RecipeService);
  private readonly statService = inject(StatService);
  private readonly destroyRef = inject(DestroyRef);

  ricette: Ricetta[] = [];
  ratingMedioMap: Record<number, number> = {};
  loading = false;
  error = false;
  visible = PAGE_SIZE;
  filtri: RecipeFilter = emptyFilters();

  readonly difficulties = [
    { value: '', label: 'Tutte' },
    { value: 'FACILE', label: 'Facile' },
    { value: 'MEDIO', label: 'Media' },
    { value: 'DIFFICILE', label: 'Difficile' },
  ];
  readonly times = [15, 30, 45, 60, 120];
  readonly skeletons = Array.from({ length: 6 });

  ngOnInit(): void {
    this.caricaRicette();
  }

  get hasFilters(): boolean {
    const f = this.filtri;
    return !!(f.title || f.category || f.difficulty || f.maxTime);
  }

  caricaRicette(): void {
    this.loading = true;
    this.error = false;
    this.visible = PAGE_SIZE;
    this.recipeService
      .getRecipes(0, PAGE_SIZE, { ...this.filtri, title: this.filtri.title?.trim(), category: this.filtri.category?.trim() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.ricette = list;
          this.loading = false;
          list.forEach((r) => r.id != null && this.caricaRating(r.id));
        },
        error: () => {
          this.ricette = [];
          this.loading = false;
          this.error = true;
        },
      });
  }

  private caricaRating(id: number): void {
    if (id in this.ratingMedioMap) return;
    this.statService
      .getRatings(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (v) => (this.ratingMedioMap[id] = v), error: () => {} });
  }

  applicaFiltri(): void {
    this.caricaRicette();
  }

  resetFiltri(): void {
    this.filtri = emptyFilters();
    this.caricaRicette();
  }

  mostraAltre(): void {
    this.visible += PAGE_SIZE;
  }
}
