import React from 'react';
import { brand, aboutPage } from '../data/siteContent';
import '../assets/styls/Landing.css';

const AboutUs = () => {
  return (
    <div className="page-shell about-shell">
      <header className="about-header">
        <span className="landing-badge" style={{ background: 'rgba(15, 118, 110, 0.12)', color: '#0f766e', border: '1px solid rgba(15, 118, 110, 0.25)' }}>
          {brand.name}
        </span>
        <h1 className="about-title">{aboutPage.title}</h1>
        <p className="about-lead">{aboutPage.lead}</p>
      </header>

      <section className="about-card" aria-labelledby="features-list">
        <h2 id="features-list" className="about-subheading">
          {aboutPage.featuresHeading}
        </h2>
        <ul className="about-list">
          {aboutPage.features.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="about-mission">
        <p className="about-mission-text">
          <strong>{aboutPage.missionLabel}:</strong> {aboutPage.mission}
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
