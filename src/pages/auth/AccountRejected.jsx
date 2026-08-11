import { Link, useLocation } from "react-router-dom";

const AccountRejected = () => {
  const location = useLocation();

  const email = location.state?.email;

  return (
    <main>
      <section>
        <div>
          <span>Rejected</span>
        </div>

        <h1>
          Account Request Rejected
        </h1>

        <p>
          Your account registration request has been
          rejected by the administrator.
        </p>

        {email && (
          <p>
            Request submitted for:
            <strong> {email}</strong>
          </p>
        )}

        <p>
          You cannot access the banking system with this
          account at this time.
        </p>

        <p>
          If you believe this was a mistake, please contact
          the bank administrator.
        </p>

        <Link to="/login">
          Back to Login
        </Link>
      </section>
    </main>
  );
};

export default AccountRejected;