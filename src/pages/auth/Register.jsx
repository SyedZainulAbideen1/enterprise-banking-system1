import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerNewUser } from "../../features/registrationRequests/registrationService";
import { logoutUser } from "../../features/auth/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerNewUser({
        email,
        password,
        fullName: name,
      });

      /*
       * Firebase Authentication automatically signs the newly
       * created user in.
       *
       * The newly registered user has a "pending" status,
       * so the user must not remain authenticated.
       *
       * We immediately sign the user out.
       */
      await logoutUser();

      navigate("/registration-pending", {
        replace: true,
        state: {
          email: email.trim().toLowerCase(),
        },
      });
    } catch (registrationError) {
      console.error(
        "Registration error:",
        registrationError
      );

      if (
        registrationError.code ===
        "auth/email-already-in-use"
      ) {
        setError(
          "An account with this email already exists."
        );
      } else if (
        registrationError.code === "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email address."
        );
      } else if (
        registrationError.code === "auth/weak-password"
      ) {
        setError("Password is too weak.");
      } else {
        setError(
          registrationError.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section>
        <h1>Create Account</h1>

        <p>
          Submit your account request. Your account will
          become active after administrator approval.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          {error && (
            <p role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Submitting Request..."
              : "Create Account"}
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;