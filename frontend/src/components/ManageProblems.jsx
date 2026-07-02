import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../assets/styls/Dashboard.css';

const STATUS_OPTIONS = [
  { value: 'Pending', pillClass: 'pending' },
  { value: 'In Progress', pillClass: 'progress' },
  { value: 'Resolved', pillClass: 'resolved' },
  { value: 'Rejected', pillClass: 'rejected' },
];

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'In Progress':
      return 'badge-status badge-status--progress';
    case 'Resolved':
      return 'badge-status badge-status--resolved';
    case 'Rejected':
      return 'badge-status badge-status--rejected';
    default:
      return 'badge-status badge-status--pending';
  }
};

const ManageProblems = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [problems, setProblems] = useState([]);
  const [userCity, setUserCity] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [remarksDrafts, setRemarksDrafts] = useState({});

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserCity(decoded.city || '');
        setUserRole(decoded.role || '');
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }

    const fetchProblems = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/problems`);
        setProblems(res.data);

        const drafts = {};
        const remarks = {};
        res.data.forEach((p) => {
          drafts[p._id] = p.status || 'Pending';
          remarks[p._id] = p.remarks || '';
        });
        setStatusDrafts(drafts);
        setRemarksDrafts(remarks);
      } catch (err) {
        console.error('Failed to fetch problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const cityProblems = problems.filter(
    (p) => p.City?.toLowerCase() === userCity?.toLowerCase()
  );

  const handleSave = async (problemId) => {
    try {
      await axios.patch(
        `${BASE_URL}/problems/${problemId}/status`,
        {
          status: statusDrafts[problemId],
          remarks: remarksDrafts[problemId],
        },
        { headers: getAuthHeaders() }
      );

      setProblems((prev) =>
        prev.map((p) =>
          p._id === problemId
            ? {
                ...p,
                status: statusDrafts[problemId],
                remarks: remarksDrafts[problemId],
              }
            : p
        )
      );
      alert('Status updated successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const roleLabel = userRole === 'mla' ? 'MLA' : 'Government Employee';

  if (loading) {
    return (
      <div className="dashboard-page">
        <p>Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage Problems</h1>
        <p>
          {roleLabel} panel — only <strong>{userCity || 'your city'}</strong> complaints are shown.
          Multiple MLAs from the same city can manage independently.
        </p>
      </div>

      {cityProblems.length === 0 ? (
        <p className="text-muted">No problems found for {userCity || 'your city'}.</p>
      ) : (
        cityProblems.map((problem) => {
          const voteCount =
            (problem.Likes?.length || 0) + (problem.Dislikes?.length || 0);
          const currentStatus = statusDrafts[problem._id] || 'Pending';

          return (
            <div className="manage-problem-card" key={problem._id}>
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                <h5>{problem.ProblemTitle}</h5>
                <span className={getStatusBadgeClass(problem.status || 'Pending')}>
                  {problem.status || 'Pending'}
                </span>
              </div>

              <p className="text-muted mt-2 mb-0">{problem.ProblemDescription}</p>

              <div className="problem-meta-row">
                <span>
                  <strong>Category:</strong> {problem.ProblemCategory}
                </span>
                <span>
                  <strong>Urgency:</strong> {problem.Urgency}
                </span>
                <span>
                  <strong>City:</strong> {problem.City}
                </span>
                <span>
                  <strong>Votes:</strong> {voteCount}
                </span>
              </div>

              <label className="form-label mb-1">Update status</label>
              <div className="status-pill-group">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`status-pill status-pill--${opt.pillClass} ${
                      currentStatus === opt.value ? 'status-pill--active' : ''
                    }`}
                    onClick={() =>
                      setStatusDrafts((prev) => ({ ...prev, [problem._id]: opt.value }))
                    }
                  >
                    {opt.value}
                  </button>
                ))}
              </div>

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Remarks (optional)"
                value={remarksDrafts[problem._id] || ''}
                onChange={(e) =>
                  setRemarksDrafts((prev) => ({
                    ...prev,
                    [problem._id]: e.target.value,
                  }))
                }
              />

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleSave(problem._id)}
              >
                Save Changes
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ManageProblems;
