import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      setSuccessMessage("");
      const response = await signup(formData);
      setSuccessMessage(response.message);
      setFormData({
        username: "",
        email: "",
        password: ""
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Signup failed");
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
            Create an account and start managing your work better.
          </h1>
          <p className="auth-page__description">
            Save tasks, record time spent, and follow progress using a simple dashboard.
          </p>
        </div>

        <div className="auth-page__content">
          <p className="auth-page__mobile-brand">Task Track</p>
          <h2 className="auth-page__title">Sign Up</h2>
          <p className="auth-page__subtitle">Create your account to begin using the system.</p>

          {error && (
            <div className="auth-page__message message-banner message-banner--error">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="auth-page__message message-banner message-banner--success">
              {successMessage}
            </div>
          )}

          <form className="auth-page__form" onSubmit={handleSubmit}>
            <div>
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your username"
                required
              />
            </div>

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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-page__footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-page__footer-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
