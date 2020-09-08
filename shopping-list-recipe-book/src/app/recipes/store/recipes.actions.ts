import { Action } from '@ngrx/store';

import { Recipe } from '../recipe.model';


export const SET_RECIPES = '[Recipes] Set Recipes';
export const FETCH_RECIPES = '[Recipes] Fetch Recipes';
export const STORE_RECIPES = '[Recipes] Store Recipes';
export const GET_RECIPE = '[Recipes] Get Recipe';
export const ADD_RECIPE = '[Recipes] Add Recipe';
export const UPDATE_RECIPE = '[Recipes] Update Recipe';
export const DELETE_RECIPE = '[Recipes] Delete Recipe';
export const ADD_INGREDIENTS_TO_LIST = '[Recipes] Add Ingredients to Shopping List';


export class SetRecipes implements Action {
  readonly type = SET_RECIPES;
  constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;
}

export class StoreRecipes implements Action {
  readonly type = STORE_RECIPES;
}

export class GetRecipe implements Action {
  readonly type = GET_RECIPE;
}

export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;
  constructor(public payload: Recipe) {}
}

export class UpdateRecipe implements Action {
  readonly type = UPDATE_RECIPE;
  constructor(public payload: { index: number, recipe: Recipe }) {}
}

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;
  constructor(public payload: number) {}
}

export class AddIngredientsToList implements Action {
  readonly type = ADD_INGREDIENTS_TO_LIST;
}

export type RECIPE_ACTIONS = (
  SetRecipes | FetchRecipes | StoreRecipes | GetRecipe | AddRecipe |
  UpdateRecipe | DeleteRecipe | AddIngredientsToList
);
