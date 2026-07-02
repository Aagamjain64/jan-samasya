import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styls/yt.css';
import logo from '../assets/react.svg';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { brand, homeMedia, routes } from '../data/siteContent';

function Yt() {
  const navigate = useNavigate();

  const handleSubmitClick = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert(homeMedia.loginRequiredAlert);
      return;
    }

    navigate(routes.create);
  };

  return (
    <div className="yt-home-wrapper">
      <div className="yt-home-video">
        <iframe
          width="100%"
          height="100%"
          src={homeMedia.videoEmbedSrc}
          title={homeMedia.videoTitle}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="yt-home-content">
        <img src={logo} alt={`${brand.name} logo`} className="yt-home-logo" />
        <h1>
          {homeMedia.headlinePrefix}{' '}
          <span className="yt-presenter-name">{homeMedia.presenterName}</span>
        </h1>

        <p className="yt-home-tagline">{brand.tagline}</p>
        <p className="yt-home-body">{homeMedia.description}</p>
        <button type="button" onClick={handleSubmitClick} className="yt-home-btn">
          <FaPlus className="yt-home-btn-icon" aria-hidden />
          {homeMedia.submitCta}
        </button>
        <p className="yt-home-footnote">
          {homeMedia.footnote.prefix}{' '}
          <Link to={routes.signup} className="yt-home-inline-link">
            {homeMedia.footnote.signup}
          </Link>{' '}
          {homeMedia.footnote.mid}{' '}
          <Link to={routes.problems} className="yt-home-inline-link">
            {homeMedia.footnote.browse}
          </Link>
          {homeMedia.footnote.suffix}
        </p>
      </div>
    </div>
  );
}

export default Yt;
