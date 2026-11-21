import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Icon, IconName } from '../../shared/icon/icon';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
  template: `
    <div class="admin-head">
      <div class="container">
        <h1>Amministrazione</h1>
        <nav class="segmented tabs" aria-label="Sezioni amministrazione">
          @for (t of tabs; track t.path) {
            <a [routerLink]="t.path" routerLinkActive="is-active" ariaCurrentWhenActive="page"><app-icon [name]="t.icon" [size]="16" /> {{ t.label }}</a>
          }
        </nav>
      </div>
    </div>
    <div class="container page"><router-outlet /></div>
  `,
  styles: `
    .admin-head { padding-top: var(--s-6); border-bottom: 1px solid var(--c-border); background: var(--c-surface); }
    h1 { font-size: var(--fs-2xl); margin-bottom: var(--s-4); }
    .tabs { margin-bottom: -1px; border-radius: var(--r-md) var(--r-md) 0 0; border-bottom: 0; }
    .tabs > a { border-radius: var(--r-sm); }
    @media (max-width: 40rem) {
      .tabs { display: grid; grid-template-columns: 1fr 1fr; width: 100%; margin-bottom: var(--s-4); border-radius: var(--r-md); border-bottom: 1px solid var(--c-border); }
      .tabs > a { justify-content: center; }
    }
  `,
})
export class AdminLayout {
  readonly tabs: { path: string; label: string; icon: IconName }[] = [
    { path: 'dashboard', label: 'Panoramica', icon: 'chart' },
    { path: 'moderation', label: 'Ricette', icon: 'clipboard' },
    { path: 'users', label: 'Utenti', icon: 'users' },
    { path: 'comment-moderation', label: 'Commenti', icon: 'message' },
  ];
}
