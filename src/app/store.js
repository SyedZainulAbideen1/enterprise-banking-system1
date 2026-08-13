import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import transactionReducer from "../features/transactions/transactionSlice";
import registrationRequestsReducer from "../features/registrationRequests/registrationSlice";
import loanReducer from "../features/loans/loanSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registrationRequests: registrationRequestsReducer,
    transactions: transactionReducer,
    loans: loanReducer,
  },
});

export default store;