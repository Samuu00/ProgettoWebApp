import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/authService';
import { RecipeService } from '../../../services/serviziRicetta';
import { AdminService } from '../../../services/adminService';
import { StatService } from '../../../services/statService';
import { Ricetta } from '../../../models/ricetta';
import { Icon } from '../../shared/icon/icon';
import { Difficulty } from '../../shared/difficulty/difficulty';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

/** "La mia cucina": ricette pubblicate dall'utente corrente. */
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DecimalPipe, Icon, Difficulty, ConfirmDialog],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly recipeService = inject(RecipeService);
  private readonly statsService = inject(StatService);
  private readonly adminService = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);

  mieRicette: Ricetta[] = [];
  preferiti: number | null = null;
  ratingMedioMap: Record<number, number> = {};
  loading = true;
  error = false;

  daEliminare: Ricetta | null = null;
  deleting = false;
  deleteError = '';

  ngOnInit(): void {
    this.caricaDatiUtente();
  }

  caricaDatiUtente(): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;
    this.loading = true;
    this.error = false;
    this.recipeService
      .getRecipes(0, 50, { author: user.username })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.mieRicette = list;
          this.loading = false;
          list.forEach((r) => r.id != null && this.getRecipeRating(r.id));
        },
        error: () => {
          this.loading = false;
          this.error = true;
        },
      });
    this.recipeService
      .countFavorites(user.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (n) => (this.preferiti = n), error: () => (this.preferiti = null) });
  }

  private getRecipeRating(id: number): void {
    this.statsService.getRatings(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (v) => (this.ratingMedioMap[id] = v),
      error: () => {},
    });
  }

  /** Il backend espone l'eliminazione solo agli admin (endpoint di moderazione). */
  confermaEliminazione(): void {
    const id = this.daEliminare?.id;
    if (!id) return;
    this.deleting = true;
    this.deleteError = '';
    this.adminService.deleteRecipe(id).subscribe({
      next: () => {
        this.mieRicette = this.mieRicette.filter((r) => r.id !== id);
        this.deleting = false;
        this.daEliminare = null;
      },
      error: () => {
        this.deleting = false;
        this.deleteError = 'Eliminazione non riuscita. Riprova.';
      },
    });
  }

  annullaEliminazione(): void {
    this.daEliminare = null;
    this.deleteError = '';
  }
}
