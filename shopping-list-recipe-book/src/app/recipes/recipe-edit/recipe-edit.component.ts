import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipe: Recipe;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = (params['id'] != null);
        this.initForm();
      }
    );
  }

  private initForm() {
    this.recipe = (this.editMode) ? this.recipeService.getRecipe(this.id): null;
    let recipeName = (this.recipe) ? this.recipe.name : '';
    let recipeImagePath = (this.recipe) ? this.recipe.imagePath : '';
    let recipeDescription = (this.recipe) ? this.recipe.description : '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      if (this.recipe['ingredients']) {
        for (let i of this.recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(i.name),
              amount: new FormControl(i.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }

  onSubmit() {
    // const recipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']
    // );
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    }
    else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onAddIngredient() {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    // (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  onDeleteAllIngredients() {
    (<FormArray>this.recipeForm.get('ingredients')).clear();
  }

  get ingredientsControls() {
    // return (<FormArray>this.recipeForm.get('ingredients')).controls;
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }
}
