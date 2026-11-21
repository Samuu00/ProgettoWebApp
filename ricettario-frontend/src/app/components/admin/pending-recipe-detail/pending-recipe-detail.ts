import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../services/adminService';
import { httpErrorText } from '../../../services/http-error';
import { Ricetta } from '../../../models/ricetta';
import { Icon } from '../../shared/icon/icon';
import { Difficulty } from '../../shared/difficulty/difficulty';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { splitSteps } from '../../recipes/recipe-detail/recipe-detail';

@Component({
  selector: 'app-pending-recipe-detail',
  imports: [RouterLink, Icon, Difficulty, ConfirmDialog],
  templateUrl: './pending-recipe-detail.html',
  styleUrl: './pending-recipe-detail.css',
})
export class PendingRecipeDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminService = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);

  ricetta: Ricetta | null = null;
  steps: string[] = [];
  loading = true;
  error = '';
  actionError = '';
  approving = false;
  confirmOpen = false;
  rejecting = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.carica(id);
    else {
      this.loading = false;
      this.error = 'Bozza non valida.';
    }
  }

  carica(id: number): void {
    this.loading = true;
    this.error = '';
    this.adminService.getPendingRecipeById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.ricetta = data;
        this.steps = splitSteps(data?.istruzioni);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = httpErrorText(err, 'Bozza non disponibile.');
      },
    });
  }

  approva(): void {
    if (!this.ricetta?.id) return;
    this.approving = true;
    this.actionError = '';
    this.adminService.approveRecipe(this.ricetta.id).subscribe({
      next: () => this.router.navigate(['/admin/moderation']),
      error: (err) => {
        this.approving = false;
        this.actionError = httpErrorText(err, 'Approvazione non riuscita.');
      },
    });
  }

  scarta(): void {
    if (!this.ricetta?.id) return;
    this.rejecting = true;
    this.adminService.rejectRecipe(this.ricetta.id).subscribe({
      next: () => this.router.navigate(['/admin/moderation']),
      error: (err) => {
        this.rejecting = false;
        this.actionError = httpErrorText(err, 'Operazione non riuscita.');
        this.confirmOpen = false;
      },
    });
  }
}
