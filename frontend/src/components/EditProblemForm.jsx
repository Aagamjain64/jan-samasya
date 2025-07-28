// src/components/EditProblemForm.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styls/CreateProblemForm.css';

const EditProblemForm = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialData = state?.problem || {};
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    ProblemTitle: initialData.ProblemTitle || '',
    ProblemDescription: initialData.ProblemDescription || '',
    ProblemCategory: initialData.ProblemCategory || '',
    State: initialData.State || '',
    City: initialData.City || '',
    Pincode: initialData.Pincode || '',
    Urgency: initialData.Urgency || 'Medium',
    isAnonymous: initialData.isAnonymous || false,
    Image: initialData.Image || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(`${BASE_URL}/problems/${initialData._id}/edit`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('✅ Problem updated successfully!');
      setTimeout(() => navigate('/problems'), 2000);
    } catch (err) {
      console.error("❌ Edit failed:", err);
      setMessage('❌ ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Edit Problem</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="ProblemTitle" value={formData.ProblemTitle}
            onChange={(e) => setFormData({ ...formData, ProblemTitle: e.target.value })}
            placeholder="Problem Title" required />

          <textarea name="ProblemDescription" value={formData.ProblemDescription}
            onChange={(e) => setFormData({ ...formData, ProblemDescription: e.target.value })}
            placeholder="Description" required />

          <input type="text" name="ProblemCategory" value={formData.ProblemCategory}
            onChange={(e) => setFormData({ ...formData, ProblemCategory: e.target.value })}
            placeholder="Category" />

          <input type="text" name="State" value={formData.State}
            onChange={(e) => setFormData({ ...formData, State: e.target.value })}
            placeholder="State" />

          <input type="text" name="City" value={formData.City}
            onChange={(e) => setFormData({ ...formData, City: e.target.value })}
            placeholder="City" />

          <input type="text" name="Pincode" value={formData.Pincode}
            onChange={(e) => setFormData({ ...formData, Pincode: e.target.value })}
            placeholder="Pincode" />

          <select value={formData.Urgency}
            onChange={(e) => setFormData({ ...formData, Urgency: e.target.value })}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <input type="text" placeholder="Image URL" value={formData.Image}
            onChange={(e) => setFormData({ ...formData, Image: e.target.value })} />

          {formData.Image && <img src={formData.Image} alt="Preview" style={{ width: "50px", marginTop: "10px", borderRadius: "10px" }} />}

          <label>
            <input type="checkbox" checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })} />
            Post Anonymously
          </label>

          {message && <p className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>{message}</p>}

          <div className="modal-buttons">
            <button type="submit" className="submit-btn">Update</button>
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProblemForm;
