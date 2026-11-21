import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommentService } from '../../../services/commentiService';
import { httpErrorText } from '../../../services/http-error';
import { Commenti } from '../../../models/comment';
import { Icon } from '../../shared/icon/icon';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-comment-moderation',
  imports: [DatePipe, RouterLink, Icon, ConfirmDialog],
  templateUrl: './comment-moderation.html',
  styleUrl: './comment-moderation.css',
})
export class CommentModeration implements OnInit {
  private readonly commentService = inject(CommentService);
  private readonly destroyRef = inject(DestroyRef);

  commenti: Commenti[] = [];
  loading = true;
  error = '';
  daEliminare: Commenti | null = null;
  deleting = false;
  deleteError = '';

  ngOnInit(): void {
    this.caricaCommenti();
  }

  caricaCommenti(): void {
    this.loading = true;
    this.error = '';
    this.commentService.getAllComments().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.commenti = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = httpErrorText(err, 'Commenti non disponibili.');
      },
    });
  }

  confermaElimina(): void {
    const id = this.daEliminare?.id;
    if (id == null) return;
    this.deleting = true;
    this.deleteError = '';
    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.commenti = this.commenti.filter((c) => c.id !== id);
        this.deleting = false;
        this.daEliminare = null;
      },
      error: (err) => {
        this.deleting = false;
        this.deleteError = httpErrorText(err, 'Eliminazione non riuscita.');
      },
    });
  }
}
