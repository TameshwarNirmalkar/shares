import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import rootReducer from './rootReducer';


export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware({
        serializableCheck: {
          getEntries: (value: [string, any][]) => value,
          ignoredActions: [],
          warnAfter: 500,
          ignoreState: true,
          ignoreActions: true,
        },
      }).concat([]),
    enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat([])
  })

};

export const store = makeStore();



// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

// optional, but required for refetchOnFocus/refetchOnReconnect/refetchOnMountOrArgChange  etc behaviors
setupListeners(store.dispatch);

