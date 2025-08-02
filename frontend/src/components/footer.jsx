import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';
import '../assets/styls/Footer.css';
import logo from '../assets/react.svg'; // Replace with your logo if desired

function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        <div className="footer-brand">
          <img src={logo} alt="Jan Samasya Logo" className="footer-logo" />
          <span className="footer-title">Jan Samasya</span>
        </div>
        <nav className="footer-nav">
          <Link to="/home" className="footer-link">Home</Link>
          <Link to="/aboutus" className="footer-link">About</Link>
          <Link to="/problems" className="footer-link">Submit</Link>
        </nav>
        <div className="footer-social">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="footer-social-icon"><FaGithub /></a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="footer-social-icon"><FaTwitter /></a>
          <a href="mailto:support@jansamasya.com" className="footer-social-icon"><FaEnvelope /></a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Jan Samasya. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer; 