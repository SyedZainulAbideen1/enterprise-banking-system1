import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateCustomer = () => {
  const { user } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!user?.uid) {
      setError(
        "You must be logged in to create a customer."
      );
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter the customer's name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter the customer's email.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter the customer's phone number.");
      return;
    }

    if (!formData.address.trim()) {
      setError("Please enter the customer's address.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Actual customer creation will be connected
       * through customerService.js during the
       * functionality phase.
       *
       * No fake customer record is created here.
       */

      await Promise.resolve();

      setSuccess(
        "Customer information is valid and ready to be created."
      );
    } catch (createError) {
      console.error(
        "Create customer error:",
        createError
      );

      setError(
        createError.message ||
          "Unable to create customer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section>
        <h1>Create Customer</h1>

        <p>
          Create a customer record from the employee
          dashboard.
        </p>

        <Link to="/employee">
          Back to Employee Dashboard
        </Link>
      </section>

      <section>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">
              Customer Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter customer name"
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email">
              Customer Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter customer email"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              autoComplete="tel"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="address">
              Address
            </label>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter customer address"
              rows="4"
              autoComplete="street-address"
              disabled={loading}
            />
          </div>

          {error && (
            <p role="alert">
              {error}
            </p>
          )}

          {success && (
            <p role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Customer..."
              : "Create Customer"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateCustomer;