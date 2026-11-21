import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../../services/serviziRicetta';
import { StatService } from '../../../services/statService';
import { Ricetta } from '../../../models/ricetta';
import { RecipeCard } from '../../shared/recipe-card/recipe-card';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, RecipeCard, Icon],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  private readonly recipeService = inject(RecipeService);
  private readonly statService = inject(StatService);
  private readonly destroyRef = inject(DestroyRef);

  listaPreferiti: Ricetta[] = [];
  ratingMedioMap: Record<number, number> = {};
  loading = false;
  error = false;
  actionError = '';
  removing = new Set<number>();

  ngOnInit(): void {
    this.caricaPreferiti();
  }

  caricaPreferiti(): void {
    this.loading = true;
    this.error = false;
    this.recipeService
      .getFavorites()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.listaPreferiti = data ?? [];
          this.loading = false;
          this.listaPreferiti.forEach((r) => r.id != null && this.caricaRating(r.id));
        },
        error: () => {
          this.loading = false;
          this.error = true;
        },
      });
  }

  private caricaRating(id: number): void {
    this.statService.getRatings(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (v) => (this.ratingMedioMap[id] = v),
      error: () => {},
    });
  }

  rimuoviDaiPreferiti(recipe: Ricetta): void {
    const id = recipe.id;
    if (id == null || this.removing.has(id)) return;
    this.removing.add(id);
    this.actionError = '';
    this.recipeService.toggleFavorite(id).subscribe({
      next: () => {
        this.removing.delete(id);
        this.listaPreferiti = this.listaPreferiti.filter((r) => r.id !== id);
      },
      error: () => {
        this.removing.delete(id);
        this.actionError = `Non è stato possibile rimuovere «${recipe.titolo}». Riprova.`;
      },
    });
  }
}
