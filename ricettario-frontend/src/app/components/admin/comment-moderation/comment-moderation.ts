import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Commenti } from '../../../models/comment';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { CommentService } from '../../../services/commentiService';

@Component({
  selector: 'app-comment-moderation',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Footer],
  templateUrl: './comment-moderation.html',
  styleUrl: './comment-moderation.css'
})
export class CommentModeration implements OnInit {
  commenti: Commenti[] = [];
  paginaCorr: number = 0;
  totaleElementi: number = 0;
  isMenuOpen: boolean = false;
  loading: boolean = true;

  constructor(private commentService: CommentService) {}

  ngOnInit() {
    this.caricaCommenti();
  }

  caricaCommenti(){
    this.loading = true;
    this.commentService.getAllComments().subscribe({
      next: (res) => {
        this.commenti = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento dei commenti', err);
        this.loading = false;
      }
    })
  }

  azioneElimina(id: string | number | any = this.commenti[0].id) {
    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.commenti = this.commenti.filter(c => c.id !== id);
      },
      error: (err) => console.error('Errore durante l\'eliminazione', err)
    });
  }

}
