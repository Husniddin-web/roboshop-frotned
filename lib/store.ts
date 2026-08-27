import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./features/cartSlice";
import authReducer from "./features/authSlice";
import userAuthReducer from "./features/userAuthSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  userAuth: userAuthReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth", "userAuth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
