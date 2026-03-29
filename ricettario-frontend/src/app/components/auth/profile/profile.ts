import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/authService';
import { RecipeService } from '../../../services/serviziRicetta';
import { Utente } from '../../../models/user';
import { Ricetta } from '../../../models/ricetta';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    Navbar,
    Footer
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  utente: Utente | null = null;
  mieRicette: Ricetta[] = [];
  preferiti: Ricetta[] = [];
  loading: boolean = false;
  nuovoUsername: string = '';
  errorMess: string = '';
  completeMess: string = '';
  isDropdownOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.utente = this.authService.getCurrentUser();
    if (this.utente) {
      this.nuovoUsername = this.utente.username;
      this.caricaDatiProfilo();
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  mostraMessaggio(testo: string) {
    this.completeMess = testo;
    setTimeout(() => {
      this.completeMess = '';
    }, 2000);
  }

  salvaNuovoNome() {
    this.errorMess = '';
    this.completeMess = '';

    if (!this.nuovoUsername || this.nuovoUsername.trim() === '') {
      this.errorMess = "Il nome Chef non può essere vuoto.";
      return;
    }

    if (this.nuovoUsername === this.utente?.username) {
      this.errorMess = "Inserisci un nome diverso da quello attuale.";
      return;
    }

    this.loading = true;
    this.authService.updateProfile(this.utente!.id, this.nuovoUsername).subscribe({
      next: (userAggiornato) => {
        this.utente = userAggiornato;
        this.loading = false;
        this.errorMess = '';
        this.mostraMessaggio('Username aggiornato con successo!');
      },
      error: (err) => {
        this.errorMess = "Errore durante l'aggiornamento dello username";
        this.loading = false;
      }
    });
  }

  caricaDatiProfilo() {
    const username = this.utente?.username;
    if (username) {
      this.recipeService.getRecipes(0, 5, { author: username }).subscribe({
        next: (res) => this.mieRicette = res.content,
        error: (err) => console.error(err)
      });
    }
  }

  eliminaRicetta(recipeId: number) {
    if (confirm('Sei sicuro di voler eliminare questa ricetta?')) {
      this.recipeService.deleteRecipe(recipeId).subscribe(() => {
        this.mieRicette = this.mieRicette.filter(r => r.id !== recipeId);
      });
    }
  }
}
