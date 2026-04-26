import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthError, loginUser, selectAuthError, selectAuthStatus } from "../store/authSlice";
import "./Auth.css";

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector(selectAuthStatus);
  const apiError = useSelector(selectAuthError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submitting = status === "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    dispatch(clearAuthError());

    if (!email.trim() || !isValidEmail(email)) return setError("Enter a valid email address.");
    if (!password) return setError("Password is required.");

    const action = await dispatch(loginUser({ email: email.trim(), password }));
    if (loginUser.fulfilled.match(action)) {
      navigate("/home", { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-subtitle">Welcome back.</p>

        {error ? <div className="auth-error">{error}</div> : null}
        {!error && apiError ? <div className="auth-error">{apiError}</div> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              placeholder="Your password"
            />
          </div>

          <div className="auth-actions">
            <button className="auth-primary" type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </button>
            <button className="auth-secondary" type="button" onClick={() => navigate("/")} disabled={submitting}>
              Back
            </button>
          </div>
        </form>

        <div className="auth-footer">
          New here?{" "}
          <Link className="auth-link" to="/register">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
