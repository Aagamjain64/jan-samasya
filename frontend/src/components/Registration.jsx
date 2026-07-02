import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [formData, setFormData] = useState({
    user: "",
    firstname: "",
    lastname: "",
    number: "",
    city: "",
    state: "",
    age: "",
    gender: "",
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const [govtQuota, setGovtQuota] = useState(null);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setFormData((prevData) => ({
          ...prevData,
          user: decoded.userId,
        }));
        if (decoded.role) {
          setUserRole(decoded.role);
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/states`);
        setStates(res.data);
      } catch (err) {
        console.error("Failed to load states:", err);
        setMessage("❌ Failed to load states. Please refresh the page.");
      }
    };

    fetchStates();
  }, [BASE_URL]);

  useEffect(() => {
    if (!formData.state) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await axios.get(`${BASE_URL}/cities`, {
          params: { state: formData.state },
        });
        setCities(res.data);
      } catch (err) {
        console.error("Failed to load cities:", err);
        setCities([]);
        setMessage("❌ Failed to load cities for selected state.");
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [formData.state, BASE_URL]);

  useEffect(() => {
    if (userRole !== "govt_employee" || !formData.city) {
      setGovtQuota(null);
      return;
    }

    const fetchQuota = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/govt-employee-count`, {
          params: { city: formData.city },
        });
        setGovtQuota(res.data);
      } catch (err) {
        console.error("Failed to check govt employee quota:", err);
        setGovtQuota(null);
      }
    };

    fetchQuota();
  }, [formData.city, userRole, BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "state" ? { city: "" } : {}),
    }));
    if (name === "state" || name === "city") {
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole === "govt_employee" && govtQuota && !govtQuota.available) {
      setMessage(
        `❌ This city already has ${govtQuota.max} government employees. Please choose another city.`
      );
      return;
    }

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

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

  const isGovtQuotaFull =
    userRole === "govt_employee" && govtQuota && !govtQuota.available;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Registration Form</h2>
      <form onSubmit={handleSubmit} className="border p-4 shadow rounded bg-light">
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
          <label className="form-label">State</label>
          <select
            name="state"
            className="form-select"
            value={formData.state}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <select
            name="city"
            className="form-select"
            value={formData.city}
            onChange={handleChange}
            required
            disabled={!formData.state || loadingCities}
          >
            <option value="">
              {!formData.state
                ? "Select state first"
                : loadingCities
                  ? "Loading cities..."
                  : "Select City"}
            </option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {userRole === "govt_employee" && formData.city && govtQuota && (
            <small className={`d-block mt-1 ${isGovtQuotaFull ? "text-danger" : "text-muted"}`}>
              Government employees in {formData.city}: {govtQuota.count}/{govtQuota.max}
              {isGovtQuotaFull && " — quota full, choose another city"}
            </small>
          )}
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

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || isGovtQuotaFull}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </form>
    </div>
  );
}

export default Registration;
