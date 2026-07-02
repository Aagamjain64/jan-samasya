import React from 'react';
import { Link } from 'react-router-dom';
import { landing, routes, termsPage } from '../data/siteContent';
import '../assets/styls/Landing.css';

function Terms() {
  return (
    <div className="page-shell terms-shell">
      <nav className="terms-breadcrumb" aria-label="Breadcrumb">
        <Link to={routes.home} className="terms-breadcrumb-link">
          ← Back to home
        </Link>
      </nav>
      <header className="terms-header">
        <span className="landing-badge">{landing.badge}</span>
        <h1 className="terms-title">{termsPage.title}</h1>
      </header>
      <div className="terms-grid">
        {termsPage.sections.map((section) => (
          <section key={section.heading} className="terms-card">
            <h2 className="terms-card-heading">{section.heading}</h2>
            <p className="terms-card-body">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

export default Terms;
