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

const makeSerializableProfile = (profile) => {
  if (!profile) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(profile).map(([key, value]) => {
      if (
        value &&
        typeof value.toMillis === "function"
      ) {
        return [key, value.toMillis()];
      }

      return [key, value];
    })
  );
};

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
            emailVerified:
              firebaseUser.emailVerified,
          };

          dispatch(setUser(serializableUser));

          const profile = await getUserProfile(
            firebaseUser.uid
          );

          const serializableProfile =
            makeSerializableProfile(profile);

          dispatch(
            setUserProfile(serializableProfile)
          );

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