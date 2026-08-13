import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createLoanRequest,
  getCustomerLoans,
  getPendingLoanRequests,
  getPendingManagerLoanRequests,
  approveLoanRequest,
  rejectLoanRequest,
  approveManagerLoanRequest,
  rejectManagerLoanRequest,
} from "./loanService";

/*
 * CUSTOMER
 *
 * Submit a new loan request.
 */
export const submitLoanRequest = createAsyncThunk(
  "loans/submitLoanRequest",
  async (loanData, { rejectWithValue }) => {
    try {
      return await createLoanRequest(
        loanData
      );
    } catch (error) {
      return rejectWithValue(
        error.message ||
          "Unable to submit loan request."
      );
    }
  }
);


/*
 * CUSTOMER
 *
 * Fetch customer's loans.
 */
export const fetchCustomerLoans =
  createAsyncThunk(
    "loans/fetchCustomerLoans",
    async (customerId, { rejectWithValue }) => {
      try {
        return await getCustomerLoans(
          customerId
        );
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to load customer loans."
        );
      }
    }
  );


/*
 * EMPLOYEE
 *
 * Fetch normal pending loans.
 */
export const fetchPendingLoanRequests =
  createAsyncThunk(
    "loans/fetchPendingLoanRequests",
    async (_, { rejectWithValue }) => {
      try {
        return await getPendingLoanRequests();
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to load pending loan requests."
        );
      }
    }
  );


/*
 * MANAGER
 *
 * Fetch high-value pending loans.
 */
export const fetchPendingManagerLoanRequests =
  createAsyncThunk(
    "loans/fetchPendingManagerLoanRequests",
    async (_, { rejectWithValue }) => {
      try {
        return await getPendingManagerLoanRequests();
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to load Manager loan requests."
        );
      }
    }
  );


/*
 * EMPLOYEE
 *
 * Approve normal loan.
 */
export const approveLoan = createAsyncThunk(
  "loans/approveLoan",
  async (
    { loanId, employeeId },
    { rejectWithValue }
  ) => {
    try {
      return await approveLoanRequest({
        loanId,
        employeeId,
      });
    } catch (error) {
      return rejectWithValue(
        error.message ||
          "Unable to approve loan."
      );
    }
  }
);


/*
 * EMPLOYEE
 *
 * Reject normal loan.
 */
export const rejectLoan = createAsyncThunk(
  "loans/rejectLoan",
  async (
    { loanId, employeeId },
    { rejectWithValue }
  ) => {
    try {
      return await rejectLoanRequest({
        loanId,
        employeeId,
      });
    } catch (error) {
      return rejectWithValue(
        error.message ||
          "Unable to reject loan."
      );
    }
  }
);


/*
 * MANAGER
 *
 * Approve high-value loan.
 */
export const approveManagerLoan =
  createAsyncThunk(
    "loans/approveManagerLoan",
    async (
      { loanId, managerId },
      { rejectWithValue }
    ) => {
      try {
        return await approveManagerLoanRequest({
          loanId,
          managerId,
        });
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to approve Manager loan."
        );
      }
    }
  );


/*
 * MANAGER
 *
 * Reject high-value loan.
 */
export const rejectManagerLoan =
  createAsyncThunk(
    "loans/rejectManagerLoan",
    async (
      { loanId, managerId },
      { rejectWithValue }
    ) => {
      try {
        return await rejectManagerLoanRequest({
          loanId,
          managerId,
        });
      } catch (error) {
        return rejectWithValue(
          error.message ||
            "Unable to reject Manager loan."
        );
      }
    }
  );


const initialState = {
  requests: [],
  customerLoans: [],

  loading: false,
  submitLoading: false,
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

    clearLoanState: (state) => {
      state.requests = [];
      state.customerLoans = [];
      state.loading = false;
      state.submitLoading = false;
      state.actionLoading = false;
      state.error = null;
      state.actionError = null;
      state.successMessage = "";
    },
  },

  extraReducers: (builder) => {
    /*
     * CUSTOMER
     * Submit loan
     */
    builder

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

          state.successMessage =
            "Loan request submitted successfully. Your request is now pending approval.";

          if (action.payload) {
            state.customerLoans.unshift(
              action.payload
            );
          }
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
      );


    /*
     * CUSTOMER
     * Fetch loans
     */
    builder

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

          state.customerLoans =
            action.payload || [];
        }
      )

      .addCase(
        fetchCustomerLoans.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Unable to load customer loans.";
        }
      );


    /*
     * EMPLOYEE
     * Fetch pending loans
     */
    builder

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
            action.payload || [];
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
      );


    /*
     * MANAGER
     * Fetch high-value loans
     */
    builder

      .addCase(
        fetchPendingManagerLoanRequests.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchPendingManagerLoanRequests.fulfilled,
        (state, action) => {
          state.loading = false;

          state.requests =
            action.payload || [];
        }
      )

      .addCase(
        fetchPendingManagerLoanRequests.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Unable to load Manager loan requests.";
        }
      );


    /*
     * EMPLOYEE
     * Approve
     */
    builder

      .addCase(
        approveLoan.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
          state.successMessage = "";
        }
      )

      .addCase(
        approveLoan.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const loanId =
            action.payload?.loanId;

          state.requests =
            state.requests.filter(
              (request) =>
                request.id !== loanId
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
      );


    /*
     * EMPLOYEE
     * Reject
     */
    builder

      .addCase(
        rejectLoan.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
          state.successMessage = "";
        }
      )

      .addCase(
        rejectLoan.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const loanId =
            action.payload?.loanId;

          state.requests =
            state.requests.filter(
              (request) =>
                request.id !== loanId
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


    /*
     * MANAGER
     * Approve
     */
    builder

      .addCase(
        approveManagerLoan.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
          state.successMessage = "";
        }
      )

      .addCase(
        approveManagerLoan.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const loanId =
            action.payload?.loanId;

          state.requests =
            state.requests.filter(
              (request) =>
                request.id !== loanId
            );

          state.successMessage =
            "High-value loan approved successfully.";
        }
      )

      .addCase(
        approveManagerLoan.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.actionError =
            action.payload ||
            "Unable to approve high-value loan.";
        }
      );


    /*
     * MANAGER
     * Reject
     */
    builder

      .addCase(
        rejectManagerLoan.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
          state.successMessage = "";
        }
      )

      .addCase(
        rejectManagerLoan.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const loanId =
            action.payload?.loanId;

          state.requests =
            state.requests.filter(
              (request) =>
                request.id !== loanId
            );

          state.successMessage =
            "High-value loan rejected successfully.";
        }
      )

      .addCase(
        rejectManagerLoan.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.actionError =
            action.payload ||
            "Unable to reject high-value loan.";
        }
      );
  },
});


export const {
  clearLoanError,
  clearLoanSuccess,
  clearLoanState,
} = loanSlice.actions;


export default loanSlice.reducer;