import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User } from './user.model';


export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  signUpEmailPasswordBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  signInEmailPasswordBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
  private firebaseApiKey = 'AIzaSyBRTJraJzH0nrJwfzv80HCBT4kD44B0COk';
  private signUpEndpoint = this.signUpEmailPasswordBaseUrl + this.firebaseApiKey;
  private signInEndpoint = this.signInEmailPasswordBaseUrl + this.firebaseApiKey;
  private tokenExpirationTimer: any;

  firebaseAuthErrors = {
    'EMAIL_EXISTS': 'This email address is already in use by another account.',
    'OPERATION_NOT_ALLOWED': 'Password sign-in is disabled for this project.',
    'TOO_MANY_ATTEMPTS_TRY_LATER': 'We have blocked all requests from this device due to unusual activity. Try again later.',
    'EMAIL_NOT_FOUND': 'There is no user record corresponding to this identifier. The user may have been deleted.',
    'INVALID_PASSWORD': 'The password is invalid or the user does not have a password.',
    'USER_DISABLED': 'The user account has been disabled by an administrator.',
    'UNKNOWN_AUTH_ERROR': 'An Error With Authentication Occurred!'
  };

  constructor(private http: HttpClient, private router: Router) {}

  buildAuthPayload(email, password) {
    // Create request body payload
    const authPayload = {
      email: email,  // The email for the user to create.
      password: password,  // The password for the user to create.
      returnSecureToken: true  //Whether or not to return an ID and refresh token. Should always be true.
    };
    return authPayload;
  }

  signup(email: string, password: string) {
    const reqBodyPayload = this.buildAuthPayload(email, password);
    return (this.http.post<AuthResponseData>(this.signUpEndpoint, reqBodyPayload)
      .pipe(
        catchError(this.handleError),
        tap(responseData => {
            this.handleAuthentication(
              responseData.email, responseData.localId,
              responseData.idToken, +responseData.expiresIn
            );
        })
      )
    );
  }

  login(email: string, password: string) {
    const reqBodyPayload = this.buildAuthPayload(email, password);
    return (this.http.post<AuthResponseData>(this.signInEndpoint, reqBodyPayload)
      .pipe(
        catchError(this.handleError),
        tap(responseData => {
            this.handleAuthentication(
              responseData.email, responseData.localId,
              responseData.idToken, +responseData.expiresIn
            );
        })
      )
    );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      console.log('Could not auto-login. User must login manually.')
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const tokenDuration = (
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
      this.autoLogout(tokenDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
    console.log('Logged out user.');
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, userId: string , token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
    const u = new User(email, userId, token, expirationDate);
    this.user.next(u);
    localStorage.setItem('userData', JSON.stringify(u));
    this.autoLogout(expiresIn * 1000);
  }

  private handleError(response: HttpErrorResponse) {
    if (!response.error || !response.error.error) {
      return throwError('Unknown Error');
    }
    let authErrorMsg = '';
    if (this.firebaseAuthErrors.hasOwnProperty(response.error.error.message)) {
      authErrorMsg = this.firebaseAuthErrors[response.error.error.message];
    }
    else {
      authErrorMsg = this.firebaseAuthErrors['UNKNOWN_AUTH_ERROR'];
    }
    return throwError(authErrorMsg);
  }

}
