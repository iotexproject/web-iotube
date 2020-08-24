import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import application from "./application/reducer";
import multicall from "./multicall/reducer";

const store = configureStore({
  reducer: {
    application,
    multicall,
  },
  middleware: [...getDefaultMiddleware()],
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
