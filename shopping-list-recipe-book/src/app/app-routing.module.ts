import { NgModule } from  '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from  '@angular/router';

import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren: () => RecipesModule },
  { path: 'shopping-list', loadChildren: () => ShoppingListModule },
  { path: 'auth', loadChildren: () => AuthModule }
  // { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
