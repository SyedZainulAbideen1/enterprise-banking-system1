import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CustomerDashboard = () => {
  const { user, profile } = useSelector(
    (state) => state.auth
  );

  const customerName =
    profile?.fullName ||
    profile?.name ||
    user?.displayName ||
    "Customer";

  const email =
    profile?.email ||
    user?.email ||
    "No email available";

  const role = profile?.role || "customer";

  const accountStatus =
    profile?.status || "active";

  const balance =
    typeof profile?.balance === "number"
      ? profile.balance
      : 0;

  const formattedBalance = new Intl.NumberFormat(
    "en-PK",
    {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
    }
  ).format(balance);

  return (
    <main>
      <section>
        <h1>Customer Dashboard</h1>

        <p>
          Welcome, <strong>{customerName}</strong>.
        </p>

        <p>
          Manage your banking activities from your
          customer dashboard.
        </p>
      </section>

      <section>
        <h2>Account Summary</h2>

        <div>
          <div>
            <h3>Current Balance</h3>

            <p>
              <strong>{formattedBalance}</strong>
            </p>
          </div>

          <div>
            <h3>Account Status</h3>

            <p>
              <strong>{accountStatus}</strong>
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Account Information</h2>

        <div>
          <p>
            <strong>Name:</strong>{" "}
            {customerName}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {email}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {role}
          </p>

          <p>
            <strong>Account Status:</strong>{" "}
            {accountStatus}
          </p>

          {user?.uid && (
            <p>
              <strong>User ID:</strong>{" "}
              {user.uid}
            </p>
          )}
        </div>
      </section>

      <section>
        <h2>Banking Services</h2>

        <nav>
          <ul>
            <li>
              <Link to="/customer/transactions">
                Transaction History
              </Link>
            </li>

            <li>
              <Link to="/customer/loan">
                Loan Details
              </Link>
            </li>

            <li>
              <Link to="/customer/loan/request">
                Request a Loan
              </Link>
            </li>

            <li>
              <Link to="/customer/deposit">
                Deposit Request
              </Link>
            </li>

            <li>
              <Link to="/customer/withdraw">
                Withdraw Request
              </Link>
            </li>

            <li>
              <Link to="/customer/donation">
                Donation Request
              </Link>
            </li>
          </ul>
        </nav>
      </section>

      <section>
        <h2>Account Status</h2>

        <p>
          Your account is currently{" "}
          <strong>{accountStatus}</strong>.
        </p>

        <p>
          If you have any banking requests, use the
          appropriate service above.
        </p>
      </section>
    </main>
  );
};

export default CustomerDashboard;