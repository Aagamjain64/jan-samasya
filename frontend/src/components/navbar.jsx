// src/components/MyNavbar.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom'; 
function MyNavbar({ searchTerm, setSearchTerm,setShowForm }) {
  const [username, setUsername] = useState("");
  const [cityname, setCityname] = useState("");

const navigate = useNavigate(); // inside component
useEffect(() => {
  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // in seconds
    
        if (decoded.exp < currentTime) {
          console.warn("🔒 Token expired. Logging out...");
          localStorage.removeItem("token");
          window.location.href = "/login"; // or use navigate("/login") if using react-router
        } else {
          setUsername(decoded.username); // ✅ token valid
setCityname(decoded.city);
        }
      } catch (err) {
        console.error("❌ Invalid token:", err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  checkToken(); // Check once on load

  const interval = setInterval(checkToken, 5000); // ✅ Keep checking every 5 seconds
  return () => clearInterval(interval); // Cleanup
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername("");
    window.location.href = "/problems";
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light fixed-top-3px"
         style={{ background: "linear-gradient(to right, #f7f8f8, #acbb78)" }}>
      <div className="container-fluid">
        <img src="logo-transparent.png" alt="Logo" style={{ height: "100px" }} />
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mynavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/home">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/aboutus">About Us</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact Us</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/problems">All Problems</Link></li>

            {username && (
              <li className="nav-item">
                <Link className="nav-link" to="/create" onClick={() => setShowForm(true)}>Create Problem ➕</Link>
              </li>
            )}

{username && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/my-problems">My problems</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/city-wise">{cityname}</Link></li>
                  
              </>
              
              
            )}

            {!username && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/signup">Sign Up</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/login">Sign In</Link></li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
  <input
    className="form-control me-2"
    type="search"
    placeholder="Enter city or problem"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button
    className="btn btn-primary me-3"
    type="button"
    onClick={() => navigate('/problems')}  // 👈 navigate to filtering page
  >
    Search
  </button>
            {username && (
              <>
                <span className="me-2">Welcome, <b>{username}</b></span>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
              </>
            )}
       </div>
        </div>
      </div>
    </nav>
  );
}

export default MyNavbar;
