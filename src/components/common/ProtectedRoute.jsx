import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}) => {
  const location = useLocation();

  const {
    user,
    profile,
    loading,
    initialized,
  } = useSelector((state) => state.auth);

  if (loading || !initialized) {
    return (
      <main>
        <p>Checking account access...</p>
      </main>
    );
  }

  if (!user) {
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

  if (!profile) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (profile.status === "pending") {
    return (
      <Navigate
        to="/registration-pending"
        replace
      />
    );
  }

  if (profile.status === "rejected") {
    return (
      <Navigate
        to="/account-rejected"
        replace
      />
    );
  }

  if (profile.status !== "active") {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(profile.role)
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
            <strong> {profile.role}</strong>
          </p>
        </section>
      </main>
    );
  }

  return children;
};

export default ProtectedRoute;