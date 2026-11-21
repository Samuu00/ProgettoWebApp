import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="foot">
      <div class="container foot__inner">
        <p><strong>Ricettario</strong> · © {{ anno }} RicetteFacili</p>
        <nav aria-label="Link secondari">
          <a routerLink="/about-page">Chi siamo</a>
          <a routerLink="/privacy-page">Privacy</a>
        </nav>
      </div>
    </footer>
  `,
  styles: `
    .foot { border-top: 1px solid var(--c-border); background: var(--c-surface); color: var(--c-text-2); font-size: var(--fs-sm); }
    .foot__inner { display: flex; flex-wrap: wrap; gap: var(--s-3) var(--s-5); align-items: center; justify-content: space-between; padding-block: var(--s-5); }
    nav { display: flex; gap: var(--s-5); }
    a { color: var(--c-text-2); font-weight: 600; text-decoration: none; }
    a:hover { color: var(--c-primary); text-decoration: underline; }
  `,
})
export class Footer {
  anno = new Date().getFullYear();
}
