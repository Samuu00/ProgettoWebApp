import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../../services/serviziRicetta';
import { AuthService } from '../../../services/authService';
import { Difficolta, Ingredienti, Ricetta, Stato } from '../../../models/ricetta';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    Navbar,
    Footer
  ],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css',
})
export class RecipeForm implements OnInit {
  recipeForm!: FormGroup;
  isEditMode: boolean = false;
  recipeId?: number;
  errorMessaggio: string = '';
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  isDiffOpen = false;

  constructor(private fb: FormBuilder,
    private recipeService: RecipeService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.recipeId = +id;
      this.caricaDatiRicetta(this.recipeId);
    }
  }

  private initForm() {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      ingredients: ['', Validators.required],
      instructions: ['', Validators.required],
      difficulty: ['EASY', Validators.required],
      category: ['', Validators.required],
      prepTime: [30, [Validators.required, Validators.min(1)]],
      image: [null, [Validators.required]]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreview = base64String;
        this.recipeForm.patchValue({ image: base64String });
      };
      reader.readAsDataURL(file);
    }
  }

  toggleDifficulty() {
    this.isDiffOpen = !this.isDiffOpen;
  }

  selectDifficulty(val: string) {
    this.recipeForm.patchValue({ difficulty: val });
    this.isDiffOpen = false;
  }

  getDiffLabel() {
    const val = this.recipeForm.get('difficulty')?.value;
    switch(val) {
      case 'EASY': return '🟢 Facile';
      case 'MEDIUM': return '🟡 Media';
      case 'HARD': return '🔴 Difficile';
      default: return 'Seleziona';
    }
  }

  caricaDatiRicetta(recipeId: number) {
    this.recipeService.getRecipeById(recipeId).subscribe({
      next: (ricetta) => {
        const user = this.authService.getCurrentUser();
        const isAutore = user && ricetta.idAutore === user.id;
        const isAdmin = this.authService.isAdmin();

        if (!isAutore && !isAdmin) {
          this.router.navigate(['/dashboard']);
          return;
        }

        this.recipeForm.patchValue({
          title: ricetta.titolo,
          description: ricetta.descrizione,
          instructions: ricetta.istruzioni,
          difficulty: this.reverseMapDifficolta(ricetta.difficolta),
          category: ricetta.categoria,
          prepTime: ricetta.tempoCottura,
          image: ricetta.immagineURL,
          ingredients: this.formatIngredients(ricetta.ingredienti)
        });
        if (ricetta.immagineURL) {
          this.imagePreview = ricetta.immagineURL;
        }
      },
      error: () => this.router.navigate(['/dashboard'])
    });
  }

  onSubmit() {
    this.errorMessaggio = '';
    if (this.recipeForm.valid) {
      const user = this.authService.getCurrentUser();
      if (!user?.id) {
        this.errorMessaggio = "Effettua il login per pubblicare";
        return;
      }

      const recipeData: Ricetta = {
        id: this.recipeId,
        titolo: this.recipeForm.value.title,
        descrizione: this.recipeForm.value.description,
        ingredienti: this.parseIngredients(this.recipeForm.value.ingredients),
        istruzioni: this.recipeForm.value.instructions,
        difficolta: this.mapDifficolta(this.recipeForm.value.difficulty) as Difficolta,
        categoria: this.recipeForm.value.category,
        tempoCottura: this.recipeForm.value.prepTime,
        immagineURL: this.recipeForm.value.image,
        idAutore: user.id,
        autore: user.username || 'Anonimo',
        dataCreaz: new Date().toISOString(),
        status: Stato.BOZZA
      };

      if (this.isEditMode && this.recipeId) {
        this.recipeService.updateRecipe(this.recipeId, recipeData).subscribe({
          next: () => this.router.navigate(['/recipe-list']),
          error: () => this.errorMessaggio = 'Errore durante l\'aggiornamento.'
        });
      } else {
        this.recipeService.createRecipe(recipeData).subscribe({
          next: () => this.router.navigate(['/recipe-list']),
          error: () => this.errorMessaggio = 'Errore durante la pubblicazione.'
        });
      }
    } else {
      this.errorMessaggio = 'Compila correttamente tutti i campi.';
    }
  }

  private mapDifficolta(diff: string): string {
    const mapping: { [key: string]: string } = {
      'EASY': 'FACILE',
      'MEDIUM': 'MEDIO',
      'HARD': 'DIFFICILE'
    };
    return mapping[diff] || 'FACILE';
  }

  private reverseMapDifficolta(diff: string): string {
    const mapping: { [key: string]: string } = {
      'FACILE': 'EASY',
      'MEDIO': 'MEDIUM',
      'MEDIA': 'MEDIUM',
      'DIFFICILE': 'HARD'
    };
    return mapping[diff] || 'EASY';
  }

  private parseIngredients(ingString: string): Ingredienti[] {
    if (!ingString) return [];
    if (Array.isArray(ingString)) return ingString;
    return ingString.split(/[\n\r,]+/).filter(line => line.trim() !== '').map(line => {
      const trimmedLine = line.trim();
      const match = trimmedLine.match(/^(\d+)\s*([a-zA-Z]*)\s+(.*)$/);
      if (match) {
        return {
          quantita: parseInt(match[1], 10),
          unitaMis: match[2] || 'pz',
          name: match[3],
          carboidrati: 0, grassi: 0, proteine: 0
        };
      }
      return {
        name: trimmedLine,
        quantita: 1,
        unitaMis: 'qb',
        carboidrati: 0, grassi: 0, proteine: 0
      };
    });
  }

  private formatIngredients(ingredienti: any[]): string {
    if (!ingredienti || ingredienti.length === 0) return '';
    return ingredienti.map(ing => {
      const q = ing.quantita || '';
      const u = ing.unitaMis || '';
      const n = ing.name || '';
      return `${q} ${u} ${n}`.trim();
    }).join('\n');
  }
}
