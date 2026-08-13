import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createLoanRequest,
  getCustomerLoans,
  getPendingLoanRequests,
  approveLoanRequest,
  rejectLoanRequest,
} from "./loanService";


export const submitLoanRequest =
  createAsyncThunk(
    "loans/submitLoanRequest",
    async (loanData, thunkAPI) => {
      try {
        return await createLoanRequest(
          loanData
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.message ||
            "Unable to submit loan request."
        );
      }
    }
  );


export const fetchCustomerLoans =
  createAsyncThunk(
    "loans/fetchCustomerLoans",
    async (customerId, thunkAPI) => {
      try {
        return await getCustomerLoans(
          customerId
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.message ||
            "Unable to load customer loans."
        );
      }
    }
  );


export const fetchPendingLoanRequests =
  createAsyncThunk(
    "loans/fetchPendingLoanRequests",
    async (_, thunkAPI) => {
      try {
        return await getPendingLoanRequests();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.message ||
            "Unable to load pending loan requests."
        );
      }
    }
  );


export const approveLoan =
  createAsyncThunk(
    "loans/approveLoan",
    async (
      { loanId, employeeId },
      thunkAPI
    ) => {
      try {
        return await approveLoanRequest({
          loanId,
          employeeId,
        });
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.message ||
            "Unable to approve loan."
        );
      }
    }
  );


export const rejectLoan =
  createAsyncThunk(
    "loans/rejectLoan",
    async (
      { loanId, employeeId },
      thunkAPI
    ) => {
      try {
        return await rejectLoanRequest({
          loanId,
          employeeId,
        });
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.message ||
            "Unable to reject loan."
        );
      }
    }
  );


const initialState = {
  loans: [],

  requests: [],

  submitLoading: false,

  loading: false,

  actionLoading: false,

  error: null,

  actionError: null,

  successMessage: "",
};


const loanSlice = createSlice({
  name: "loans",

  initialState,

  reducers: {
    clearLoanError: (state) => {
      state.error = null;
      state.actionError = null;
    },

    clearLoanSuccess: (state) => {
      state.successMessage = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ------------------------------
      // CUSTOMER SUBMIT
      // ------------------------------

      .addCase(
        submitLoanRequest.pending,
        (state) => {
          state.submitLoading = true;
          state.error = null;
          state.successMessage = "";
        }
      )

      .addCase(
        submitLoanRequest.fulfilled,
        (state, action) => {
          state.submitLoading = false;

          state.loans.unshift(
            action.payload
          );

          state.successMessage =
            "Loan request submitted successfully. Your request is now pending approval.";
        }
      )

      .addCase(
        submitLoanRequest.rejected,
        (state, action) => {
          state.submitLoading = false;

          state.error =
            action.payload ||
            "Unable to submit loan request.";
        }
      )


      // ------------------------------
      // CUSTOMER LOANS
      // ------------------------------

      .addCase(
        fetchCustomerLoans.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchCustomerLoans.fulfilled,
        (state, action) => {
          state.loading = false;
          state.loans =
            action.payload;
        }
      )

      .addCase(
        fetchCustomerLoans.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Unable to load loans.";
        }
      )


      // ------------------------------
      // EMPLOYEE PENDING REQUESTS
      // ------------------------------

      .addCase(
        fetchPendingLoanRequests.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchPendingLoanRequests.fulfilled,
        (state, action) => {
          state.loading = false;

          state.requests =
            action.payload;
        }
      )

      .addCase(
        fetchPendingLoanRequests.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Unable to load pending loan requests.";
        }
      )


      // ------------------------------
      // APPROVE
      // ------------------------------

      .addCase(
        approveLoan.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
        }
      )

      .addCase(
        approveLoan.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.requests =
            state.requests.filter(
              (loan) =>
                loan.id !==
                action.payload.loanId
            );

          state.successMessage =
            "Loan approved successfully.";
        }
      )

      .addCase(
        approveLoan.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.actionError =
            action.payload ||
            "Unable to approve loan.";
        }
      )


      // ------------------------------
      // REJECT
      // ------------------------------

      .addCase(
        rejectLoan.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
        }
      )

      .addCase(
        rejectLoan.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.requests =
            state.requests.filter(
              (loan) =>
                loan.id !==
                action.payload.loanId
            );

          state.successMessage =
            "Loan rejected successfully.";
        }
      )

      .addCase(
        rejectLoan.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.actionError =
            action.payload ||
            "Unable to reject loan.";
        }
      );
  },
});


export const {
  clearLoanError,
  clearLoanSuccess,
} = loanSlice.actions;


export default loanSlice.reducer;