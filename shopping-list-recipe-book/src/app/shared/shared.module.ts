import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert/alert.component';
import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceHolderDirective } from './placeholder/placeholder.directive';


@NgModule({
  declarations: [
    AlertComponent,
    DropdownDirective,
    LoadingSpinnerComponent,
    PlaceHolderDirective
  ],
  imports: [CommonModule],
  exports: [
    AlertComponent,
    CommonModule,
    DropdownDirective,
    LoadingSpinnerComponent,
    PlaceHolderDirective
  ]
})
export class SharedModule {

}
