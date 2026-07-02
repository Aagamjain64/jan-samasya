// src/components/CreateProblemForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Card from './Card';
import '../assets/styls/CreateProblemForm.css';
import '../assets/styls/SubmittedProblems.css';
import '../assets/styls/Card.css';
import { problemFormOptions } from '../data/siteContent';

const CreateProblemForm = ({ showForm, setShowForm }) => {
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState({ username: '', city: '', userId: '', role: '' });
  const [customCategory, setCustomCategory] = useState('');
  const [submittedProblems, setSubmittedProblems] = useState([]);
  const [message, setMessage] = useState('');

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

  const fetchProblems = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/problems`);
      setSubmittedProblems(res.data);
    } catch (err) {
      console.error('Failed to fetch problems:', err);
    }
  }, [BASE_URL]);

  const handleDelete = async (problemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!window.confirm('Are you sure you want to delete this problem?')) return;

      await axios.delete(`${BASE_URL}/problem/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Problem deleted successfully!');
      setSubmittedProblems((prev) => prev.filter((p) => p._id.toString() !== problemId.toString()));
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete the problem');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          username: decoded.username,
          city: decoded.city,
          userId: decoded.userId,
          role: decoded.role,
        });
        setFormData((prev) => ({
          ...prev,
          PostedBy: decoded.userId,
          City: decoded.city || '',
          State: decoded.state || '',
          Pincode: decoded.pincode || '',
        }));
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
      }
    } else {
      setUser({ username: '', city: '', userId: '', role: '' });
    }

    fetchProblems();
  }, [location.key, fetchProblems]);

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showForm]);
const handleImageUpload = async (e) => {
  console.log("📷 File input triggered");  // Check this shows
  const file = e.target.files[0];
  if (!file) {
    console.log("❌ No file selected");
    return;
  }
setIsUploading(true);

  console.log("🛠 Selected file:", file.name);

  const formDataImg = new FormData();
  formDataImg.append("file", file);
  formDataImg.append("upload_preset", "jan_samasya");

  try {
    const res = await axios.post("https://api.cloudinary.com/v1_1/drq4xcdco/image/upload", formDataImg);
    const uploadedUrl = res.data.secure_url;
    console.log("✅ Uploaded URL:", uploadedUrl);
    console.log("📸 Image URL in state:", formData.Image);
    setFormData(prev => ({
      ...prev,
      Image: uploadedUrl
    }));
  } catch (err) {
    console.error("❌ Upload failed:", err.response?.data || err.message);
  }finally {
    setIsUploading(false); // 👉 hide loader
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  

  const finalCategory = formData.ProblemCategory === 'Other' ? customCategory : formData.ProblemCategory;
  const token = localStorage.getItem("token");
  //  if (!token) {
  //   setMessage("❌ You are not registered. Click here to register.");
  //   return;
  // }

  try {
    const res = await axios.post(`${BASE_URL}/create`, {
      ...formData,
      ProblemCategory: finalCategory
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // ✅ Instead of pushing one manually, fetch all from backend again
    const all = await axios.get(`${BASE_URL}/problems`);
    setSubmittedProblems(all.data);

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
    console.error('Error submitting problem:', error.response?.data || error.message);
    setMessage('❌ ' + (error.response?.data?.msg || error.message || 'Something went wrong'));
  }
};

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
useEffect(() => {
  if (formData.Image) {
    console.log("✅ Final Image URL in formData.Image:", formData.Image);
  }
}, [formData.Image]);

  return (
    <div className="problems-page">
      <div className="problems-page-header">
        <h2 className="problems-page-title">Create Problem</h2>
        <p className="problems-page-subtitle">
          Report a civic issue in your city with photo and location details
        </p>
      </div>
      <Card
        problems={submittedProblems}
        user={user}
        refreshProblems={fetchProblems}
        onDelete={handleDelete}
      />

      {showForm && (
        <div className="modal-overlay overflow-auto">
          <div className="modal-box">
            <h2>{problemFormOptions.modalTitle}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder={problemFormOptions.placeholders.title} value={formData.ProblemTitle} onChange={(e) => setFormData({ ...formData, ProblemTitle: e.target.value })} required />
              <textarea placeholder={problemFormOptions.placeholders.description} value={formData.ProblemDescription} onChange={(e) => setFormData({ ...formData, ProblemDescription: e.target.value })} required />
              <select value={formData.ProblemCategory} onChange={(e) => {
                setFormData({ ...formData, ProblemCategory: e.target.value });
                if (e.target.value !== 'Other') setCustomCategory('');
              }} required>
                {problemFormOptions.categories.map((opt) => (
                  <option key={opt.value || 'empty'} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {formData.ProblemCategory === 'Other' && (
                <input type="text" placeholder={problemFormOptions.placeholders.customCategory} value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} required />
              )}
              <input type="text" placeholder={problemFormOptions.placeholders.state} value={formData.State} onChange={(e) => setFormData({ ...formData, State: e.target.value })} />
              <input type="text" placeholder={problemFormOptions.placeholders.city} value={formData.City} onChange={(e) => setFormData({ ...formData, City: e.target.value })} />
              <input type="text" placeholder={problemFormOptions.placeholders.pincode} value={formData.Pincode} onChange={(e) => setFormData({ ...formData, Pincode: e.target.value })} />
              <select value={formData.Urgency} onChange={(e) => setFormData({ ...formData, Urgency: e.target.value })}>
                {problemFormOptions.urgency.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <input type="file" accept="image/*"  onChange={handleImageUpload} />
            {isUploading ? (
  <p style={{ marginTop: "10px", color: "orange" }}>{problemFormOptions.uploading}</p>
) : (
  formData.Image && (
    <img
      src={formData.Image}
      alt="Preview"
      style={{ width: "100px", marginTop: "10px", borderRadius: "10px" }}
    />
  )
)}


{message && (
  <div className="alert alert-danger" style={{ marginTop: '10px' }}>
    {message.includes("register") ? (
      <>
        ❌ You are not registered.{" "}
        <span
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => window.location.href = "/registration"}
        >
          Click here to register
        </span>
      </>
    ) : (
      message
    )}
  </div>
)}
            

              {message && (
                <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`} role="alert" style={{ marginTop: '10px' }}>
                  {message}
                </div>
              )}

              <div className="modal-buttons">
               <button
  type="submit"
  className="submit-btn"
  disabled={isUploading}
>
  {isUploading ? problemFormOptions.submitWhileUploading : problemFormOptions.submit}
</button>

                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>{problemFormOptions.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default CreateProblemForm;
