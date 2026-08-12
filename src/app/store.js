import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import registrationRequestsReducer from "../features/registrationRequests/registrationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registrationRequests: registrationRequestsReducer,
  },
});

export default store;