import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaEnvelope, FaInstagram } from 'react-icons/fa';
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
          <a href="https://github.com/Aagamjain64" target="_blank" rel="noopener noreferrer" className="footer-social-icon"><FaGithub /></a>
          <a href="https://www.instagram.com/aagamjain_64/" target="_blank" rel="noopener noreferrer" className="footer-social-icon"><FaInstagram /></a>
          <a href="mailto:jaagam412@gmail.com" className="footer-social-icon"><FaEnvelope /></a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Jan Samasya. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer; 