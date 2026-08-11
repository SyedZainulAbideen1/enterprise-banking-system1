import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  loginUser,
  getUserProfile,
  logoutUser,
} from "../../features/auth/authService";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    <main>
      <section>
        <h1>Sign In</h1>

        <p>
          Sign in to your Enterprise Banking System account.
        </p>

        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              autoComplete="current-password"
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;