import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Ricetta } from '../../../models/ricetta';
import { Icon } from '../icon/icon';
import { Difficulty } from '../difficulty/difficulty';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterLink, DecimalPipe, Icon, Difficulty],
  template: `
    <article class="card">
      <div class="card__media">
        @if (recipe().immagineURL) {
          <img [src]="recipe().immagineURL" alt="" [attr.loading]="eager() ? 'eager' : 'lazy'" />
        } @else {
          <div class="card__placeholder"><app-icon name="utensils" [size]="32" /></div>
        }
        @if (rating() > 0) {
          <span class="card__rating" [attr.aria-label]="'Voto medio ' + (rating() | number: '1.1-1')">
            <app-icon name="star" [size]="14" [filled]="true" /> {{ rating() | number: '1.1-1' }}
          </span>
        }
      </div>
      <div class="card__body">
        <span class="chip chip--neutral">{{ recipe().categoria || 'Senza categoria' }}</span>
        <h3><a class="card__link" [routerLink]="['/recipe', recipe().id]">{{ recipe().titolo }}</a></h3>
        <p class="card__meta">
          <span><app-icon name="clock" [size]="16" /> {{ recipe().tempoCottura }} min</span>
          <app-difficulty [value]="recipe().difficolta" />
        </p>
        <p class="card__author">di {{ recipe().autore || 'Chef anonimo' }}</p>
      </div>
      <ng-content />
    </article>
  `,
  styleUrl: './recipe-card.css',
})
export class RecipeCard {
  readonly recipe = input.required<Ricetta>();
  readonly eager = input(false);
  readonly ratingValue = input<number | undefined>(undefined, { alias: 'rating' });
  protected readonly rating = computed(() => this.ratingValue() ?? 0);
}
