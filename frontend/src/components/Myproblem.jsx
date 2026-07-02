import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Card from './Card';
import { jwtDecode } from 'jwt-decode';
import '../assets/styls/Card.css';
const  Myproblem=() =>{
    const location = useLocation();
    const [myproblem, setmyproblem] = useState([]);
    const [user, setUser] = useState("")
const BASE_URL = import.meta.env.VITE_API_URL;
const fetchMyproblem = useCallback(async()=>{
try{
    const token = localStorage.getItem("token");
  const res=await axios.get(`${BASE_URL}/my-problems`,{
        headers:{Authorization:`Bearer ${token}`}
    });
    setmyproblem(res.data);
}catch(err){
    console.error(" some error ",err);
}
}, [BASE_URL]);


const handleDelete=async(problemId)=>{
    try{
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this problem?")) return;

 await axios.delete(`${BASE_URL}/problem/${problemId}`,{
        headers:{Authorization:`Bearer ${token}`}
    });

    alert("problem delted successfully");

    alert("problem deleted successfully");
    setmyproblem(myproblem.filter(p=> p._id !==problemId));//p all object id ek particulr object ki mongodb ki object id problemId 
    // jo apane delete ke liye aage bheji hai
}catch(err){
    console.error("delete error:",err);
    alert(err.response?.data?.message||"failed to deleted the problem")
}
};

useEffect(() => {
  const token = localStorage.getItem('token');
  if(token){
    try{
        const decoded=jwtDecode(token);
        setUser({
            username:decoded.username,
            city:decoded.city,


 userId: decoded.userId,
        });
      } catch (err) {
        console.error('❌ Token decode error:', err);
        localStorage.removeItem('token');
      }
    }
    fetchMyproblem();
  }, [location.key, fetchMyproblem]);







  return (
    <div className="problems-page">
      <div className="problems-page-header">
        <h2 className="problems-page-title">My Problems</h2>
        <p className="problems-page-subtitle">
          Problems you have reported in your city
        </p>
      </div>
      <Card
        problems={myproblem}
        user={user}
        refreshProblems={fetchMyproblem}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Myproblem
