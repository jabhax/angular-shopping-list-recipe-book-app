import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';


@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'Test Recipe',
      'This is just a test.',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [
        new Ingredient('Test Ing1', 3),
        new Ingredient('Test Ing2', 1),
        new Ingredient('Test Ing3', 4)
      ]
    ),
    new Recipe(
      'Burger',
      'Simple recipe for burgers.',
      'https://natashaskitchen.com/wp-content/uploads/2019/04/Best-Burger-5.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1),
        new Ingredient('Tomatoe', 2),
        new Ingredient('Lettuce', 1),
        new Ingredient('Onion', 1),
        new Ingredient('Cheese', 1)
      ]
    ),
    new Recipe(
      'Scrambled Eggs',
      'Simple recipe for scrambled eggs.',
      'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimg1.cookinglight.timeinc.net%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fmedium_2x%2Fpublic%2Fimage%2F2017%2F01%2Fmain%2Fcreamy-soft-scrambled-eggs.jpg%3Fitok%3D42x9Mojh',
      [
        new Ingredient('Eggs', 2),
        new Ingredient('Chives', 2),
        new Ingredient('Salt', 3),
        new Ingredient('Pepper', 3)
      ]
    )
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  onAddIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
