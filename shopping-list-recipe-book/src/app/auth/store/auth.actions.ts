import { Action } from '@ngrx/store';


export const LOGIN_START = '[AUTH] Login Start';
export const AUTH_SUCCESS = '[Auth] Login';
export const AUTH_FAIL = '[Auth] Login Fail';
export const SIGNUP_START = '[Auth] Signup Start';
export const LOGOUT = '[Auth] Logout';
export const AUTO_LOGIN = '[Auth Auto Login]';
export const CLEAR_ERROR = '[Auth] Clear Error';


export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: { email: string, password: string }) {}
}

export class AuthenticateSuccess implements Action {
  readonly type = AUTH_SUCCESS;
  constructor(public payload: {
    email: string;
    userId: string;
    token: string;
    expirationDate: Date;
    redirect: boolean;
  }) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTH_FAIL;
  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: { email: string, password: string }) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export type AUTH_ACTIONS = (
  AuthenticateSuccess | Logout | LoginStart | AuthenticateFail | SignupStart |
  AutoLogin | ClearError
);
