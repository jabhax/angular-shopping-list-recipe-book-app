import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipes.actions';


export interface State {
    recipes: Recipe[];
}

const initState: State = {
  recipes: []
};

export function RecipeReducer(
  state = initState,
  action: RecipesActions.RECIPE_ACTIONS) {
  switch(action.type) {
    case RecipesActions.SET_RECIPES:
      return { ...state, recipes: [...action.payload] };
    case RecipesActions.FETCH_RECIPES:
      return { ...state };
    case RecipesActions.GET_RECIPE:
      return { ...state };
    case RecipesActions.ADD_RECIPE:
      return { ...state, recipes: [...state.recipes, action.payload] };
    case RecipesActions.UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.recipe
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;
      return { ...state, recipes: updatedRecipes };
    case RecipesActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== action.payload;
        })
      };
    case RecipesActions.ADD_INGREDIENTS_TO_LIST:
      return { ...state };
    default:
      return state;
  }
}
