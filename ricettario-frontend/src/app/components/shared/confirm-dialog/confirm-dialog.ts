import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

/** Conferma accessibile basata su <dialog> nativo: focus trap, Esc e backdrop gratis. */
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <dialog #dlg class="dialog" (close)="onNativeClose()" (click)="onBackdrop($event)" aria-labelledby="cd-title" aria-describedby="cd-msg">
      <h2 id="cd-title">{{ title() }}</h2>
      <p id="cd-msg">{{ message() }}</p>
      @if (error()) { <p class="alert" role="alert">{{ error() }}</p> }
      <div class="actions">
        <button type="button" class="btn btn--ghost" (click)="cancel.emit()" autofocus>{{ cancelLabel() }}</button>
        <button type="button" class="btn btn--danger" (click)="confirm.emit()" [disabled]="busy()">
          @if (busy()) { <span class="spinner" aria-hidden="true"></span> }
          {{ confirmLabel() }}
        </button>
      </div>
    </dialog>
  `,
  styles: `
    h2 { font-size: var(--fs-lg); }
    p { color: var(--c-text-2); margin-top: var(--s-3); }
    .alert { color: var(--c-danger); }
    .actions { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: var(--s-2); margin-top: var(--s-6); }
  `,
})
export class ConfirmDialog {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly message = input('');
  readonly confirmLabel = input('Elimina');
  readonly cancelLabel = input('Annulla');
  readonly busy = input(false);
  readonly error = input('');
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  constructor() {
    effect(() => {
      const el = this.dlg().nativeElement;
      if (this.open() && !el.open) el.showModal();
      if (!this.open() && el.open) el.close();
    });
  }

  protected onNativeClose(): void {
    if (this.open()) this.cancel.emit();
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === this.dlg().nativeElement) this.cancel.emit();
  }
}
