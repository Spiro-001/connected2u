import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AuthState {
  sessionToken: string | null;
}

const initialState: AuthState = {
  sessionToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    refreshToken: (state) => {
      // GET NEW SESSION TOKEN
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.sessionToken = action.payload;
    },
  },
});

export const { refreshToken, setToken } = authSlice.actions;
export const selectSessionToken = (state: RootState) => state.auth.sessionToken;
export default authSlice.reducer;
