// store/store.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore
} from "redux-persist";
import formReducer from "../features/formSlice";

// Configure persist settings
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, formReducer);

export const store = configureStore({
  reducer: {
    form: persistedReducer, // Use persisted reducer instead of direct reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;