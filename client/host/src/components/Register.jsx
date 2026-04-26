import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { clearAuthError, registerUser, selectAuthError, selectAuthStatus } from "../store/authSlice";
import "./Auth.css";

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const status = useSelector(selectAuthStatus);
  const apiError = useSelector(selectAuthError);

  const initialEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const submitting = status === "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    dispatch(clearAuthError());

    if (!name.trim()) return setError("Name is required.");
    if (!email.trim() || !isValidEmail(email)) return setError("Enter a valid email address.");
    if (!password) return setError("Password is required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    const action = await dispatch(
      registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      })
    );

    if (registerUser.fulfilled.match(action)) {
      navigate("/home", { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join GenZTrends and start shopping.</p>

        {error ? <div className="auth-error">{error}</div> : null}
        {!error && apiError ? <div className="auth-error">{apiError}</div> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              placeholder="Your name"
            />
          </div>

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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              placeholder="At least 6 characters"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
              placeholder="Re-enter password"
            />
          </div>

          <div className="auth-actions">
            <button className="auth-primary" type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Account"}
            </button>
            <button className="auth-secondary" type="button" onClick={() => navigate("/")} disabled={submitting}>
              Back
            </button>
          </div>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link className="auth-link" to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
