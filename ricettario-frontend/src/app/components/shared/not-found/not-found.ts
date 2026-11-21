import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="container page nf">
      <div class="tile" aria-hidden="true"><span>404</span></div>
      <h1>Questa pagina non è nel menù</h1>
      <p>L'indirizzo potrebbe essere sbagliato, oppure la pagina è stata spostata.</p>
      <a routerLink="/recipe-list" class="btn btn--primary">Torna alle ricette</a>
    </div>
  `,
  styles: `
    .nf { display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--s-4); padding-block: var(--s-9); }
    .tile { display: grid; place-items: center; width: 10rem; height: 10rem; border-radius: var(--r-xl); background: var(--c-band) var(--tile) center / 40px 40px; box-shadow: var(--sh-3); margin-bottom: var(--s-4); transform: rotate(-4deg); }
    .tile span { font-family: var(--font-display); font-weight: 800; font-size: 2.75rem; color: var(--c-on-accent); background: var(--c-accent); padding: 0 var(--s-3); border-radius: var(--r-md); }
    h1 { font-size: var(--fs-2xl); }
    p { color: var(--c-text-2); max-width: 44ch; }
  `,
})
export class NotFound {}
