import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RecipeService } from '../../../services/serviziRicetta';
import { StatService } from '../../../services/statService';
import { AuthService } from '../../../services/authService';
import { CommentService } from '../../../services/commentiService';
import { Ricetta } from '../../../models/ricetta';
import { Commenti } from '../../../models/comment';
import { Icon } from '../../shared/icon/icon';
import { Difficulty } from '../../shared/difficulty/difficulty';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

type LoadState = 'loading' | 'ready' | 'notfound' | 'error';

/** Le istruzioni sono testo libero: una riga non vuota = un passaggio. */
export function splitSteps(text: string | undefined): string[] {
  return (text ?? '')
    .split(/\r?\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

@Component({
  selector: 'app-recipe-detail',
  imports: [RouterLink, FormsModule, DatePipe, DecimalPipe, Icon, Difficulty, ConfirmDialog],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);
  private readonly commentService = inject(CommentService);
  private readonly statService = inject(StatService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);

  state: LoadState = 'loading';
  ricetta: Ricetta | null = null;
  steps: string[] = [];
  checked = new Set<number>();

  ratingMedio = 0;
  alrVoted = false;
  votoUtente = 0;
  hoverRating = 0;
  ratingError = '';

  isFavorite = false;
  favBusy = false;
  favError = '';

  commenti: Commenti[] = [];
  nuovoCommento = '';
  sending = false;
  commentError = '';
  daEliminare: Commenti | null = null;
  deleting = false;
  deleteError = '';

  videoSafeUrl: SafeResourceUrl | null = null;
  readonly stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    // paramMap (non snapshot): navigare da una ricetta all'altra ricarica i dati.
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((pm) => {
      const id = Number(pm.get('id'));
      if (Number.isInteger(id) && id > 0) this.caricaRicetta(id);
      else this.state = 'notfound';
    });
  }

  get canEdit(): boolean {
    const u = this.auth.getCurrentUser();
    return !!this.ricetta && !!u && (u.id === this.ricetta.idAutore || this.auth.isAdmin());
  }

  canDelete(c: Commenti): boolean {
    return this.auth.isAdmin() || this.auth.getCurrentUser()?.username === c.authUsername;
  }

  caricaRicetta(id: number): void {
    this.state = 'loading';
    this.videoSafeUrl = null;
    this.checked.clear();
    this.recipeService
      .getRecipeById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          if (!data) {
            this.state = 'notfound';
            return;
          }
          this.ricetta = data;
          this.steps = splitSteps(data.istruzioni);
          this.state = 'ready';
          this.caricaExtra(id, data.titolo);
        },
        error: (err: HttpErrorResponse) => {
          this.state = err.status === 404 || err.status === 400 ? 'notfound' : 'error';
        },
      });
  }

  private caricaExtra(id: number, titolo: string): void {
    this.statService.checkRating(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (v) => (this.alrVoted = v),
      error: () => {},
    });
    this.caricaRating(id);
    this.recipeService.isFavorite(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (v) => (this.isFavorite = v),
      error: () => {},
    });
    this.commentService.getCommentsByRecipe(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => (this.commenti = data ?? []),
      error: () => (this.commentError = 'Non è stato possibile caricare i commenti.'),
    });
    this.statService.getVideoTutorialId(titolo).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (videoId) => {
        // videoId validato (/^[\w-]{11}$/) nel service: l'URL e' costruito da noi, mai preso grezzo.
        this.videoSafeUrl = videoId
          ? this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${videoId}`)
          : null;
      },
      error: () => (this.videoSafeUrl = null),
    });
  }

  private caricaRating(id: number): void {
    this.statService.getRatings(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (v) => (this.ratingMedio = v),
      error: () => {},
    });
  }

  toggleCheck(i: number): void {
    if (this.checked.has(i)) this.checked.delete(i);
    else this.checked.add(i);
  }

  vota(score: number): void {
    const id = this.ricetta?.id;
    if (this.alrVoted || !id) return;
    this.ratingError = '';
    this.statService.addRating(id, score).subscribe({
      next: () => {
        this.votoUtente = score;
        this.alrVoted = true;
        this.caricaRating(id);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) this.alrVoted = true;
        else this.ratingError = 'Voto non registrato. Riprova.';
      },
    });
  }

  toggleFavorite(): void {
    const id = this.ricetta?.id;
    if (!id || this.favBusy) return;
    this.favBusy = true;
    this.favError = '';
    this.recipeService.toggleFavorite(id).subscribe({
      next: () => {
        this.isFavorite = !this.isFavorite;
        this.favBusy = false;
      },
      error: () => {
        this.favBusy = false;
        this.favError = 'Non è stato possibile aggiornare i preferiti.';
      },
    });
  }

  inviaCommento(): void {
    const id = this.ricetta?.id;
    const testo = this.nuovoCommento.trim();
    if (!testo || !id || this.sending) return;
    this.sending = true;
    this.commentError = '';
    this.commentService.addComment(id, testo).subscribe({
      next: (c) => {
        this.commenti = [c, ...this.commenti];
        this.nuovoCommento = '';
        this.sending = false;
      },
      error: () => {
        this.sending = false;
        this.commentError = 'Commento non inviato. Riprova tra poco.';
      },
    });
  }

  confermaElimina(): void {
    const c = this.daEliminare;
    if (!c?.id) return;
    this.deleting = true;
    this.deleteError = '';
    this.commentService.deleteComment(c.id).subscribe({
      next: () => {
        this.commenti = this.commenti.filter((x) => x.id !== c.id);
        this.daEliminare = null;
        this.deleting = false;
      },
      error: () => {
        this.deleting = false;
        this.deleteError = 'Eliminazione non riuscita.';
      },
    });
  }

  chiudiElimina(): void {
    this.daEliminare = null;
    this.deleteError = '';
  }
}
