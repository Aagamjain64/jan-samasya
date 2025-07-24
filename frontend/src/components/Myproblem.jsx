import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card'; // same card component you use in AllProblems
import { jwtDecode } from 'jwt-decode';
const  Myproblem=() =>{
    const [myproblem, setmyproblem] = useState([]);
    const [user, setUser] = useState("")
const BASE_URL = import.meta.env.VITE_API_URL;
const fetchMyproblem = async()=>{
try{
    const token = localStorage.getItem("token");
  const res=await axios.get(`${BASE_URL}/my-problems`,{
        headers:{Authorization:`Bearer ${token}`}
    });
    setmyproblem(res.data);
}catch(err){
    console.error(" some error ",err);
}
};


const handleDelete=async(problemId)=>{
    try{
    const token = localStorage.getItem("token");
 await axios.delete(`${BASE_URL}/problem/${problemId}`,{
        headers:{Authorization:`Bearer ${token}`}
    });
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
  }, []);







  return (
    <div>
        <h2 className='text-center font-extrabold text-ellipsis my-10'>Your-problems</h2>
  <Card problems={myproblem} user={user}  refreshProblems={fetchMyproblem} onDelete={handleDelete}/>  
    </div>
  )
}

export default Myproblem
