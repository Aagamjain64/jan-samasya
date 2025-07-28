// src/components/CityProblems.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import { jwtDecode } from 'jwt-decode';

const CityWise = () => {
  const [problems, setProblems] = useState([]);
  const [user, setUser] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const fetchCityProblems = async (city) => {
    try {
      const res = await axios.get(`${BASE_URL}/problems`);
      const cityFiltered = res.data.filter(p => p.City?.toLowerCase() === city?.toLowerCase());
      setProblems(cityFiltered);
    } catch (err) {
      console.error("❌ Error fetching problems:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        fetchCityProblems(decoded.city);
      } catch (err) {
        console.error("❌ Token error:", err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleDelete = async (problemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!window.confirm("Are you sure you want to delete this problem?")) return;

      await axios.delete(`${BASE_URL}/problem/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Problem deleted successfully!");
      setProblems(problems.filter(p => p._id !== problemId));
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete the problem.");
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold my-6">
        Problems in your city: <span className="text-green-600">{user?.city}</span>
      </h2>
      <Card problems={problems} user={user} refreshProblems={() => fetchCityProblems(user?.city)} onDelete={handleDelete} />
    </div>
  );
};

export default CityWise;