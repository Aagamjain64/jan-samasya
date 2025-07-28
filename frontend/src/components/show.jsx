import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './show.css';
import { FaTrash, FaEdit, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const Show = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const problem = state?.problem;
  const user = state?.user;

  const [likes, setLikes] = useState(problem?.Likes || []);
  const [dislikes, setDislikes] = useState(problem?.Dislikes || []);
  const [voting, setVoting] = useState(problem?.isVotingEnabled || false);
  const [userChoice, setUserChoice] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const isCreator = user?.userId?.toString() === problem?.PostedBy?.toString();
  const isSameCity = user?.city?.toLowerCase() === problem?.City?.toLowerCase();

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/problems/${problem._id}`);
        setLikes(res.data.Likes || []);
        setDislikes(res.data.Dislikes || []);
        setVoting(res.data.isVotingEnabled);

        if (user?.userId) {
          if (res.data.Likes?.some(id => id === user.userId || id?._id === user.userId)) {
            setUserChoice('like');
          } else if (res.data.Dislikes?.some(id => id === user.userId || id?._id === user.userId)) {
            setUserChoice('dislike');
          } else {
            setUserChoice(null);
          }
        }
      } catch (err) {
        console.error("❌ Vote fetch error:", err);
      }
    };
    fetchVotes();
  }, [problem._id, user?.userId]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/like/${problem._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserChoice('like');
      setLikes(prev => [...prev, user.userId]);
      setDislikes(prev => prev.filter(id => id !== user.userId));
    } catch (err) {
      console.error("❌ Like error:", err);
    }
  };

  const handleDislike = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/dislike/${problem._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserChoice('dislike');
      setDislikes(prev => [...prev, user.userId]);
      setLikes(prev => prev.filter(id => id !== user.userId));
    } catch (err) {
      console.error("❌ Dislike error:", err);
    }
  };

  const handleEnable = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${BASE_URL}/enable-voting/${problem._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Voting enabled!");
      setVoting(true);
    } catch (err) {
      console.error("❌ Enable error:", err);
    }
  };

  const handleDisable = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${BASE_URL}/disable-voting/${problem._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("🚫 Voting disabled!");
      setVoting(false);
    } catch (err) {
      console.error("❌ Disable error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/delete/${problem._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("🗑️ Deleted");
      navigate('/');
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${problem._id}`, { state: { problem } });
  };

  if (!problem) return <p>❌ No problem data received.</p>;

  return (
    <div className="show-page container py-4">

      {problem.Image && (
      <img
  src={problem.Image}
  alt="Problem visual"
  className="img-fluid mb-1 rounded shadow"
  style={{ height: "300px", width: "300px", objectFit: "cover" }}
/>

      )}

      <h2 className="text-dark">{problem.ProblemTitle}</h2>
      <p className="lead"><strong>Description:</strong>{problem.ProblemDescription}</p>
      <p><strong>City:</strong> {problem.City}</p>
      <p><strong>State:</strong> {problem.State}</p>

      <p className="mt-3"><strong>Total Votes:</strong> {likes.length + dislikes.length}</p>

      {/* Progress bar */}
      <div className="progress my-3" style={{ height: '25px', maxWidth: '500px' }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${(likes.length / (likes.length + dislikes.length || 1)) * 100}%` }}
        >
          {Math.round((likes.length / (likes.length + dislikes.length || 1)) * 100)}% Like
        </div>
        <div
          className="progress-bar bg-danger"
          role="progressbar"
          style={{ width: `${(dislikes.length / (likes.length + dislikes.length || 1)) * 100}%` }}
        >
          {Math.round((dislikes.length / (likes.length + dislikes.length || 1)) * 100)}% Dislike
        </div>
      </div>

      {/* Like/Dislike Buttons */}
      {voting && isSameCity && (
        <div className="btn-group my-3">
          <button
            className={`btn btn-outline-success ${userChoice === 'like' ? 'active' : ''}`}
            onClick={handleLike}
            disabled={userChoice === 'like'}
          >
            <FaThumbsUp /> Like
          </button>
          <button
            className={`btn btn-outline-danger ${userChoice === 'dislike' ? 'active' : ''}`}
            onClick={handleDislike}
            disabled={userChoice === 'dislike'}
          >
            <FaThumbsDown /> Dislike
          </button>
        </div>
      )}

      {/* Admin Controls */}
      {isCreator && (
        <div className="mt-4 d-flex flex-wrap gap-3">
          {voting ? (
            <button className="btn btn-outline-danger" onClick={handleDisable}>
              Disable Voting
            </button>
          ) : (
            <button className="btn btn-outline-success" onClick={handleEnable}>
              Enable Voting
            </button>
          )}
          <button className="btn btn-outline-primary" onClick={handleEdit}>
            <FaEdit /> Edit
          </button>
          <button className="btn btn-outline-danger" onClick={handleDelete}>
            <FaTrash /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Show;
