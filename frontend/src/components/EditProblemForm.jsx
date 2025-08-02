// src/components/EditProblemForm.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../assets/styls/CreateProblemForm.css';

const EditProblemForm = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialData = state?.problem || {};
  const [message, setMessage] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    ProblemTitle: initialData.ProblemTitle || '',
    ProblemDescription: initialData.ProblemDescription || '',
    ProblemCategory: initialData.ProblemCategory || '',
    State: initialData.State || '',
    City: initialData.City || '',
    Pincode: initialData.Pincode || '',
    Urgency: initialData.Urgency || 'Medium',
    isAnonymous: initialData.isAnonymous || false,
    PostedBy: '',
    Image: initialData.Image || ''
  });

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    const formDataImg = new FormData();
    formDataImg.append("file", file);
    formDataImg.append("upload_preset", "jan_samasya");

    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/drq4xcdco/image/upload", formDataImg);
      setFormData((prev) => ({
        ...prev,
        Image: res.data.secure_url
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const finalCategory = formData.ProblemCategory === 'Other' ? customCategory : formData.ProblemCategory;

    try {
      await axios.put(`${BASE_URL}/problems/${initialData._id}/edit`, {
        ...formData,
        ProblemCategory: finalCategory
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('✅ Problem updated successfully!');
      setTimeout(() => navigate('/problems'), 2000);
    } catch (err) {
      console.error("❌ Edit failed:", err);
      setMessage('❌ ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="modal-overlay overflow-auto">
      <div className="modal-box">
        <h2>Edit Problem</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Problem Title" value={formData.ProblemTitle} onChange={(e) => setFormData({ ...formData, ProblemTitle: e.target.value })} required />
          <textarea placeholder="Problem Description" value={formData.ProblemDescription} onChange={(e) => setFormData({ ...formData, ProblemDescription: e.target.value })} required />
          <select value={formData.ProblemCategory} onChange={(e) => {
            setFormData({ ...formData, ProblemCategory: e.target.value });
            if (e.target.value !== 'Other') setCustomCategory('');
          }} required>
            <option value="">-- Select Category --</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Health">Health</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Other">Other</option>
          </select>
          {formData.ProblemCategory === 'Other' && (
            <input type="text" placeholder="Enter custom category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} required />
          )}
          <input type="text" placeholder="State" value={formData.State} onChange={(e) => setFormData({ ...formData, State: e.target.value })} />
          <input type="text" placeholder="City" value={formData.City} onChange={(e) => setFormData({ ...formData, City: e.target.value })} />
          <input type="text" placeholder="Pincode" value={formData.Pincode} onChange={(e) => setFormData({ ...formData, Pincode: e.target.value })} />
          <select value={formData.Urgency} onChange={(e) => setFormData({ ...formData, Urgency: e.target.value })}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {isUploading ? (
            <p style={{ marginTop: "10px", color: "orange" }}>📤 Uploading Image...</p>
          ) : (
            formData.Image && (
              <img
                src={formData.Image}
                alt="Preview"
                style={{ width: "100px", marginTop: "10px", borderRadius: "10px" }}
              />
            )
          )}

          <label>
            <input type="checkbox" checked={formData.isAnonymous} onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })} />
            Post Anonymously
          </label>

          {message && (
            <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`} role="alert" style={{ marginTop: '10px' }}>
              {message}
            </div>
          )}

          <div className="modal-buttons">
            <button type="submit" className="submit-btn" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Update"}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProblemForm;
