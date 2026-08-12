import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ManagerDashboard = () => {
  const { user, profile } = useSelector(
    (state) => state.auth
  );

  const managerName =
    profile?.fullName ||
    profile?.name ||
    user?.displayName ||
    "Manager";

  const email =
    profile?.email ||
    user?.email ||
    "No email available";

  return (
    <main>
      <section>
        <h1>Manager Dashboard</h1>

        <p>
          Welcome, <strong>{managerName}</strong>.
        </p>

        <p>
          Manage registrations, customers, employees,
          loans, and banking transactions from the
          manager dashboard.
        </p>
      </section>

      <section>
        <h2>Manager Information</h2>

        <div>
          <p>
            <strong>Name:</strong> {managerName}
          </p>

          <p>
            <strong>Email:</strong> {email}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {profile?.role || "manager"}
          </p>

          <p>
            <strong>Account Status:</strong>{" "}
            {profile?.status || "active"}
          </p>

          {user?.uid && (
            <p>
              <strong>User ID:</strong> {user.uid}
            </p>
          )}
        </div>
      </section>

      <section>
        <h2>Management Services</h2>

        <nav>
          <ul>
            <li>
              <Link to="/manager/registrations">
                Registration Requests
              </Link>
            </li>

            <li>
              <Link to="/manager/customers">
                Customer Management
              </Link>
            </li>

            <li>
              <Link to="/manager/employees">
                Employee Management
              </Link>
            </li>

            <li>
              <Link to="/manager/loans">
                Loan Requests
              </Link>
            </li>

            <li>
              <Link to="/manager/transactions">
                Transaction Oversight
              </Link>
            </li>
          </ul>
        </nav>
      </section>

      <section>
        <h2>Manager Responsibilities</h2>

        <ul>
          <li>
            Review new registration requests.
          </li>

          <li>
            Approve or reject registration requests.
          </li>

          <li>
            Manage customer accounts.
          </li>

          <li>
            Manage employee accounts.
          </li>

          <li>
            Review loan requests.
          </li>

          <li>
            Monitor banking transactions.
          </li>
        </ul>
      </section>
    </main>
  );
};

export default ManagerDashboard;