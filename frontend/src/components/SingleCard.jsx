import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Show from './show';
import { FaTrash, FaEdit, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const SingleCard = ({
  image,
  CardDescription,
  CardTitle,
  Cardcity,
  CardState,
  problemId,
  problemPostedBy,
      postedByUsername,
  isVotingEnabled,
  user,
  refreshProblems,
  onDelete
}) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [voting, setVoting] = useState(isVotingEnabled);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [userChoice, setUserChoice] = useState(null); // 'like', 'dislike', or null

  const isCreator = user?.userId?.toString() === problemPostedBy?.toString();
  const isSameCity = user?.city?.toLowerCase() === Cardcity?.toLowerCase();

  // 🔄 Fetch vote count initially
  
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/problems/${problemId}`);
        setVoting(res.data.isVotingEnabled);
        setLikes(res.data.Likes || []);
        setDislikes(res.data.Dislikes || []);
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
        console.error("❌ Vote count fetch error", err);
      }
    };
    fetchVotes();
  }, [problemId, user?.userId]);

  const handleEnable = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${BASE_URL}/enable-voting/${problemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Voting enabled!");
      setVoting(true); // instantly reflect

      refreshProblems(); // optional
    } catch (err) {
      console.error("❌ Enable error:", err);
      alert(err.response?.data?.message || "Failed to enable voting.");
    }
  };

  const handleDisable = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${BASE_URL}/disable-voting/${problemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("🚫 Voting disabled!");
      setVoting(false);
      refreshProblems();
    } catch (err) {
      console.error("❌ Disable error:", err);
      alert(err.response?.data?.message || "Failed to disable voting.");
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/like/${problemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserChoice('like');
      setLikes(prev => [...prev, user.userId]);//like array me add karna
      setDislikes(prev => prev.filter(id => id !== user.userId));// dislike array se remove karna Purani Dislikes list me se current user ki ID hata do
    } catch (error) {
      console.error("❌ Like error:", error);
      alert(error.response?.data?.message || "Failed to like");
    }
  };

  const handleDislike = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/dislike/${problemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserChoice('dislike');
      setDislikes(prev => [...prev, user.userId]);
      setLikes(prev => prev.filter(id => id !== user.userId));
    } catch (error) {
      console.error("❌ Dislike error:", error);
      alert(error.response?.data?.message || "Failed to dislike");
    }
  };


 
  return (
    <div className="card h-100 shadow-sm">

          <p className="fs-5 text-primary fw-bold">User: {postedByUsername}</p>

      <img
        src={image}
        className="card-img-top"
        alt="Problem"
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body text-center">
        <h5 className="card-title text-dark">{CardTitle}</h5>
        <p className="card-text text-muted">{CardDescription}</p>
        <p className="text-secondary mb-3">
          {Cardcity}, {CardState}
        </p>

        {/* Total Votes Display */}
        <p><strong>Total Votes: {likes.length + dislikes.length}</strong></p>

        {/* Percentage Bar: Always show */}
        <div className="w-100 mb-2" style={{ maxWidth: '200px' }}>
          <div className="progress" style={{ height: '20px' }}>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${(likes.length + dislikes.length > 0 ? (likes.length / (likes.length + dislikes.length)) * 100 : 0)}%` }}
              aria-valuenow={likes.length}
              aria-valuemin="0" //ROLE ARIA HOTA HAI (accessibility)
              aria-valuemax={likes.length + dislikes.length}
            >
              {likes.length + dislikes.length > 0 ? `${Math.round((likes.length / (likes.length + dislikes.length)) * 100)}% Like` : '0% Like'}
            </div>
            <div
              className="progress-bar bg-danger"
              role="progressbar"
              style={{ width: `${(likes.length + dislikes.length > 0 ? (dislikes.length / (likes.length + dislikes.length)) * 100 : 0)}%` }}
              aria-valuenow={dislikes.length}
              aria-valuemin="0"
              aria-valuemax={likes.length + dislikes.length}
            >
              {likes.length + dislikes.length > 0 ? `${Math.round((dislikes.length / (likes.length + dislikes.length)) * 100)}% Dislike` : '0% Dislike'}
            </div>
          </div>
          <div className="d-flex justify-content-between small mt-1">
            <span>{likes.length} Like</span>
            <span>{dislikes.length} Dislike</span>
          </div>
        </div>
        {/* Like/Dislike Buttons: Only show if voting is enabled */}
        {voting && isSameCity && (
          <div className="d-flex flex-column align-items-center mb-2">
            <div className="btn-group mb-2" role="group">
             <button
  className={`btn btn-outline-success ${userChoice === 'like' ? 'active' : ''}`}
  onClick={handleLike}
  disabled={userChoice === 'like'}
  title="Like"
>
  <FaThumbsUp />
</button>

<button
  className={`btn btn-outline-danger ${userChoice === 'dislike' ? 'active' : ''}`}
  onClick={handleDislike}
  disabled={userChoice === 'dislike'}
  title="Dislike"
>
  <FaThumbsDown />
</button>

            </div>
          </div>
        )}

        {/* Creator controls for voting */}
        {isCreator && voting && (
          <button className="btn btn-outline-danger me-2" onClick={handleDisable}>
            Disable Voting
          </button>
        )}
        {isCreator && !voting && (
          <button className="btn btn-outline-success me-2" onClick={handleEnable}>
            Enable Voting
          </button>
        )} 

{isCreator && (
  <button className="btn btn-outline-danger me-2" onClick={() => onDelete(problemId)} title="Delete">
    <FaTrash />
  </button>
)}

{isCreator &&
<button
  className="btn btn-outline-primary me-2"
  title="Edit"
  onClick={() =>
    navigate(`/edit/${problemId}`, {
      state: {
        problem: {
          _id: problemId,
          ProblemTitle: CardTitle,
          ProblemDescription: CardDescription,
          ProblemCategory: 'Infrastructure',
          State: CardState,
          City: Cardcity,
          Pincode: '302012',
          Urgency: 'High',
          isAnonymous: false,
          Image: image
        }
      }
    })
  }
>
  <FaEdit />
</button>
}

<button
  className="btn btn-outline-info"
  onClick={() =>
    navigate('/show', {
      state: {
        problem: {
          _id: problemId,
          ProblemTitle: CardTitle,
          ProblemDescription: CardDescription,
          ProblemCategory: 'Infrastructure',
          State: CardState,
          City: Cardcity,
          Pincode: '302012',
          Urgency: 'High',
          isAnonymous: false,
          Image: image,
          Likes: likes,
          Dislikes: dislikes,
          isVotingEnabled: voting,
          PostedBy: problemPostedBy,
          postedByUsername,
        },
        user,          // 👈 logged-in user
              // 👈 optional, if you pass function
      }
    })
  }
>
  Show
</button>

        
      </div>
    </div>
  );
};

export default SingleCard;
