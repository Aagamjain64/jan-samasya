// src/components/CreateProblemForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Card from './Card';
import '../assets/styls/CreateProblemForm.css';
import '../assets/styls/SubmittedProblems.css';

const CreateProblemForm = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [showForm, setShowForm] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [submittedProblems, setSubmittedProblems] = useState([]);
  const [message, setMessage] = useState(''); // ✅ For alerts

  const [formData, setFormData] = useState({
    ProblemTitle: '',
    ProblemDescription: '',
    ProblemCategory: '',
    State: '',
    City: '',
    Pincode: '',
    Urgency: 'Medium',
    isAnonymous: false,
    PostedBy: '',
    Image: ''
  });

  // ✅ Extract userId and city/state/pincode from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setFormData((prev) => ({
          ...prev,
          PostedBy: decoded.userId,
          City: decoded.city || '',
          State: decoded.state || '',
          Pincode: decoded.pincode || ''
        }));
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  // ✅ Fetch problems once
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/problems`);
        setSubmittedProblems(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch problems:', err);
      }
    };
    fetchProblems();
  }, []);

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory = formData.ProblemCategory === 'Other' ? customCategory : formData.ProblemCategory;
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(`${BASE_URL}/create`, {
        ...formData,
        ProblemCategory: finalCategory
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

     setSubmittedProblems([...submittedProblems, res.data.problem]);

      setMessage('✅ Problem submitted successfully!');

      setFormData({
        ProblemTitle: '',
        ProblemDescription: '',
        ProblemCategory: '',
        State: '',
        City: '',
        Pincode: '',
        Urgency: 'Medium',
        isAnonymous: false,
        PostedBy: formData.PostedBy,
        Image: ''
      });
      setCustomCategory('');
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error submitting problem:', error.response?.data || error.message);
      setMessage('❌ ' + (error.response?.data?.msg || error.message || 'Something went wrong'));
    }
  };

  // ✅ Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div>
      <button className="open-btn" onClick={() => setShowForm(true)}>
        Create Problem ➕
      </button>

      <Card problems={submittedProblems} />

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Create a Problem</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Problem Title" value={formData.ProblemTitle}
                onChange={(e) => setFormData({ ...formData, ProblemTitle: e.target.value })} required />

              <textarea placeholder="Problem Description" value={formData.ProblemDescription}
                onChange={(e) => setFormData({ ...formData, ProblemDescription: e.target.value })} required />

              <select value={formData.ProblemCategory}
                onChange={(e) => {
                  setFormData({ ...formData, ProblemCategory: e.target.value });
                  if (e.target.value !== 'Other') setCustomCategory('');
                }} required >
                <option value="">-- Select Category --</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Health">Health</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Other">Other</option>
              </select>

              {formData.ProblemCategory === 'Other' && (
                <input type="text" placeholder="Enter custom category" value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)} required />
              )}

              <input type="text" placeholder="State" value={formData.State}
                onChange={(e) => setFormData({ ...formData, State: e.target.value })} />

              <input type="text" placeholder="City" value={formData.City}
                onChange={(e) => setFormData({ ...formData, City: e.target.value })} />

              <input type="text" placeholder="Pincode" value={formData.Pincode}
                onChange={(e) => setFormData({ ...formData, Pincode: e.target.value })} />

              <select value={formData.Urgency}
                onChange={(e) => setFormData({ ...formData, Urgency: e.target.value })} >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <input type="text" placeholder="Image URL" value={formData.Image}
                onChange={(e) => setFormData({ ...formData, Image: e.target.value })} />

              {formData.Image && <img src={formData.Image} alt="Preview" style={{ width: "50px", marginTop: "10px", borderRadius: "10px" }} />}

              <label className="checkbox-label">
                <input type="checkbox" checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })} />
                Post Anonymously
              </label>

              {/* ✅ Message show block */}
              {message && (
                <div
                  className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}
                  role="alert"
                  style={{ marginTop: '10px' }}
                >
                  {message}
                </div>
              )}

              <div className="modal-buttons">
                <button type="submit" className="submit-btn">Submit</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProblemForm;
