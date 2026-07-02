import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { navbarContent, routes } from '../data/siteContent';
import '../assets/styls/Navbar.css';

function MyNavbar({ searchTerm, setSearchTerm, setShowForm }) {
  const [username, setUsername] = useState('');
  const [cityname, setCityname] = useState('');
  const [userRole, setUserRole] = useState('');

  const navigate = useNavigate();

  const isLoggedIn = Boolean(username);
  const isAdmin = userRole === 'admin';
  const isOfficial = userRole === 'mla' || userRole === 'govt_employee';
  const isCitizen = isLoggedIn && !isAdmin && !isOfficial;

  const closeNavbar = () => {
    const navbar = document.getElementById('mynavbar');
    if (navbar && navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  };

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUsername('');
        setCityname('');
        setUserRole('');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setUsername('');
          setCityname('');
          setUserRole('');
          window.location.href = '/login';
        } else {
          setUsername(decoded.username || '');
          setCityname(decoded.city || '');
          setUserRole(decoded.role || 'user');
        }
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
        setUsername('');
        setCityname('');
        setUserRole('');
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    setCityname('');
    setUserRole('');
    window.location.href = routes.problems;
  };

  const roleBadgeLabel = {
    user: 'Citizen',
    admin: 'Admin',
    mla: 'MLA',
    govt_employee: 'Govt Employee',
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light app-navbar fixed-top">
      <div className="container-fluid app-navbar-inner">
        <Link className="app-navbar-brand" to="/" onClick={closeNavbar}>
          <img src="logo-transparent.png" alt="Jan Samasya" className="app-navbar-logo" />
          <span className="app-navbar-brand-text">{navbarContent.brandShort || 'Jan Samasya'}</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mynavbar"
          aria-controls="mynavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mynavbar">
          <ul className="navbar-nav app-navbar-links me-lg-auto">
            <li className="nav-item">
              <Link className="nav-link" to={routes.home} onClick={closeNavbar}>
                {navbarContent.links.home}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={routes.problems} onClick={closeNavbar}>
                {navbarContent.links.allProblems}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={routes.about} onClick={closeNavbar}>
                {navbarContent.links.about}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={routes.contact} onClick={closeNavbar}>
                {navbarContent.links.contact}
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link nav-link-admin" to="/admin" onClick={closeNavbar}>
                  Admin Dashboard
                </Link>
              </li>
            )}

            {isOfficial && (
              <li className="nav-item">
                <Link className="nav-link nav-link-official" to="/manage" onClick={closeNavbar}>
                  Manage · {cityname || 'City'}
                </Link>
              </li>
            )}

            {isCitizen && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={routes.create}
                    onClick={() => {
                      setShowForm(true);
                      closeNavbar();
                    }}
                  >
                    {navbarContent.links.createProblem}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={routes.myProblems} onClick={closeNavbar}>
                    {navbarContent.links.myProblems}
                  </Link>
                </li>
                {cityname && (
                  <li className="nav-item">
                    <Link className="nav-link" to={routes.cityWise} onClick={closeNavbar}>
                      {cityname} {navbarContent.links.cityProblemsSuffix}
                    </Link>
                  </li>
                )}
              </>
            )}

            {!isLoggedIn && (
              <>
                <li className="nav-item d-lg-none">
                  <Link className="nav-link" to={routes.signup} onClick={closeNavbar}>
                    {navbarContent.links.signup}
                  </Link>
                </li>
                <li className="nav-item d-lg-none">
                  <Link className="nav-link" to={routes.login} onClick={closeNavbar}>
                    {navbarContent.links.signin}
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="app-navbar-actions">
            <div className="app-navbar-search-row">
              <input
                className="form-control app-navbar-search-input"
                type="search"
                placeholder={navbarContent.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="btn btn-navbar-search"
                type="button"
                onClick={() => {
                  closeNavbar();
                  navigate(routes.problems);
                }}
              >
                {navbarContent.searchButton}
              </button>
            </div>

            {!isLoggedIn && (
              <div className="app-navbar-auth d-none d-lg-flex">
                <Link to={routes.login} className="btn btn-navbar-login btn-sm">
                  {navbarContent.links.signin}
                </Link>
                <Link to={routes.signup} className="btn btn-navbar-signup btn-sm">
                  {navbarContent.links.signup}
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <div className="app-navbar-user-block">
                <div className="app-navbar-user-meta">
                  <span className="app-navbar-user-name">{username}</span>
                  <span className={`app-role-badge app-role-badge--${userRole || 'user'}`}>
                    {roleBadgeLabel[userRole] || 'Citizen'}
                    {isOfficial && cityname ? ` · ${cityname}` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-navbar-logout btn-sm"
                >
                  {navbarContent.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MyNavbar;
