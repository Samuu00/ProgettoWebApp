import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/shared/navbar/navbar';
import { Footer } from './components/shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <a class="skip-link" href="#main">Salta al contenuto</a>
    <app-navbar />
    <main id="main" tabindex="-1"><router-outlet /></main>
    <app-footer />
  `,
  styles: `:host { display: flex; flex-direction: column; min-height: 100dvh; } main { flex: 1; outline: none; }`,
})
export class App {}
