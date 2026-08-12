import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CustomerList = () => {
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
        <h1>Customer List</h1>

        <p>
          View and manage customers from the employee
          dashboard.
        </p>

        <Link to="/employee">
          Back to Employee Dashboard
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
                available.
              </p>

              <Link to="/employee/customers/create">
                Create Customer
              </Link>
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
                        <Link
                          to={`/employee/customers/${customer.id}`}
                        >
                          View Details
                        </Link>
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

export default CustomerList;