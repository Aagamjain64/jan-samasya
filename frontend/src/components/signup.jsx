import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
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
// ...existing code...
const handleSignup = async () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  setLoading(true);
  setMessage("");
  try {
    const res = await axios.post(`${BASE_URL}/signup`, formData);
    setMessage("✅ Signup successful! Please complete registration.");
    // Store token here so registration can use it
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    navigate("/registration");
  } catch (err) {
    console.error("Signup error:", err.response?.data || err.message);
    setMessage("❌ " + (err.response?.data?.msg || "Signup failed"));
  } finally {
    setLoading(false);
  }
};
// ...existing code...

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow p-4 rounded-4">
            <h3 className="text-center mb-4">Sign Up</h3>

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

            <div className="form-group mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
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
              <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`} role="alert">
                {message}
              </div>
            )}

            <button
              className="btn btn-primary w-100"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
