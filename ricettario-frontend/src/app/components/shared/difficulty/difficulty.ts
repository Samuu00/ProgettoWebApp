import { Component, computed, input } from '@angular/core';

const LEVELS: Record<string, { n: number; label: string }> = {
  FACILE: { n: 1, label: 'Facile' },
  MEDIO: { n: 2, label: 'Media' },
  MEDIA: { n: 2, label: 'Media' },
  DIFFICILE: { n: 3, label: 'Difficile' },
};

/** Difficolta' come tre puntini limone + etichetta testuale (mai solo colore). */
@Component({
  selector: 'app-difficulty',
  template: `
    <span class="diff">
      <span class="diff__dots" aria-hidden="true">
        @for (i of [1, 2, 3]; track i) { <i [class.on]="i <= level().n"></i> }
      </span>
      {{ level().label }}
    </span>
  `,
})
export class Difficulty {
  readonly value = input<string | undefined>('');
  protected readonly level = computed(() => LEVELS[(this.value() ?? '').toUpperCase()] ?? { n: 0, label: 'N/D' });
}
