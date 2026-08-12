import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import transactionReducer from "../features/transactions/transactionSlice";
import registrationRequestsReducer from "../features/registrationRequests/registrationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registrationRequests: registrationRequestsReducer,
    transactions: transactionReducer,
  },
});

export default store;