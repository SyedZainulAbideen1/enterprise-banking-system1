import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createDepositRequest,
  getPendingTransactionRequests,
  approveDepositRequest,
  rejectTransactionRequest,
  getCustomerTransactions,
} from "./transactionService";

export const fetchCustomerTransactions =
  createAsyncThunk(
    "transactions/fetchCustomerTransactions",
    async (customerId, { rejectWithValue }) => {
      try {
        return await getCustomerTransactions(
          customerId
        );
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to load transactions."
        );
      }
    }
  );

export const submitDepositRequest =
  createAsyncThunk(
    "transactions/submitDepositRequest",
    async (requestData, { rejectWithValue }) => {
      try {
        return await createDepositRequest(
          requestData
        );
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to submit deposit request."
        );
      }
    }
  );

export const fetchPendingTransactionRequests =
  createAsyncThunk(
    "transactions/fetchPendingTransactionRequests",
    async (_, { rejectWithValue }) => {
      try {
        return await getPendingTransactionRequests();
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to load transaction requests."
        );
      }
    }
  );

export const approveDeposit =
  createAsyncThunk(
    "transactions/approveDeposit",
    async (
      { requestId, employeeId },
      { rejectWithValue }
    ) => {
      try {
        return await approveDepositRequest({
          requestId,
          employeeId,
        });
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to approve deposit request."
        );
      }
    }
  );

export const rejectTransaction =
  createAsyncThunk(
    "transactions/rejectTransaction",
    async (
      { requestId, employeeId },
      { rejectWithValue }
    ) => {
      try {
        return await rejectTransactionRequest({
          requestId,
          employeeId,
        });
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to reject transaction request."
        );
      }
    }
  );

const initialState = {
  items: [],

  requests: [],

  loading: false,

  requestLoading: false,

  processingId: null,

  error: "",

  requestError: "",

  submitSuccess: false,
};

const transactionSlice = createSlice({
  name: "transactions",

  initialState,

  reducers: {
    clearTransactionError: (state) => {
      state.error = "";
      state.requestError = "";
    },

    clearTransactions: (state) => {
      state.items = [];
      state.error = "";
    },

    clearSubmitSuccess: (state) => {
      state.submitSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // CUSTOMER TRANSACTION HISTORY

      .addCase(
        fetchCustomerTransactions.pending,
        (state) => {
          state.loading = true;
          state.error = "";
        }
      )

      .addCase(
        fetchCustomerTransactions.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        }
      )

      .addCase(
        fetchCustomerTransactions.rejected,
        (state, action) => {
          state.loading = false;
          state.items = [];

          state.error =
            action.payload ||
            "Unable to load transactions.";
        }
      )

      // CUSTOMER DEPOSIT REQUEST

      .addCase(
        submitDepositRequest.pending,
        (state) => {
          state.requestLoading = true;
          state.requestError = "";
          state.submitSuccess = false;
        }
      )

      .addCase(
        submitDepositRequest.fulfilled,
        (state) => {
          state.requestLoading = false;
          state.submitSuccess = true;
        }
      )

      .addCase(
        submitDepositRequest.rejected,
        (state, action) => {
          state.requestLoading = false;

          state.requestError =
            action.payload ||
            "Unable to submit deposit request.";
        }
      )

      // EMPLOYEE REQUEST LIST

      .addCase(
        fetchPendingTransactionRequests.pending,
        (state) => {
          state.requestLoading = true;
          state.requestError = "";
        }
      )

      .addCase(
        fetchPendingTransactionRequests.fulfilled,
        (state, action) => {
          state.requestLoading = false;
          state.requests = action.payload;
        }
      )

      .addCase(
        fetchPendingTransactionRequests.rejected,
        (state, action) => {
          state.requestLoading = false;

          state.requestError =
            action.payload ||
            "Unable to load transaction requests.";
        }
      )

      // EMPLOYEE APPROVE

      .addCase(
        approveDeposit.pending,
        (state, action) => {
          state.processingId =
            action.meta.arg.requestId;

          state.requestError = "";
        }
      )

      .addCase(
        approveDeposit.fulfilled,
        (state, action) => {
          state.processingId = null;

          state.requests =
            state.requests.filter(
              (request) =>
                request.id !==
                action.payload.requestId
            );
        }
      )

      .addCase(
        approveDeposit.rejected,
        (state, action) => {
          state.processingId = null;

          state.requestError =
            action.payload ||
            "Unable to approve deposit.";
        }
      )

      // EMPLOYEE REJECT

      .addCase(
        rejectTransaction.pending,
        (state, action) => {
          state.processingId =
            action.meta.arg.requestId;

          state.requestError = "";
        }
      )

      .addCase(
        rejectTransaction.fulfilled,
        (state, action) => {
          state.processingId = null;

          state.requests =
            state.requests.filter(
              (request) =>
                request.id !==
                action.payload.requestId
            );
        }
      )

      .addCase(
        rejectTransaction.rejected,
        (state, action) => {
          state.processingId = null;

          state.requestError =
            action.payload ||
            "Unable to reject transaction request.";
        }
      );
  },
});

export const {
  clearTransactionError,
  clearTransactions,
  clearSubmitSuccess,
} = transactionSlice.actions;

export default transactionSlice.reducer;