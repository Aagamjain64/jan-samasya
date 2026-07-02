import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { authPages, brand, routes } from "../data/siteContent";
import "../assets/styls/AuthPages.css";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const copy = authPages.login;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const BASE_URL = import.meta.env.VITE_API_URL;
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/login`, formData);
      setMessage("✅ Login successful!");

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setTimeout(() => {
          navigate(routes.problems);
        }, 500);
      } else {
        setLoading(false);
        navigate(routes.login);
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setMessage("❌ " + (err.response?.data?.msg || "Login failed"));
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <aside className="auth-aside">
          <p className="auth-brand">{brand.name}</p>
          <p className="auth-aside-tagline">{brand.tagline}</p>
          <Link to={routes.home} className="auth-aside-link">
            ← {copy.backHome}
          </Link>
        </aside>

        <div className="auth-body">
          <h1 className="auth-heading">{copy.title}</h1>
          <p className="auth-subtitle">{copy.subtitle}</p>

          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="login-username">
                {copy.username}
              </label>
              <input
                id="login-username"
                type="text"
                name="username"
                className="form-control"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={copy.usernamePh}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="login-password">
                {copy.password}
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                className="form-control"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder={copy.passwordPh}
                required
              />
            </div>

            {message && (
              <div
                className={`alert auth-alert mb-3 ${
                  message.startsWith("✅") ? "alert-success" : "alert-danger"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}

            <button type="submit" className="auth-submit w-100" disabled={loading}>
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  {copy.submitting}
                </>
              ) : (
                copy.submit
              )}
            </button>
          </form>

          <p className="auth-footer">
            {copy.footerPrompt}{" "}
            <Link to={routes.signup}>{copy.footerLink}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
