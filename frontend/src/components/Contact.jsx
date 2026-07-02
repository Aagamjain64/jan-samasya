import React, { useState } from 'react';
import { contactPage } from '../data/siteContent';
import '../assets/styls/Landing.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(contactPage.form.successAlert);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="page-shell contact-shell">
      <h1 className="contact-page-title">{contactPage.pageTitle}</h1>
      <p className="contact-intro">{contactPage.intro}</p>

      <div className="contact-layout">
        <aside className="contact-aside">
          <h2 className="contact-aside-heading">{contactPage.adminHeading}</h2>
          <p>
            <strong>Phone:</strong> {contactPage.admin.phone}
          </p>
          <p>
            <strong>Email:</strong>{' '}
            <a href={`mailto:${contactPage.admin.email}`}>{contactPage.admin.email}</a>
          </p>
        </aside>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              {contactPage.form.nameLabel}
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {contactPage.form.emailLabel}
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              {contactPage.form.messageLabel}
            </label>
            <textarea
              name="message"
              className="form-control"
              id="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {contactPage.form.submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
