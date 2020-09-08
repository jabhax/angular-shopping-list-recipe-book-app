import { Action } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
import * as SLActions from './shopping-list.actions';


export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

export interface AppState {
  shoppingList: State;
}

const initState: State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function ShoppingListReducer(
  state: State = initState,
  action: SLActions.SHOPPING_LIST_ACTIONS) {
  switch (action.type) {
    case SLActions.ADD_INGREDIENT:
      return { ...state, ingredients: [...state.ingredients, action.payload] };
    case SLActions.ADD_INGREDIENTS:
      return { ...state, ingredients: [...state.ingredients, ...action.payload] };
    case SLActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = { ...ingredient, ...action.payload };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
      return {
        ...state, ingredients: updatedIngredients,
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case SLActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ing, ingIndex) =>
          { return ingIndex !== state.editedIngredientIndex; }
        ),
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case SLActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] }
      };
    case SLActions.STOP_EDIT:
      return {
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    default:
      return state;
  }
}
