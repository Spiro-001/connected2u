import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type SessionTokenType = { sessionToken: string; id: string };

interface AuthState {
  sessionToken: SessionTokenType | null;
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
    setToken: (state, action: PayloadAction<SessionTokenType | null>) => {
      state.sessionToken = action.payload;
    },
  },
});

export const { refreshToken, setToken } = authSlice.actions;
export const selectSessionToken = (state: RootState) => state.auth.sessionToken;
export default authSlice.reducer;
