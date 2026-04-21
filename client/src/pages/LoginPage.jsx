import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      await login(formData);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <div className="auth-page__brand-panel">
          <p className="auth-page__eyebrow">Task Track</p>
          <h1 className="auth-page__headline">
            Track tasks, time, and progress in one simple place.
          </h1>
          <p className="auth-page__description">
            Log in to manage tasks, record time spent, and monitor your work through a clean
            dashboard.
          </p>
        </div>

        <div className="auth-page__content">
          <p className="auth-page__mobile-brand">Task Track</p>
          <h2 className="auth-page__title">Login</h2>
          <p className="auth-page__subtitle">Enter your email and password to continue.</p>

          {error && (
            <div className="auth-page__message message-banner message-banner--error">
              {error}
            </div>
          )}

          <form className="auth-page__form" onSubmit={handleSubmit}>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-page__submit button button--primary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-page__footer">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="auth-page__footer-link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
