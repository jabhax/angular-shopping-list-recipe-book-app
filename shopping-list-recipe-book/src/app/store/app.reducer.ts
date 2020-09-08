import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from '../auth/store/auth.reducer';
import * as fromRecipes from '../recipes/store/recipes.reducer';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';


export interface AppState {
  recipes: fromRecipes.State;
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
}

export const AppReducer: ActionReducerMap<AppState> = {
  recipes: fromRecipes.RecipeReducer,
  shoppingList: fromShoppingList.ShoppingListReducer,
  auth: fromAuth.AuthReducer
};
