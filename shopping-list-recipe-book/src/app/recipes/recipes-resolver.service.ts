import { Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';

import { Recipe } from './recipe.model';
import * as RecipesActions from './store/recipes.actions';
import * as fromApp from '../store/app.reducer';


@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<fromApp.AppState>,
              private actions$: Actions) {}

  resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const recipes = this.recipesService.getRecipes();
    // if (recipes.length == 0) return this.dataStorageService.fetchRecipes();
    // return recipes;
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => { return recipesState.recipes; }),
      switchMap(recipes => {
        if (recipes.length == 0) {
          this.store.dispatch(new RecipesActions.FetchRecipes());
          return this.actions$.pipe(ofType(RecipesActions.SET_RECIPES), take(1));
        }
        else return of(recipes);
      })
    );
  }
}
