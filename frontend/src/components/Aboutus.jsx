import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mt-5 min-vh-100 d-flex flex-column justify-content-center">
      <h1 className="text-center mb-4">About Jan Samasya</h1>

      <p className="lead text-center">
        <strong>Jan Samasya</strong> is a platform for citizens to report public issues like road damage, water leakage, and cleanliness problems in their city.
      </p>

      <h4 className="mt-4">Key Features:</h4>
      <ul>
        <li>Post and track problems in your local area.</li>
        <li>Like or dislike problems based on urgency.</li>
        <li>Enable or disable voting as per the user's control.</li>
      </ul>

      <p className="mt-4">
        <strong>Our Mission:</strong> To connect people and authorities to improve cities — one problem at a time.
      </p>
    </div>
  );
};

export default AboutUs;
