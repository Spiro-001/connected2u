import { configureStore, createSlice } from "@reduxjs/toolkit";
import { authSlice } from "./features/authSlice";

export const store = configureStore({
  reducer: { auth: authSlice.reducer },
});

// store.subscribe(() => console.log(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
