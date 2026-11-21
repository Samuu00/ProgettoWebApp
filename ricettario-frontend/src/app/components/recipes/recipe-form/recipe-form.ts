import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../../services/serviziRicetta';
import { AuthService } from '../../../services/authService';
import { Difficolta, Ingredienti, Ricetta, Stato } from '../../../models/ricetta';
import { Icon } from '../../shared/icon/icon';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/** "320 g riso" -> {quantita: 320, unitaMis: 'g', name: 'riso'}. Una riga (o virgola) per ingrediente. */
export function parseIngredients(text: string): Ingredienti[] {
  return (text ?? '')
    .split(/[\n\r,]+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(\d+)\s*([a-zA-Zà-ù]*)\s+(.+)$/);
      return m
        ? { quantita: parseInt(m[1], 10), unitaMis: m[2] || 'pz', name: m[3].trim() }
        : { quantita: 1, unitaMis: 'qb', name: line };
    });
}

export function formatIngredients(list: Ingredienti[] | undefined): string {
  return (list ?? []).map((i) => `${i.quantita ?? ''} ${i.unitaMis ?? ''} ${i.name ?? ''}`.replace(/\s+/g, ' ').trim()).join('\n');
}

@Component({
  selector: 'app-recipe-form',
  imports: [ReactiveFormsModule, RouterLink, Icon],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css',
})
export class RecipeForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly recipeService = inject(RecipeService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    category: ['', Validators.required],
    prepTime: [30, [Validators.required, Validators.min(1), Validators.max(1440)]],
    difficulty: [Difficolta.FACILE as string, Validators.required],
    ingredients: ['', Validators.required],
    instructions: ['', Validators.required],
    image: ['', Validators.required],
  });

  readonly difficulties = [
    { value: Difficolta.FACILE, label: 'Facile' },
    { value: Difficolta.MEDIO, label: 'Media' },
    { value: Difficolta.DIFFICILE, label: 'Difficile' },
  ];

  isEditMode = false;
  recipeId?: number;
  loading = false;
  loadError = '';
  saving = false;
  submitted = false;
  errorMessaggio = '';
  imageError = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEditMode = true;
      this.recipeId = id;
      this.caricaDatiRicetta(id);
    }
  }

  invalid(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.imageError = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.imageError = 'Il file deve essere un\'immagine (JPG, PNG, WebP).';
    } else if (file.size > MAX_IMAGE_BYTES) {
      this.imageError = 'L\'immagine supera i 2 MB: scegline una più leggera.';
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ image: reader.result as string });
        this.form.controls.image.markAsTouched();
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  private caricaDatiRicetta(recipeId: number): void {
    this.loading = true;
    this.recipeService
      .getRecipeById(recipeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => {
          const user = this.auth.getCurrentUser();
          if (!(user && r.idAutore === user.id) && !this.auth.isAdmin()) {
            this.router.navigate(['/recipe', recipeId]);
            return;
          }
          this.form.patchValue({
            title: r.titolo,
            description: r.descrizione,
            instructions: r.istruzioni,
            difficulty: (r.difficolta as string) === 'MEDIA' ? Difficolta.MEDIO : r.difficolta,
            category: r.categoria,
            prepTime: r.tempoCottura,
            image: r.immagineURL,
            ingredients: formatIngredients(r.ingredienti),
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.loadError = 'Non è stato possibile caricare la ricetta da modificare.';
        },
      });
  }

  onSubmit(): void {
    this.errorMessaggio = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessaggio = 'Controlla i campi evidenziati.';
      setTimeout(() => document.querySelector<HTMLElement>('form [aria-invalid="true"]')?.focus());
      return;
    }
    const v = this.form.getRawValue();
    const recipeData: Ricetta = {
      id: this.recipeId,
      titolo: v.title.trim(),
      descrizione: v.description.trim(),
      ingredienti: parseIngredients(v.ingredients),
      istruzioni: v.instructions.trim(),
      difficolta: v.difficulty as Difficolta,
      categoria: v.category.trim(),
      tempoCottura: v.prepTime,
      immagineURL: v.image,
      autore: this.auth.getCurrentUser()?.username ?? '',
      dataCreaz: new Date().toISOString(),
      status: Stato.BOZZA,
    };

    this.saving = true;
    const req$ =
      this.isEditMode && this.recipeId
        ? this.recipeService.updateRecipe(this.recipeId, recipeData)
        : this.recipeService.createRecipe(recipeData);
    req$.subscribe({
      next: () => {
        this.saving = false;
        this.submitted = true;
        window.scrollTo({ top: 0 });
      },
      error: () => {
        this.saving = false;
        this.errorMessaggio = this.isEditMode
          ? 'Aggiornamento non riuscito. Riprova tra poco.'
          : 'Pubblicazione non riuscita. Riprova tra poco.';
      },
    });
  }
}
