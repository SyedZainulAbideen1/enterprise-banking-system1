import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },

    setAuthInitialized: (state, action) => {
      state.initialized = action.payload;
    },

    setAuthError: (state, action) => {
      state.error = action.payload;
    },

    clearAuth: (state) => {
      state.user = null;
      state.profile = null;
      state.loading = false;
      state.initialized = true;
      state.error = null;
    },
  },
});

export const {
  setAuthLoading,
  setUser,
  setUserProfile,
  setAuthInitialized,
  setAuthError,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;