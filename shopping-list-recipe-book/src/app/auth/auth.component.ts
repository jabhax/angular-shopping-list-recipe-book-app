import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AlertComponent } from '../shared/alert/alert.component';
import { AuthService, AuthResponseData } from './auth.service';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceHolderDirective, { static: false }) alertHost: PlaceHolderDirective;
  private closeSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private cmpFR: ComponentFactoryResolver) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    const email = form.value.email, password = form.value.password;
    this.isLoading = true;

    let authObservable: Observable<AuthResponseData>;
    authObservable = ((this.isLoginMode) ?
      this.authService.login(email, password) :
      this.authService.signup(email, password)
    );

    authObservable.subscribe(
      (responseData) => {
        console.log('[AUTH][authObservable RESPONSE-DATA]:\n', responseData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      (errorMessage) => {
        console.log('[AUTH][authObservable RESPONSE-ERROR]:\n', errorMessage);
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    );
    form.reset();
  }

  onHandleError() {
    this.error = null;
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

  ngOnDestroy(): void {
    // If auth component is removed, unsubscribe from programatic component-creation
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }
}
