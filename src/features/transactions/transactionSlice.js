import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createDepositRequest,
  createWithdrawalRequest,
  getPendingTransactionRequests,
  approveDepositRequest,
  approveWithdrawalRequest,
  rejectTransactionRequest,
  getCustomerTransactions,
} from "./transactionService";

/*
 * ==================================================
 * CUSTOMER TRANSACTION HISTORY
 * ==================================================
 */

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


/*
 * ==================================================
 * CUSTOMER DEPOSIT REQUEST
 * ==================================================
 */

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


/*
 * ==================================================
 * CUSTOMER WITHDRAWAL REQUEST
 * ==================================================
 */

export const submitWithdrawalRequest =
  createAsyncThunk(
    "transactions/submitWithdrawalRequest",
    async (requestData, { rejectWithValue }) => {
      try {
        return await createWithdrawalRequest(
          requestData
        );
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to submit withdrawal request."
        );
      }
    }
  );


/*
 * ==================================================
 * EMPLOYEE REQUEST LIST
 * ==================================================
 */

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


/*
 * ==================================================
 * EMPLOYEE APPROVE DEPOSIT
 * ==================================================
 */

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


/*
 * ==================================================
 * EMPLOYEE APPROVE WITHDRAWAL
 * ==================================================
 */

export const approveWithdrawal =
  createAsyncThunk(
    "transactions/approveWithdrawal",
    async (
      { requestId, employeeId },
      { rejectWithValue }
    ) => {
      try {
        return await approveWithdrawalRequest({
          requestId,
          employeeId,
        });
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to approve withdrawal request."
        );
      }
    }
  );


/*
 * ==================================================
 * EMPLOYEE REJECT
 * ==================================================
 */

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


/*
 * ==================================================
 * INITIAL STATE
 * ==================================================
 */

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


/*
 * ==================================================
 * SLICE
 * ==================================================
 */

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

      /*
       * ==============================================
       * CUSTOMER TRANSACTION HISTORY
       * ==============================================
       */

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


      /*
       * ==============================================
       * CUSTOMER DEPOSIT REQUEST
       * ==============================================
       */

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


      /*
       * ==============================================
       * CUSTOMER WITHDRAWAL REQUEST
       * ==============================================
       */

      .addCase(
        submitWithdrawalRequest.pending,
        (state) => {
          state.requestLoading = true;
          state.requestError = "";
          state.submitSuccess = false;
        }
      )

      .addCase(
        submitWithdrawalRequest.fulfilled,
        (state) => {
          state.requestLoading = false;
          state.submitSuccess = true;
        }
      )

      .addCase(
        submitWithdrawalRequest.rejected,
        (state, action) => {
          state.requestLoading = false;

          state.requestError =
            action.payload ||
            "Unable to submit withdrawal request.";
        }
      )


      /*
       * ==============================================
       * EMPLOYEE REQUEST LIST
       * ==============================================
       */

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


      /*
       * ==============================================
       * EMPLOYEE APPROVE DEPOSIT
       * ==============================================
       */

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


      /*
       * ==============================================
       * EMPLOYEE APPROVE WITHDRAWAL
       * ==============================================
       */

      .addCase(
        approveWithdrawal.pending,
        (state, action) => {
          state.processingId =
            action.meta.arg.requestId;

          state.requestError = "";
        }
      )

      .addCase(
        approveWithdrawal.fulfilled,
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
        approveWithdrawal.rejected,
        (state, action) => {
          state.processingId = null;

          state.requestError =
            action.payload ||
            "Unable to approve withdrawal.";
        }
      )


      /*
       * ==============================================
       * EMPLOYEE REJECT
       * ==============================================
       */

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


/*
 * ==================================================
 * ACTIONS
 * ==================================================
 */

export const {
  clearTransactionError,
  clearTransactions,
  clearSubmitSuccess,
} = transactionSlice.actions;


export default transactionSlice.reducer;