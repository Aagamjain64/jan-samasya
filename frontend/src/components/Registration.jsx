import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Registration() {
  const [formData, setFormData] = useState({
    user: "", // 👈 Add this to store userId from token
    firstname: "",
    lastname: "",
    number: "",
    city: "",
    state: "", // <-- add state
    age: "",
    gender: "",
  });
const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Extract userId from token when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setFormData((prevData) => ({
          ...prevData,
          user: decoded.userId, // 👈 set userId
        }));
      } catch (err) {
        // Invalid token, remove and redirect
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      // No token, redirect to login
      navigate("/login");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
console.log("📦 Token from localStorage:", token);

    try {
      const res = await axios.post(`${BASE_URL}/registration`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.msg || "✅ Registration successful!");
       if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
        navigate("/create"); 
    } catch (err) {
      console.error("Error:", err.response?.data?.msg);
      setMessage("❌ " + (err.response?.data?.msg || "Something went wrong."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Registration Form</h2>
      <form onSubmit={handleSubmit} className="border p-4 shadow rounded bg-light">

        {/* ❌ Username field hata diya */}

        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            name="firstname"
            className="form-control"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="lastname"
            className="form-control"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            name="number"
            className="form-control"
            value={formData.number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            name="city"
            className="form-control"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">State</label>
          <input
            type="text"
            name="state"
            className="form-control"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Age</label>
          <input
            type="number"
            name="age"
            className="form-control"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label d-block">Gender</label>

          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
              required
            />
            <label className="form-check-label">Male</label>
          </div>

          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
              required
            />
            <label className="form-check-label">Female</label>
          </div>

          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="gender"
              value="other"
              checked={formData.gender === "other"}
              onChange={handleChange}
              required
            />
            <label className="form-check-label">Other</label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </form>
    </div>
  );
}

export default Registration;
