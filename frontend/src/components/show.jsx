import React, {useState}from 'react';
import { useLocation } from 'react-router-dom';
import './Show.css'; // make sure this CSS file exists


const Show = () => {
  const { state } = useLocation();
  const problem = state?.problem;
const  [count, setcount] = useState(0)

  if (!problem) return <p>❌ No data received.</p>;

  return (
    <div className="show-page">
      <div className="problem-card">
        <h2>{problem.ProblemTitle}</h2>
        <p>{problem.ProblemDescription}</p>
        <p><strong>City:</strong> {problem.City}</p>
        <p><strong>State:</strong> {problem.State}</p>
       
        {problem.Image && (
  <img
    src={problem.Image}
    alt="Problem visual"
    className="problem-image"
  />
)}


        <button className="like-button" onClick={()=>{setcount(count+1)}}>👍 Vote {count}</button>
      </div>
    </div>
  );
};

export default Show;
