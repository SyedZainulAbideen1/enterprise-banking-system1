import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const CustomerDetails = () => {
  const { customerId } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    /*
     * The actual customer record will be loaded from
     * customerService.js and Firestore during the
     * functionality integration phase.
     *
     * We do not create fake customer information here.
     */

    if (!customerId) {
      setError("Customer ID is missing.");
      return;
    }

    setLoading(false);
    setCustomer(null);
  }, [customerId]);

  return (
    <main>
      <section>
        <h1>Customer Details</h1>

        <p>
          View the complete information of an individual
          customer.
        </p>

        <p>
          <strong>Customer ID:</strong>{" "}
          {customerId || "Not available"}
        </p>

        <Link to="/employee/customers">
          Back to Customer List
        </Link>
      </section>

      <section>
        {loading && (
          <p>Loading customer details...</p>
        )}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {!loading && !error && !customer && (
          <div>
            <h2>Customer Information</h2>

            <p>
              Customer information will appear here
              after the customer database is connected.
            </p>
          </div>
        )}

        {!loading && !error && customer && (
          <div>
            <h2>Account Information</h2>

            <p>
              <strong>Name:</strong>{" "}
              {customer.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {customer.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {customer.phone}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {customer.address}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {customer.status}
            </p>

            <p>
              <strong>Account Number:</strong>{" "}
              {customer.accountNumber}
            </p>

            <p>
              <strong>Created At:</strong>{" "}
              {customer.createdAt}
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default CustomerDetails;