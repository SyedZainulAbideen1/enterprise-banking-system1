import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
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

const initialState = {
  items: [],
  loading: false,
  error: "",
};

const transactionSlice = createSlice({
  name: "transactions",

  initialState,

  reducers: {
    clearTransactionError: (state) => {
      state.error = "";
    },

    clearTransactions: (state) => {
      state.items = [];
      state.error = "";
    },
  },

  extraReducers: (builder) => {
    builder

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
      );
  },
});

export const {
  clearTransactionError,
  clearTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;