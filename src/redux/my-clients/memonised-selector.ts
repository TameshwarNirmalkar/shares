import { AppState } from '@redux-store/store';
// import { createSelector } from '@reduxjs/toolkit';

export const isLoading = (state: AppState) => state.myClientList.isLoading;



