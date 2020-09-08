import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from './recipes.actions';


@Injectable()
export class RecipesEffects {
  DB_URL = 'https://angular-recipe-shopping-app.firebaseio.com/';

  // private recipes: Recipe[] = [
  //   new Recipe('Test Recipe', 'This is just a test.',
  //              'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
  //              [new Ingredient('Test Ing1', 3), new Ingredient('Test Ing2', 1), new Ingredient('Test Ing3', 4)]),
  //   new Recipe('Burger', 'Simple recipe for burgers.',
  //              'https://natashaskitchen.com/wp-content/uploads/2019/04/Best-Burger-5.jpg',
  //              [new Ingredient('Buns', 2), new Ingredient('Meat', 1), new Ingredient('Tomatoe', 2),
  //               new Ingredient('Lettuce', 1), new Ingredient('Onion', 1), new Ingredient('Cheese', 1)]),
  //   new Recipe('Scrambled Eggs', 'Simple recipe for scrambled eggs.',
  //              'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimg1.cookinglight.timeinc.net%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fmedium_2x%2Fpublic%2Fimage%2F2017%2F01%2Fmain%2Fcreamy-soft-scrambled-eggs.jpg%3Fitok%3D42x9Mojh',
  //              [new Ingredient('Eggs', 2), new Ingredient('Chives', 2), new Ingredient('Salt', 3), new Ingredient('Pepper', 3)])
  // ];


  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(this.DB_URL + 'recipes.json');
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe, ingredients: recipe.ingredients ? recipe.ingredients: []
        };
      })
    }),
    map(recipes => { return new RecipesActions.SetRecipes(recipes); })
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(this.DB_URL + 'recipes.json', recipesState.recipes);
    })
  );

  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) {}
}
