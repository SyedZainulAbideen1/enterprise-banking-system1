import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../api/firebaseConfig";
import { getUserProfile } from "./authService";

import {
  setAuthLoading,
  setUser,
  setUserProfile,
  setAuthInitialized,
  setAuthError,
  clearAuth,
} from "./authSlice";

const AuthListener = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthLoading(true));

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (!firebaseUser) {
            dispatch(clearAuth());
            return;
          }

          /*
           * Firebase UserImpl is a non-serializable object.
           * Redux should only receive plain serializable data.
           */
          const serializableUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            emailVerified: firebaseUser.emailVerified,
          };

          dispatch(setUser(serializableUser));

          const profile = await getUserProfile(
            firebaseUser.uid
          );

          dispatch(setUserProfile(profile));
          dispatch(setAuthError(null));
        } catch (error) {
          console.error(
            "Authentication state error:",
            error
          );

          dispatch(
            setAuthError(
              error.message ||
                "Unable to load authentication state."
            )
          );

          dispatch(setUserProfile(null));
        } finally {
          dispatch(setAuthLoading(false));
          dispatch(setAuthInitialized(true));
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return children;
};

export default AuthListener;