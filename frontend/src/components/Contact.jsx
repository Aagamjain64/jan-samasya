import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('📩 Form submitted:', formData);
    alert('Thanks for contacting us!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="container mt-5 min-vh-100">
      <h1 className="text-center mb-4">Contact Us</h1>
      <p className="text-center">
        Have questions or facing issues? Reach out using the form below or directly contact us.
      </p>

      <div className="row justify-content-center mt-">
        <div className="col-md-4">
          {/* Admin Info */}
          <div className="mb-4 bg-light p-3 rounded shadow-sm">
            <h5>📞 Admin Contact</h5>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Email:</strong> <a href="mailto:admin@jansamasya.com">admin@jansamasya.com</a></p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Your Name</label>
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
              <label htmlFor="email" className="form-label">Email Address</label>
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
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                name="message"
                className="form-control"
                id="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
