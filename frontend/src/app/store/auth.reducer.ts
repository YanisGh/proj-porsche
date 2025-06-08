import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout } from './auth.actions';

export interface AuthState {
  userConnected: boolean;
}

export const initialState: AuthState = {
  userConnected: false,
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state) => ({ ...state, userConnected: true })),
  on(logout, (state) => ({ ...state, userConnected: false }))
);
