import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const EmployeeDashboard = () => {
  const { user, profile } = useSelector(
    (state) => state.auth
  );

  const employeeName =
    profile?.fullName ||
    profile?.name ||
    user?.displayName ||
    "Employee";

  const email =
    profile?.email ||
    user?.email ||
    "No email available";

  return (
    <main>
      <section>
        <h1>Employee Dashboard</h1>

        <p>
          Welcome, <strong>{employeeName}</strong>.
        </p>

        <p>
          Manage customer accounts, loan requests, and
          transaction requests from the employee dashboard.
        </p>
      </section>

      <section>
        <h2>Employee Information</h2>

        <div>
          <p>
            <strong>Name:</strong> {employeeName}
          </p>

          <p>
            <strong>Email:</strong> {email}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {profile?.role || "employee"}
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
        <h2>Employee Services</h2>

        <nav>
          <ul>
            <li>
              <Link to="/employee/customers">
                Customer List
              </Link>
            </li>

            <li>
              <Link to="/employee/customers/create">
                Create Customer
              </Link>
            </li>

            <li>
              <Link to="/employee/loans">
                Loan Requests
              </Link>
            </li>

            <li>
              <Link to="/employee/transactions">
                Transaction Requests
              </Link>
            </li>
          </ul>
        </nav>
      </section>

      <section>
        <h2>Employee Responsibilities</h2>

        <ul>
          <li>
            View and manage customer information.
          </li>

          <li>
            Create customer accounts when authorized.
          </li>

          <li>
            Review customer loan requests.
          </li>

          <li>
            Review customer transaction requests.
          </li>
        </ul>
      </section>
    </main>
  );
};

export default EmployeeDashboard;