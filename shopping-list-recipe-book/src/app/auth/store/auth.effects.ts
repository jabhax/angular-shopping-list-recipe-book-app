import { Actions, ofType, Effect } from '@ngrx/effects';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';


/*** Authentication Response Interface (data-structure for response data) ***/

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  signUpEmailPasswordBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  signInEmailPasswordBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
  private signUpEndpoint = this.signUpEmailPasswordBaseUrl + environment.firebaseAPIKey;
  private signInEndpoint = this.signInEmailPasswordBaseUrl + environment.firebaseAPIKey;
  private tokenExpirationTimer: any;


  /*** Helper func to build request payload ***/

  buildAuthPayload(email, password) {
    // Create request body payload
    const authPayload = {
      email: email,  // The email for the user to create.
      password: password,  // The password for the user to create.
      returnSecureToken: true  //Whether or not to return an ID and refresh token. Should always be true.
    };
    return authPayload;
  }

  /*** Authentication-Handler ***/

  private handleAuthentication(email: string, userId: string , token: string, expiresIn: number) {
      const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
      const u = new User(email, userId, token, expirationDate);
      localStorage.setItem('userData', JSON.stringify(u));
      return new AuthActions.AuthenticateSuccess({
        email: email, userId: userId, token: token,
        expirationDate: expirationDate, redirect: true
      });
  }

  /*** (Authentication) Error-Handler ***/

  private handleError(response: HttpErrorResponse) {
    if (!response.error || !response.error.error) {
      return of(new AuthActions.AuthenticateFail('Unknown Error'));
    }
    let FIREBASE_AUTH_ERRORS = {
      'EMAIL_EXISTS': (
        'This email address is already in use by another account.'
      ),
      'OPERATION_NOT_ALLOWED': (
        'Password sign-in is disabled for this project.'
      ),
      'TOO_MANY_ATTEMPTS_TRY_LATER': (
        'We have blocked all requests from this device due to unusual ' +
        'activity. Try again later.'
      ),
      'EMAIL_NOT_FOUND': (
        'There is no user record corresponding to this identifier. The ' +
        'user may have been deleted.'
      ),
      'INVALID_PASSWORD': (
        'The password is invalid or the user does not have a password.'
      ),
      'USER_DISABLED': (
        'The user account has been disabled by an administrator.'
      ),
      'UNKNOWN_AUTH_ERROR': (
        'An Error With Authentication Occurred!'
      )
    };
    let errorMsg = (
      FIREBASE_AUTH_ERRORS.hasOwnProperty(response.error.error.message) ?
      FIREBASE_AUTH_ERRORS[response.error.error.message] :
      FIREBASE_AUTH_ERRORS['UNKNOWN_AUTH_ERROR']
    );
    return of(new AuthActions.AuthenticateFail(errorMsg));
  }

  /*** AUTH SIGNUP / SIGNUP START ***/

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap(
      (signupAction: AuthActions.SignupStart) => {
        const reqBodyPayload = this.buildAuthPayload(signupAction.payload.email, signupAction.payload.password);
        return (this.http.post<AuthResponseData>(this.signUpEndpoint, reqBodyPayload).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
          }),
          catchError(this.handleError)
        ));
      }
    )
  );

  /*** AUTH LOGIN / LOGIN START ***/

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      const reqBodyPayload = this.buildAuthPayload(authData.payload.email, authData.payload.password);
      return (this.http.post<AuthResponseData>(this.signInEndpoint, reqBodyPayload)).pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000);
        }),
        map(resData => {
          return this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }),
        catchError(this.handleError)
      );
    }),
  );

  /*** AUTH REDIRECT / AUTH SUCCESS ***/

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) this.router.navigate(['/']);
    })
  );

  /*** AUTO LOGIN ***/

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        console.log('[AUTH]: Could not auto-login. User must login manually.')
        return { type: 'DUMMY_VALUE' };
      }
      const loadedUser = new User(
        userData.email, userData.id, userData._token,
        new Date(userData._tokenExpirationDate)
      );
      if (loadedUser.token) {
        const tokenDuration = (
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime()
        );
        this.authService.setLogoutTimer(tokenDuration);
        return (new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
        }));
      }
      return { type: 'DUMMY_VALUE' };
    })
  );

  /*** AUTH LOGOUT / LOGOUT ***/

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  /*** CONSTRUCTOR / INJECTED SERVICES ***/

  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) {}
}
