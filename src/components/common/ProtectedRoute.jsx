import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../api/firebaseConfig";
import { getUserProfile } from "../../api/userService";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}) => {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!isMounted) {
          return;
        }

        if (!firebaseUser) {
          setUserProfile(null);
          setLoading(false);
          return;
        }

        try {
          const profile = await getUserProfile(
            firebaseUser.uid
          );

          if (!isMounted) {
            return;
          }

          setUserProfile(profile);
        } catch (error) {
          console.error(
            "Protected route profile error:",
            error
          );

          if (!isMounted) {
            return;
          }

          setUserProfile(null);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <main>
        <p>Checking account access...</p>
      </main>
    );
  }

  if (!auth.currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (!userProfile) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (userProfile.status === "pending") {
    return (
      <Navigate
        to="/registration-pending"
        replace
      />
    );
  }

  if (userProfile.status === "rejected") {
    return (
      <Navigate
        to="/account-rejected"
        replace
      />
    );
  }

  if (userProfile.status !== "active") {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(userProfile.role)
  ) {
    return (
      <main>
        <section>
          <h1>Access Denied</h1>

          <p>
            You do not have permission to access this page.
          </p>

          <p>
            Your current role is:
            <strong> {userProfile.role}</strong>
          </p>
        </section>
      </main>
    );
  }

  return children;
};

export default ProtectedRoute;