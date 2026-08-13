import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { registerNewUser } from "../../features/registrationRequests/registrationService";
import { logoutUser } from "../../features/auth/authService";

import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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
      setError(
        "Password must be at least 6 characters."
      );
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
        registrationError.code ===
        "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email address."
        );
      } else if (
        registrationError.code ===
        "auth/weak-password"
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
    <main className="register-page">
      <div className="register-page__background" />

      <div className="register-container">
        <Link
          to="/"
          className="register-back-link"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <section className="register-card">
          <div className="register-card__brand">
            <div className="register-card__logo">
              <ShieldCheck size={25} />
            </div>

            <div>
              <strong>
                Enterprise Banking
              </strong>

              <span>
                Secure digital banking
              </span>
            </div>
          </div>

          <div className="register-card__heading">
            <span className="register-eyebrow">
              ACCOUNT REQUEST
            </span>

            <h1>
              Create your account
            </h1>

            <p>
              Submit your details to request access
              to Enterprise Banking.
            </p>
          </div>

          <div className="register-notice">
            <ShieldCheck size={17} />

            <p>
              Your account will remain pending until
              it is reviewed and approved by an
              authorized bank administrator.
            </p>
          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            <div className="register-field">
              <label htmlFor="name">
                Full name
              </label>

              <div className="register-input-wrapper">
                <UserRound size={18} />

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
            </div>

            <div className="register-field">
              <label htmlFor="email">
                Email address
              </label>

              <div className="register-input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="register-fields-row">
              <div className="register-field">
                <label htmlFor="password">
                  Password
                </label>

                <div className="register-input-wrapper">
                  <LockKeyhole size={18} />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div className="register-field">
                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <div className="register-input-wrapper">
                  <LockKeyhole size={18} />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div
                className="register-error"
                role="alert"
              >
                <span className="register-error__icon">
                  !
                </span>

                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="register-spinner" />
                  Submitting request...
                </>
              ) : (
                <>
                  Submit account request
                  <ArrowLeft
                    size={17}
                    className="register-submit__arrow"
                  />
                </>
              )}
            </button>
          </form>

          <div className="register-divider">
            <span />
            <p>Secure registration</p>
            <span />
          </div>

          <div className="register-login">
            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>
          </div>
        </section>

        <p className="register-footer-text">
          Enterprise Banking System
          <span>•</span>
          Secure digital financial services
        </p>
      </div>
    </main>
  );
};

export default Register;