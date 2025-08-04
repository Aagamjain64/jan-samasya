import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    const BASE_URL = import.meta.env.VITE_API_URL;
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/login`, formData);
      setMessage("✅ Login successful!");

      // Always store token if present
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        // Always redirect to create page after login
        setTimeout(() => {
          navigate("/problems");
        }, 500);
      } else {
        // No token, fallback
        setLoading(false);
        navigate("/login");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setMessage("❌ " + (err.response?.data?.msg || "Login failed"));
      setLoading(false);
    } finally {
      // Don't set loading false here, let redirect handle it
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow p-4 rounded-4">
            <h3 className="text-center mb-4">Sign In</h3>

            <div className="form-group mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {message && (
              <div
                className={`alert ${
                  message.startsWith("✅")
                    ? "alert-success"
                    : "alert-danger"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}

            <button
              className="btn btn-primary w-100"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : "Sign In"}
            </button>
              <p className="inline">Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a></p>




          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
