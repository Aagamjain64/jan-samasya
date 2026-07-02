// ✅ AllProblems.jsx
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Card from './Card';
import { jwtDecode } from 'jwt-decode';
import '../assets/styls/Card.css';

const AllProblems = ({ searchTerm }) => {
  const location = useLocation();
  const [problems, setProblems] = useState([]);
  const [user, setUser] = useState({ username: '', city: '', userId: '', role: '' });
  const BASE_URL = import.meta.env.VITE_API_URL;

  const fetchProblems = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/problems`);
      setProblems(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch problems:', err);
    }
  }, [BASE_URL]);


const filteredProblems = searchTerm.trim() === ""
  ? problems
  : problems.filter(p =>
      (p.ProblemTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.City?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );


 const handleDelete=async(problemId)=>{
    try{
      const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this problem?")) return;

      await axios.delete(`${BASE_URL}/problem/${problemId}`, {
        headers:{Authorization:`Bearer ${token}`}
        
    });
    alert('problem are deleted!');
   setProblems(problems.filter(p => p._id.toString() !== problemId.toString()));

    
  }catch(err){
    console.error("something error bro",err);
    alert(err.response?.data?.message||"failed to deleted the data");
    
  }
  }


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          username: decoded.username,
          city: decoded.city,
          userId: decoded.userId,
          role: decoded.role,
        });
      } catch (err) {
        console.error('❌ Invalid token:', err);
        localStorage.removeItem('token');
      }
    } else {
      setUser({ username: '', city: '', userId: '', role: '' });
    }
    fetchProblems();
  }, [location.key, fetchProblems]);
return (
  <div className="problems-page">
    {!user?.userId && (
      <p className="problems-page-hint">
        If you want to create a problem, first{' '}
        <a href="/signup">sign up</a> or <a href="/login">sign in</a>.
      </p>
    )}

    <div className="problems-page-header">
      <h2 className="problems-page-title">All Problems</h2>
      <p className="problems-page-subtitle">
        Browse civic issues reported across cities
      </p>
    </div>

    <Card
      problems={filteredProblems}
      user={user}
      refreshProblems={fetchProblems}
      onDelete={handleDelete}
    />
  </div>
);
};

export default AllProblems;
