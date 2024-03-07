import { AppState } from '@redux-store/store';
import { createSelector } from '@reduxjs/toolkit';

const loadingState = (state: AppState) => state.allHistory.isLoading;
export const selectedLoading = createSelector([loadingState], a => a);


