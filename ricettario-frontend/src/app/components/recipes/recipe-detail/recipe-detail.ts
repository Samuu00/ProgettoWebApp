import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../../services/serviziRicetta';
import { StatService } from '../../../services/statService';
import { Rating } from '../../../models/rating';
import { AuthService } from '../../../services/authService';
import { CommentService } from '../../../services/commentiService';
import { Ricetta } from '../../../models/ricetta';
import { Commenti } from '../../../models/comment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../shared/footer/footer';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Footer, Navbar, FormsModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail implements OnInit {
  ricetta: Ricetta = null as unknown as Ricetta;
  videoSafeUrl: SafeResourceUrl = null as unknown as SafeResourceUrl;
  loading: boolean = true;
  commenti: Commenti[] = [];
  nuovoCommento: string = '';
  ratingMedio: number = 0;
  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private commentService: CommentService,
    private statService: StatService,
    public authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.caricaRicetta(id);
    }
  }

  caricaRicetta(id: number) {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (data) => {
        this.ricetta = { ...data };

        this.statService.checkRating(id).subscribe(voted => {
          this.alrVoted = voted;
        });

        this.caricaCommenti(id);
        this.caricaRating(id);
        this.cercaTutorial(data.titolo);
        this.checkIfFavorite(id);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  checkIfFavorite(recipeId: number) {
    this.recipeService.getRecipeFavoritesById(recipeId).subscribe({
      next: (res: boolean) => {
        this.isFavorite = res;
      },
      error: (err) => {
        console.error("Errore nel controllo preferiti", err);
      }
    });
  }

  votoUtente: number = 0;
  hoverRating: number = 0;

  caricaRating(id: number) {
    this.statService.getRatings(id).subscribe({
      next: (res: any) => {
        this.ratingMedio = res;
      },
      error: (err) => console.error('Errore caricamento rating', err)
    });
  }

  setHover(n: number) {
    this.hoverRating = n;
  }

  vota(score: number) {
    if (this.alrVoted || !this.ricetta.id) return;

    this.statService.addRating(this.ricetta.id, score).subscribe({
      next: () => {
        this.votoUtente = score;
        this.alrVoted = true;
        this.caricaRating(this.ricetta.id!);
      },
      error: (err) => {
        if (err.status === 409) {
          this.alrVoted = true;
        }
        console.error("Errore voto:", err);
      }
    });
  }

  alrVoted: boolean = false;
  checkIfRated(recipeId: number) {
    this.statService.checkRating(recipeId).subscribe({
      next: (res: boolean) => {
        this.alrVoted = res;
      },
      error: (err) => console.error("Errore controllo voto:", err)
    })
  }

  aggiungiAiPreferiti() {
    if (this.ricetta && this.ricetta.id) {
      this.recipeService.toggleFavorite(this.ricetta.id).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (err) => console.error("Errore aggiunta preferiti:", err)
      });
    }
  }

  rimuoviDaiPreferiti() {
    if (this.ricetta && this.ricetta.id) {
      this.recipeService.toggleFavorite(this.ricetta.id).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (err) => console.error("Errore rimozione preferiti:", err)
      });
    }
  }

  caricaCommenti(recipeId: number) {
    this.commentService.getCommentsByRecipe(recipeId).subscribe({
      next: (data) => this.commenti = data,
      error: (err) => console.error('Errore caricamento commenti', err)
    });
  }

  inviaCommento() {
    if (!this.nuovoCommento.trim() || !this.ricetta.id) return;

    this.commentService.addComment(this.ricetta.id, this.nuovoCommento).subscribe({
      next: (commento) => {
        this.commenti.unshift(commento);
        this.nuovoCommento = '';
      },
      error: (err) => console.error('Errore invio commento', err)
    });
  }

  eliminaCommento(commento: Commenti) {
    if (!commento.id) return;

    const utenteCorrente = this.authService.getCurrentUser();
    const isAutore = utenteCorrente && commento.authUsername === utenteCorrente.username;
    const isAdmin = this.authService.isAdmin();

    if (isAdmin || isAutore) {
      this.commentService.deleteComment(Number(commento.id)).subscribe({
        next: () => {
          this.rimuoviCommentoDallaLista(commento.id!.toString());
        },
        error: (err) => console.error('Errore eliminazione commento', err)
      });
    }
  }

  cercaTutorial(titolo: string) {
    this.statService.getVideoTutorial(titolo).subscribe({
      next: (response) => {
        if (response.items && response.items.length > 0) {
          const videoId = response.items[0].id.videoId;
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          this.videoSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        }
      },
      error: (err) => console.error('Errore durante la ricerca del video YouTube', err)
    });
  }

  private rimuoviCommentoDallaLista(id: string) {
    this.commenti = this.commenti.filter(c => c.id?.toString() !== id.toString());
  }
}
