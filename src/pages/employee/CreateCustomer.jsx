import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./CreateCustomer.css";

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
    <main className="create-customer">
      <section className="create-customer__header">
        <div className="create-customer__header-content">
          <div className="create-customer__eyebrow">
            <span className="create-customer__eyebrow-dot" />
            Customer Management
          </div>

          <h1 className="create-customer__title">
            Create Customer
          </h1>

          <p className="create-customer__description">
            Create a customer record from the employee
            dashboard.
          </p>
        </div>

        <Link
          to="/employee"
          className="create-customer__back-link"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          Back to Dashboard
        </Link>
      </section>

      <section className="create-customer__content">
        <div className="create-customer__form-card">
          <div className="create-customer__form-header">
            <div className="create-customer__form-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M19 8v6M16 11h6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <span className="create-customer__section-label">
                Customer Information
              </span>

              <h2>New Customer Profile</h2>

              <p>
                Enter the customer's basic information
                below.
              </p>
            </div>
          </div>

          <form
            className="create-customer__form"
            onSubmit={handleSubmit}
          >
            <div className="create-customer__form-grid">
              <div className="create-customer__field">
                <label htmlFor="name">
                  Customer Name
                  <span aria-hidden="true">*</span>
                </label>

                <div className="create-customer__input-wrapper">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="9"
                      cy="7"
                      r="4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>

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
              </div>

              <div className="create-customer__field">
                <label htmlFor="email">
                  Customer Email
                  <span aria-hidden="true">*</span>
                </label>

                <div className="create-customer__input-wrapper">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />

                    <path
                      d="M3 7l9 6 9-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

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
              </div>

              <div className="create-customer__field">
                <label htmlFor="phone">
                  Phone Number
                  <span aria-hidden="true">*</span>
                </label>

                <div className="create-customer__input-wrapper">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M6.5 3h3L11 8l-2.5 1.5a13 13 0 006 6L16 13l5 1.5v3A2.5 2.5 0 0118.5 20C9.94 20 4 14.06 4 5.5A2.5 2.5 0 016.5 3z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

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
              </div>

              <div className="create-customer__field create-customer__field--full">
                <label htmlFor="address">
                  Address
                  <span aria-hidden="true">*</span>
                </label>

                <div className="create-customer__textarea-wrapper">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 5h16v14H4z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M8 9h8M8 13h6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter customer address"
                    rows="5"
                    autoComplete="street-address"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div
                className="create-customer__message create-customer__message--error"
                role="alert"
              >
                <div className="create-customer__message-icon">
                  !
                </div>

                <div>
                  <strong>
                    Unable to Continue
                  </strong>

                  <p>{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div
                className="create-customer__message create-customer__message--success"
                role="status"
              >
                <div className="create-customer__message-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Customer Information Valid
                  </strong>

                  <p>{success}</p>
                </div>
              </div>
            )}

            <div className="create-customer__form-footer">
              <p className="create-customer__required-note">
                <span>*</span> Required fields
              </p>

              <button
                type="submit"
                className="create-customer__submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="create-customer__button-spinner" />
                    Creating Customer...
                  </>
                ) : (
                  <>
                    Create Customer
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default CreateCustomer;