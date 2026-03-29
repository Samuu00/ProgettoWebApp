import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeModeration } from './recipe-moderation';

describe('RecipeModeration', () => {
  let component: RecipeModeration;
  let fixture: ComponentFixture<RecipeModeration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeModeration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeModeration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
