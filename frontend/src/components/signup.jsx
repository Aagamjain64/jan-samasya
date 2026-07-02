import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { authPages, brand, routes } from '../data/siteContent';
import '../assets/styls/AuthPages.css';

const ROLE_OPTIONS = [
  {
    value: 'user',
    title: 'Common Citizen',
    description: 'Report local problems and vote in your city.',
    icon: '👤',
  },
  {
    value: 'mla',
    title: 'MLA',
    description: 'Manage complaints for your registered city only. Multiple MLAs per city allowed.',
    icon: '🏛️',
  },
  {
    value: 'govt_employee',
    title: 'Government Employee',
    description: 'Update status and remarks for problems in your city. Maximum 5 government employees per city.',
    icon: '🏢',
  },
];

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const copy = authPages.signup;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const BASE_URL = import.meta.env.VITE_API_URL;
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(`${BASE_URL}/signup`, formData);
      setMessage('✅ Signup successful! Please complete registration.');
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      navigate(routes.registration);
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setMessage('❌ ' + (err.response?.data?.msg || 'Signup failed'));
    } finally {
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

          <form className="auth-form" onSubmit={handleSignup} noValidate>
            <div className="mb-3">
              <label className="form-label">Choose account type</label>
              <div className="role-card-grid">
                {ROLE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`role-card ${formData.role === option.value ? 'role-card--active' : ''}`}
                    onClick={() => handleRoleSelect(option.value)}
                  >
                    <span className="role-card-icon">{option.icon}</span>
                    <span className="role-card-title">{option.title}</span>
                    <span className="role-card-desc">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="signup-username">
                {copy.username}
              </label>
              <input
                id="signup-username"
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
              <label className="form-label" htmlFor="signup-email">
                {copy.email}
              </label>
              <input
                id="signup-email"
                type="email"
                name="email"
                className="form-control"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={copy.emailPh}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="signup-password">
                {copy.password}
              </label>
              <input
                id="signup-password"
                type="password"
                name="password"
                className="form-control"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder={copy.passwordPh}
                required
              />
            </div>

            {message && (
              <div
                className={`alert auth-alert mb-3 ${
                  message.startsWith('✅') ? 'alert-success' : 'alert-danger'
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
            {copy.footerPrompt}{' '}
            <Link to={routes.login}>{copy.footerLink}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
