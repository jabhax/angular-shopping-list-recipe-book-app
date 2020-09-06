import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggingService } from '../logging.service';
import { SharedModule } from '../shared/shared.module';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';



const routes: Routes = [
  { path: '', component: ShoppingListComponent }
]

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [LoggingService]
})
export class ShoppingListModule {

}
