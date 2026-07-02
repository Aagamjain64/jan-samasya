import React from 'react';
import { Link } from 'react-router-dom';
import { brand, landing, routes } from '../data/siteContent';
import '../assets/styls/Landing.css';

function Front() {
  return (
    <div className="page-shell landing-page">
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <span className="landing-badge">{landing.badge}</span>
          <h1 className="landing-title">{landing.title}</h1>
          <p className="landing-subtitle">{landing.subtitle}</p>
          <div className="landing-actions">
            <Link className="btn btn-primary-landing" to={landing.primaryCta.path}>
              {landing.primaryCta.label}
            </Link>
            <Link className="btn btn-ghost-landing" to={landing.secondaryCta.path}>
              {landing.secondaryCta.label}
            </Link>
            <Link className="btn btn-link-landing" to={landing.tertiaryCta.path}>
              {landing.tertiaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-stats" aria-label="Highlights">
        {landing.stats.map((item) => (
          <div key={item.label} className="landing-stat">
            <span className="landing-stat-value">{item.value}</span>
            <span className="landing-stat-label">{item.label}</span>
          </div>
        ))}
      </section>

      <section className="landing-features" aria-labelledby="features-heading">
        <h2 id="features-heading" className="landing-section-title">
          Why {brand.name}?
        </h2>
        <div className="landing-feature-grid">
          {landing.featureCards.map((card) => (
            <article key={card.title} className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden>
                {card.icon}
              </span>
              <h3 className="landing-feature-title">{card.title}</h3>
              <p className="landing-feature-body">{card.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Front;
