import { AppState } from '@redux-store/store';

export const loadingState = (state: AppState) => state.allHistory.isLoading;
// export const selectedLoading = createSelector([loadingState], a => a);


