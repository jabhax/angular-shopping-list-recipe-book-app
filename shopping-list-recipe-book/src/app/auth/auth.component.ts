import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import * as AuthActions from './store/auth.actions';
import * as fromApp from '../store/app.reducer';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceHolderDirective, { static: false }) alertHost: PlaceHolderDirective;
  private closeSubscription: Subscription;
  private storeSubscription: Subscription;

  constructor(private cmpFR: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) this.showErrorAlert(this.error);
    });
  }

  ngOnDestroy(): void {
    // If auth component is removed, unsubscribe from programatic component-creation
    if (this.closeSubscription) this.closeSubscription.unsubscribe();
    if (this.storeSubscription) this.storeSubscription.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    const email = form.value.email, password = form.value.password;
    this.isLoading = true;
    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email: email, password: password }));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({ email: email, password: password }));
    }
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
    form.reset();
  }

  onHandleError() {
    this.error = null;
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(msg: string) {
    const alertCmpFactory = this.cmpFR.resolveComponentFactory(AlertComponent);
    const hostVCRef = this.alertHost.vcRef;
    hostVCRef.clear();
    const cmpRef = hostVCRef.createComponent(alertCmpFactory);
    cmpRef.instance.message = msg;
    this.closeSubscription = cmpRef.instance.close.subscribe(() => {
        this.closeSubscription.unsubscribe();
        hostVCRef.clear();
    });
  }
}
