import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    /*
     * Actual customer records will be loaded from
     * customerService.js and Firestore during the
     * functionality integration phase.
     *
     * No fake customer records are created here.
     */

    setLoading(false);
    setCustomers([]);
  }, []);

  return (
    <main>
      <section>
        <h1>Customer Management</h1>

        <p>
          Manage customer accounts and review customer
          information.
        </p>

        <Link to="/manager">
          Back to Manager Dashboard
        </Link>
      </section>

      <section>
        {loading && (
          <p>Loading customers...</p>
        )}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          customers.length === 0 && (
            <div>
              <h2>No Customers Found</h2>

              <p>
                There are currently no customer records
                available for management.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          customers.length > 0 && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        {customer.name}
                      </td>

                      <td>
                        {customer.email}
                      </td>

                      <td>
                        {customer.phone}
                      </td>

                      <td>
                        {customer.status}
                      </td>

                      <td>
                        <button
                          type="button"
                          disabled
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </section>
    </main>
  );
};

export default CustomerManagement;