import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  loginUser,
  getUserProfile,
  logoutUser,
} from "../../features/auth/authService";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const firebaseUser = await loginUser(
        email,
        password
      );

      const userProfile = await getUserProfile(
        firebaseUser.uid
      );

      if (userProfile.status === "pending") {
        await logoutUser();

        navigate("/registration-pending", {
          replace: true,
          state: {
            email: userProfile.email || email,
          },
        });

        return;
      }

      if (userProfile.status === "rejected") {
        await logoutUser();

        navigate("/account-rejected", {
          replace: true,
          state: {
            email: userProfile.email || email,
          },
        });

        return;
      }

      if (userProfile.status !== "active") {
        await logoutUser();

        setError(
          "Your account is not active. Please contact the bank administrator."
        );

        return;
      }

      if (userProfile.role === "manager") {
        navigate("/manager", {
          replace: true,
        });

        return;
      }

      if (userProfile.role === "employee") {
        navigate("/employee", {
          replace: true,
        });

        return;
      }

      if (userProfile.role === "customer") {
        navigate("/customer", {
          replace: true,
        });

        return;
      }

      await logoutUser();

      setError(
        "Your account role is not configured correctly. Please contact the bank administrator."
      );
    } catch (loginError) {
      console.error("Login error:", loginError);

      if (
        loginError.code === "auth/invalid-credential" ||
        loginError.code === "auth/wrong-password" ||
        loginError.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else if (
        loginError.code === "auth/invalid-email"
      ) {
        setError("Please enter a valid email address.");
      } else if (
        loginError.code === "auth/too-many-requests"
      ) {
        setError(
          "Too many login attempts. Please try again later."
        );
      } else if (
        loginError.message === "User profile was not found."
      ) {
        await logoutUser();

        setError(
          "Your account profile was not found. Please contact the bank administrator."
        );
      } else {
        setError(
          loginError.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-page__background" />

      <div className="login-container">
        <Link
          to="/"
          className="login-back-link"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <section className="login-card">
          <div className="login-card__brand">
            <div className="login-card__logo">
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

          <div className="login-card__heading">
            <h1>
              Welcome back
            </h1>

            <p>
              Sign in to securely access your
              banking account.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="login-field">
              <label htmlFor="email">
                Email address
              </label>

              <div className="login-input-wrapper">
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

            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password">
                  Password
                </label>
              </div>

              <div className="login-input-wrapper">
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="login-password-toggle"
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
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="login-error"
                role="alert"
              >
                <span className="login-error__icon">
                  !
                </span>

                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in securely
                  <ArrowLeft
                    size={17}
                    className="login-submit__arrow"
                  />
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span />
            <p>Secure access</p>
            <span />
          </div>

          <div className="login-security">
            <LockKeyhole size={16} />

            <p>
              Your banking session is protected
              with secure authentication.
            </p>
          </div>

          <div className="login-register">
            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>
          </div>
        </section>

        <p className="login-footer-text">
          Enterprise Banking System
          <span>•</span>
          Secure digital financial services
        </p>
      </div>
    </main>
  );
};

export default Login;