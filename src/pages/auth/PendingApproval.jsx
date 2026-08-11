import { Link, useLocation } from "react-router-dom";

const RegistrationPending = () => {
  const location = useLocation();

  const email = location.state?.email;

  return (
    <main>
      <section>
        <div>
          <span>Pending</span>
        </div>

        <h1>
          Account Request Submitted
        </h1>

        <p>
          Your registration request has been submitted
          successfully.
        </p>

        {email && (
          <p>
            Request submitted for:
            <strong> {email}</strong>
          </p>
        )}

        <p>
          Your account is currently waiting for administrator
          approval. Please try again later.
        </p>

        <p>
          You will be able to access your banking account after
          your request has been approved.
        </p>

        <Link to="/login">
          Back to Login
        </Link>
      </section>
    </main>
  );
};

export default RegistrationPending;