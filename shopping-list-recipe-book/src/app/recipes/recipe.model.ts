import { Ingredient } from '../shared/ingredient.model';


export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[]

  constructor(n: string, desc: string, i: string, ingredients: Ingredient[]) {
    this.name = n;
    this.description = desc;
    this.imagePath = i;
    this.ingredients = ingredients;
  }
}
