import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectUserConnected = createSelector(
  selectAuthState,
  (state: AuthState) => state.userConnected
);
