import { Component, input } from '@angular/core';
import { Icon } from '../../shared/icon/icon';
import { PASSWORD_RULES } from './password-rules';

/** Layout condiviso delle pagine di accesso: fascia a piastrelle + modulo. */
@Component({
  selector: 'app-auth-shell',
  template: `
    <div class="shell">
      <aside class="band shell__art" aria-hidden="true">
        <p class="shell__quote">{{ quote() }}</p>
      </aside>
      <section class="shell__form">
        <div class="shell__card">
          <h1>{{ heading() }}</h1>
          @if (sub()) { <p class="shell__sub">{{ sub() }}</p> }
          <ng-content />
        </div>
      </section>
    </div>
  `,
  styles: `
    .shell { display: grid; min-height: calc(100dvh - 9rem); }
    .shell__art { background-image: linear-gradient(to top, var(--c-band) 15%, transparent 70%), var(--tile); background-size: auto, 64px 64px; display: flex; align-items: flex-end; padding: var(--s-6) var(--gutter); min-height: 9rem; }
    .shell__quote { font-family: var(--font-display); font-weight: 800; font-size: var(--fs-xl); line-height: 1.1; letter-spacing: -0.02em; color: #fff; max-width: 14ch; text-wrap: balance; }
    .shell__form { display: flex; justify-content: center; padding: var(--s-6) var(--gutter) var(--s-8); }
    .shell__card { width: 100%; max-width: 26rem; }
    h1 { font-size: var(--fs-2xl); }
    .shell__sub { margin-top: var(--s-2); color: var(--c-text-2); }
    @media (min-width: 56rem) {
      .shell { grid-template-columns: 1fr 1fr; }
      .shell__art { min-height: auto; padding: var(--s-8); }
      .shell__quote { font-size: clamp(2.5rem, 1rem + 3vw, 4rem); }
      .shell__form { align-items: center; padding: var(--s-8) var(--s-6); }
    }
  `,
})
export class AuthShell {
  readonly heading = input.required<string>();
  readonly sub = input('');
  readonly quote = input('Il ricettario che si scrive a più mani.');
}

/** Checklist live delle regole password. */
@Component({
  selector: 'app-password-rules',
  imports: [Icon],
  template: `
    <ul class="rules" [id]="id()">
      @for (r of rules; track r.label) {
        <li [class.ok]="r.test(value())">
          <app-icon [name]="r.test(value()) ? 'check' : 'x'" [size]="14" />
          {{ r.label }}<span class="visually-hidden">{{ r.test(value()) ? ': ok' : ': mancante' }}</span>
        </li>
      }
    </ul>
  `,
  styles: `
    .rules { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: var(--s-1) var(--s-3); font-size: var(--fs-xs); color: var(--c-text-3); }
    li { display: flex; align-items: center; gap: var(--s-1); }
    li.ok { color: var(--c-success); font-weight: 650; }
  `,
})
export class PasswordRules {
  readonly value = input('');
  readonly id = input('pw-rules');
  protected readonly rules = PASSWORD_RULES;
}
