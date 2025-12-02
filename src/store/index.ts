import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import highlightsReducer from "./slices/highlightsSlice";
import filtersReducer from "./slices/filtersSlice";
import favoritesReducer from "./slices/favoritesSlice";
import preferencesReducer from "./slices/preferencesSlice";
import { apiSlice } from "./slices/apiSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    highlights: highlightsReducer,
    filters: filtersReducer,
    favorites: favoritesReducer,
    preferences: preferencesReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
