import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from  '@angular/router';

import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared/shared.module';


const routes: Routes = [{ path: '', component: AuthComponent }];

@NgModule({
  declarations: [AuthComponent],
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class AuthModule {}
