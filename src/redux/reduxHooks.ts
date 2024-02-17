import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux';
import type { AppState, AppStore } from './store';

export type TDispatch = ThunkDispatch<AppState, void, UnknownAction>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = (): TDispatch => useDispatch<TDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const useAppStore: () => AppStore = useStore;
