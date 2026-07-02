import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaEnvelope, FaInstagram } from 'react-icons/fa';
import '../assets/styls/Footer.css';
import logo from '../assets/react.svg';
import { brand, footerContent } from '../data/siteContent';

const socialIcons = {
  github: FaGithub,
  instagram: FaInstagram,
  envelope: FaEnvelope,
};

function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        <div className="footer-brand">
          <img src={logo} alt={`${brand.name} logo`} className="footer-logo" />
          <span className="footer-title">{footerContent.tagline}</span>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          {footerContent.links.map((item) => (
            <Link key={item.path} to={item.path} className="footer-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="footer-social">
          {footerContent.social.map((item) => {
            const Icon = socialIcons[item.icon];
            if (!Icon) return null;
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label={item.label}
              >
                <Icon />
              </a>
            );
          })}
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} {footerContent.copyrightName}. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
