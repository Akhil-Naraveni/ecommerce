import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Landingpage.css";

const Landingpage = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleVerification = () => {
    const email = inputRef.current?.value || "";
    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    if (email && isValidEmail) {
      navigate(`/register?email=${encodeURIComponent(email)}`);
      return;
    }
    alert("Please enter a valid email address.");
  };

  return (
    <main className="landing-page-container">
      <section className="landing-page-left page-section">
        <div className="left-content section-content">
          <h2>
            GearUp <span className="fashion-text">fashion</span>
            <span className="lifestyle-text">Lifestyle</span>
            <br></br> with GenZTrends
          </h2>
          <p>
            Discover the latest fashion trends curated for Gen Z. Stay ahead with styles that speak your vibe.Your
            style, your rules. GenZTrends helps you discover looks that feel fresh, fearless, and totally you. No
            overthinking - just drip that speaks.
          </p>
          <p>We are almost here to explore the world of fashion</p>
        </div>
      </section>

      <section className="landing-page-right page-section">
        <div className="right-content section-content">
          <input ref={inputRef} type="email" placeholder="Enter your email" className="email-input" />
          <button onClick={handleVerification} className="get-started-button">
            Let's Go
          </button>
          <div className="landing-auth-links">
            <span>Already have an account?</span>
            <Link className="landing-auth-link" to="/login">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landingpage;

