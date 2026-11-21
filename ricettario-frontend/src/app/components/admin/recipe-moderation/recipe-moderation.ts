import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../../../services/adminService';
import { RecipeService } from '../../../services/serviziRicetta';
import { httpErrorText } from '../../../services/http-error';
import { Ricetta, Stato } from '../../../models/ricetta';
import { Icon } from '../../shared/icon/icon';
import { Difficulty } from '../../shared/difficulty/difficulty';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

type Pending = { recipe: Ricetta; kind: 'reject' | 'delete' };

@Component({
  selector: 'app-recipe-moderation',
  imports: [RouterLink, Icon, Difficulty, ConfirmDialog],
  templateUrl: './recipe-moderation.html',
  styleUrl: './recipe-moderation.css',
})
export class RecipeModeration implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly recipeService = inject(RecipeService);
  private readonly destroyRef = inject(DestroyRef);

  ricette: Ricetta[] = [];
  mostraSoloPendenti = true;
  loading = false;
  error = '';
  actionError = '';
  busyId: number | null = null;

  conferma: Pending | null = null;
  confirmBusy = false;
  confirmError = '';

  ngOnInit(): void {
    this.caricaDati();
  }

  caricaDati(): void {
    this.loading = true;
    this.error = '';
    const src$: Observable<Ricetta[]> = this.mostraSoloPendenti
      ? this.adminService.getPendingRecipes(0, 50)
      : this.recipeService.getRecipes(0, 50);
    src$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (list) => {
        this.ricette = list ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.ricette = [];
        this.loading = false;
        this.error = httpErrorText(err, 'Elenco ricette non disponibile.');
      },
    });
  }

  setTab(soloPendenti: boolean): void {
    if (this.mostraSoloPendenti === soloPendenti) return;
    this.mostraSoloPendenti = soloPendenti;
    this.caricaDati();
  }

  isDraft(r: Ricetta): boolean {
    return r.status === Stato.BOZZA;
  }

  approva(r: Ricetta): void {
    if (!r.id) return;
    this.busyId = r.id;
    this.actionError = '';
    this.adminService.approveRecipe(r.id).subscribe({
      next: () => {
        this.busyId = null;
        if (this.mostraSoloPendenti) this.ricette = this.ricette.filter((x) => x.id !== r.id);
        else r.status = Stato.APPROVATA;
      },
      error: (err) => {
        this.busyId = null;
        this.actionError = httpErrorText(err, `Approvazione di «${r.titolo}» non riuscita.`);
      },
    });
  }

  chiedi(recipe: Ricetta, kind: Pending['kind']): void {
    this.conferma = { recipe, kind };
    this.confirmError = '';
  }

  confermaAzione(): void {
    const c = this.conferma;
    if (!c?.recipe.id) return;
    const id = c.recipe.id;
    this.confirmBusy = true;
    const req$ = c.kind === 'reject' ? this.adminService.rejectRecipe(id) : this.adminService.deleteRecipe(id);
    req$.subscribe({
      next: () => {
        this.ricette = this.ricette.filter((x) => x.id !== id);
        this.confirmBusy = false;
        this.conferma = null;
      },
      error: (err) => {
        this.confirmBusy = false;
        this.confirmError = httpErrorText(err, 'Operazione non riuscita. Riprova.');
      },
    });
  }
}
