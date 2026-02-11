import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/user';

type AuthState = {
  user: User | null;
  initialized: boolean;
};

const initialState: AuthState = {
  user: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.initialized = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.initialized = true;
    },
    setAuthInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
  },
});

export const { setAuth, clearAuth, setAuthInitialized } = authSlice.actions;
export default authSlice.reducer;
