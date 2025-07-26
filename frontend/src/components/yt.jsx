import React from 'react'
import { Link } from 'react-router-dom';
import '../assets/styls/yt.css';
import logo from '../assets/react.svg'; // Use your logo if available
import { FaPlus } from 'react-icons/fa';

function Yt() {
  return (
    <div className="yt-home-wrapper">
      {/* Left side: YouTube video */}
      <div className="yt-home-video">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Right side: Content */}
      <div className="yt-home-content">
        <img src={logo} alt="Jan Samasya Logo" className="yt-home-logo" />
     <h1>Welcome to Jan Samasya — Presented by  <span className="text-red-500">Aagam Jain</span></h1>

        <p className="yt-home-tagline">Empowering communities, one problem at a time.</p>
        <p>Raise public issues and support your community by voting on problems that matter to you.</p>
        <Link to="/create" className="yt-home-btn">
          <FaPlus className="yt-home-btn-icon" /> Submit a Problem
        </Link>
      </div>
    </div>
  );
}

export default Yt; 