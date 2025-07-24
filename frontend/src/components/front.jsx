import React from 'react';

const TermsAndConditions = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Terms and Conditions</h1>

      <section style={styles.section}>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using this platform, you agree to follow these Terms and Conditions.
          If you do not accept them, please do not use the service.
        </p>
      </section>

      <section style={styles.section}>
        <h2>2. User Responsibilities</h2>
        <p>
          Users must register with valid details. Each user can post and vote only within their registered city.
          Offensive or fake posts are strictly prohibited.
        </p>
      </section>

      <section style={styles.section}>
        <h2>3. Voting Policy</h2>
        <p>
          You can vote once per problem. You may remove your vote (unvote) if needed.
          Votes are public and help prioritize issues.
        </p>
      </section>

      <section style={styles.section}>
        <h2>4. Privacy</h2>
        <p>
          We do not share your personal information. Your data is secured with industry-standard methods like JWT.
        </p>
      </section>

      <section style={styles.section}>
        <h2>5. Changes</h2>
        <p>
          Terms may be updated without notice. By continuing to use the platform, you agree to the latest version.
        </p>
      </section>

      <section style={styles.section}>
        <h2>6. Governing Law</h2>
        <p>
          These terms are governed by the laws of India. Any disputes will be handled in accordance with Indian law.
        </p>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333'
  },
  section: {
    marginBottom: '25px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  }
};

export default TermsAndConditions;
