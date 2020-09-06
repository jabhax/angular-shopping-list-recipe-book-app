import { Ingredient } from '../shared/ingredient.model';


const initState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ]
};

export function ShoppingListReducer(state = initState, action) {

}
