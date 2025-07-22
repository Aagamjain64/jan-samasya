// ✅ AllProblems.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import { jwtDecode } from 'jwt-decode';

const AllProblems = ({searchTerm} ) => {
  const [problems, setProblems] = useState([]);
  const [user, setUser] = useState({ username: '', city: '', userId: '' });
  const BASE_URL = import.meta.env.VITE_API_URL;

  const fetchProblems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/problems`);
      console.log('🧠 Problems Fetched from Server:', res.data);
      setProblems(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch problems:', err);
    }
  };

const filteredProblems = searchTerm.trim() === ""
  ? problems
  : problems.filter(p =>
      (p.ProblemTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.City?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );


 const handleDelete=async(problemId)=>{
    try{
      const token = localStorage.getItem("token");
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
        });
      } catch (err) {
        console.error('❌ Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
    fetchProblems();
  }, []);

  return (
    <div>
      <h2 className="text-center font-bold text-2xl my-4">All Problems</h2>
      <Card problems={filteredProblems} user={user} refreshProblems={fetchProblems}  onDelete={handleDelete}  />
    </div>
  );
};

export default AllProblems;