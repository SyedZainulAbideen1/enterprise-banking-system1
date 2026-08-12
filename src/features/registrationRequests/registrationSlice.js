import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getPendingRegistrationRequests,
  approveRegistrationRequest,
  rejectRegistrationRequest,
} from "./registrationService";

export const fetchPendingRegistrationRequests =
  createAsyncThunk(
    "registrationRequests/fetchPending",
    async (_, { rejectWithValue }) => {
      try {
        return await getPendingRegistrationRequests();
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to load registration requests."
        );
      }
    }
  );

export const approveRegistration =
  createAsyncThunk(
    "registrationRequests/approve",
    async ({ requestId, uid }, { rejectWithValue }) => {
      try {
        return await approveRegistrationRequest({
          requestId,
          uid,
        });
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to approve registration request."
        );
      }
    }
  );

export const rejectRegistration =
  createAsyncThunk(
    "registrationRequests/reject",
    async ({ requestId, uid }, { rejectWithValue }) => {
      try {
        return await rejectRegistrationRequest({
          requestId,
          uid,
        });
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to reject registration request."
        );
      }
    }
  );

const initialState = {
  requests: [],
  loading: false,
  processingId: null,
  error: "",
};

const registrationSlice = createSlice({
  name: "registrationRequests",
  initialState,
  reducers: {
    clearRegistrationError: (state) => {
      state.error = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchPendingRegistrationRequests.pending,
        (state) => {
          state.loading = true;
          state.error = "";
        }
      )

      .addCase(
        fetchPendingRegistrationRequests.fulfilled,
        (state, action) => {
          state.loading = false;
          state.requests = action.payload;
        }
      )

      .addCase(
        fetchPendingRegistrationRequests.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Unable to load registration requests.";
        }
      )

      .addCase(
        approveRegistration.pending,
        (state, action) => {
          state.processingId =
            action.meta.arg.requestId;
          state.error = "";
        }
      )

      .addCase(
        approveRegistration.fulfilled,
        (state, action) => {
          state.processingId = null;

          state.requests = state.requests.filter(
            (request) =>
              request.id !== action.payload.requestId
          );
        }
      )

      .addCase(
        approveRegistration.rejected,
        (state, action) => {
          state.processingId = null;
          state.error =
            action.payload ||
            "Unable to approve registration request.";
        }
      )

      .addCase(
        rejectRegistration.pending,
        (state, action) => {
          state.processingId =
            action.meta.arg.requestId;
          state.error = "";
        }
      )

      .addCase(
        rejectRegistration.fulfilled,
        (state, action) => {
          state.processingId = null;

          state.requests = state.requests.filter(
            (request) =>
              request.id !== action.payload.requestId
          );
        }
      )

      .addCase(
        rejectRegistration.rejected,
        (state, action) => {
          state.processingId = null;
          state.error =
            action.payload ||
            "Unable to reject registration request.";
        }
      );
  },
});

export const {
  clearRegistrationError,
} = registrationSlice.actions;

export default registrationSlice.reducer;