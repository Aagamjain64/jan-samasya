import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../assets/styls/Dashboard.css';

const STATUS_OPTIONS = [
  { value: 'Pending', pillClass: 'pending' },
  { value: 'In Progress', pillClass: 'progress' },
  { value: 'Resolved', pillClass: 'resolved' },
  { value: 'Rejected', pillClass: 'rejected' },
];

const ROLE_OPTIONS = [
  { value: 'user', label: 'Citizen', pillClass: 'user' },
  { value: 'mla', label: 'MLA', pillClass: 'mla' },
  { value: 'govt_employee', label: 'Govt', pillClass: 'govt_employee' },
  { value: 'admin', label: 'Admin', pillClass: 'admin' },
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

const AdminDashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusDrafts, setStatusDrafts] = useState({});
  const [remarksDrafts, setRemarksDrafts] = useState({});
  const [currentAdminId, setCurrentAdminId] = useState('');

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchStats = async () => {
    const res = await axios.get(`${BASE_URL}/admin/stats`, { headers: getAuthHeaders() });
    setStats(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${BASE_URL}/admin/users`, { headers: getAuthHeaders() });
    setUsers(res.data);
  };

  const fetchProblems = async () => {
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
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentAdminId(decoded.userId || '');
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMessage('');
      try {
        if (activeTab === 'overview') {
          await fetchStats();
        } else if (activeTab === 'problems') {
          await fetchProblems();
        } else {
          await fetchUsers();
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
        setMessage(err.response?.data?.msg || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTab]);

  const cities = useMemo(() => {
    const unique = [...new Set(problems.map((p) => p.City).filter(Boolean))];
    return unique.sort();
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesCity = cityFilter === 'all' || p.City === cityFilter;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        p.ProblemTitle?.toLowerCase().includes(term) ||
        p.City?.toLowerCase().includes(term) ||
        p.ProblemCategory?.toLowerCase().includes(term);
      return matchesCity && matchesSearch;
    });
  }, [problems, cityFilter, searchTerm]);

  const govtCountByCity = useMemo(() => {
    const counts = {};
    users
      .filter((u) => u.role === 'govt_employee')
      .forEach((u) => {
        const city = u.city?.trim().toLowerCase();
        if (city && city !== '—') {
          counts[city] = (counts[city] || 0) + 1;
        }
      });
    return counts;
  }, [users]);

  const isGovtRoleDisabled = (user, roleValue) => {
    if (roleValue !== 'govt_employee' || user.role === 'govt_employee') {
      return false;
    }
    const city = user.city?.trim().toLowerCase();
    if (!city || city === '—') {
      return true;
    }
    return (govtCountByCity[city] || 0) >= 5;
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(
        `${BASE_URL}/admin/users/${userId}/role`,
        { role: newRole },
        { headers: getAuthHeaders() }
      );
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      setMessage('Role updated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to update role.');
    }
  };

  const handleDeleteUser = async (user) => {
    const userId = user._id?.toString();
    if (userId === currentAdminId?.toString()) {
      setMessage('You cannot delete your own admin account.');
      return;
    }

    const confirmed = window.confirm(
      `Delete user "${user.username}"?\n\nThis will also remove their registration and all problems they posted.`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}/admin/users/${userId}`, {
        headers: getAuthHeaders(),
      });
      setUsers((prev) => prev.filter((u) => u._id?.toString() !== userId));
      setMessage(`User "${user.username}" deleted successfully.`);
      if (stats) {
        setStats((prev) => ({
          ...prev,
          totalUsers: Math.max(0, prev.totalUsers - 1),
        }));
      }
    } catch (err) {
      const apiMsg =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        err.response?.data?.message;
      if (err.response?.status === 404 && !apiMsg) {
        setMessage('Delete failed: backend server needs restart. Stop and run "node main.js" again in backend folder.');
      } else {
        setMessage(apiMsg || 'Failed to delete user.');
      }
    }
  };

  const handleSaveStatus = async (problemId) => {
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
            ? { ...p, status: statusDrafts[problemId], remarks: remarksDrafts[problemId] }
            : p
        )
      );
      setMessage('Problem status updated.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (problemId) => {
    if (!window.confirm('Delete this problem permanently?')) return;
    try {
      await axios.delete(`${BASE_URL}/problem/${problemId}`, { headers: getAuthHeaders() });
      setProblems((prev) => prev.filter((p) => p._id !== problemId));
      setMessage('Problem deleted.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete problem.');
    }
  };

  const handleEdit = (problem) => {
    navigate(`/edit/${problem._id}`, {
      state: {
        problem: {
          _id: problem._id,
          ProblemTitle: problem.ProblemTitle,
          ProblemDescription: problem.ProblemDescription,
          ProblemCategory: problem.ProblemCategory,
          State: problem.State,
          City: problem.City,
          Pincode: problem.Pincode,
          Urgency: problem.Urgency,
          isAnonymous: problem.isAnonymous,
          Image: problem.Image,
        },
      },
    });
  };

  const statCards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, color: '#2563eb' },
        { label: 'Total Problems', value: stats.totalProblems, color: '#0f766e' },
        { label: 'Pending', value: stats.pending, color: '#64748b' },
        { label: 'In Progress', value: stats.inProgress, color: '#d97706' },
        { label: 'Resolved', value: stats.resolved, color: '#059669' },
        { label: 'Rejected', value: stats.rejected, color: '#dc2626' },
      ]
    : [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Full access — all cities, all problems, all users. Admin role is set manually in MongoDB after signup.</p>
      </div>

      {message && <div className="alert alert-info dashboard-alert">{message}</div>}

      <div className="dashboard-tabs">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'problems', label: 'All Problems' },
          { id: 'users', label: 'Users & Roles' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`dashboard-tab ${activeTab === tab.id ? 'dashboard-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {activeTab === 'overview' && !loading && stats && (
        <div className="stat-grid">
          {statCards.map((card) => (
            <div className="stat-card" key={card.label}>
              <div className="stat-card-value" style={{ color: card.color }}>
                {card.value}
              </div>
              <div className="stat-card-label">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'problems' && !loading && (
        <>
          <div className="dashboard-toolbar">
            <select
              className="form-select"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="all">All cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <input
              type="search"
              className="form-control"
              placeholder="Search title, city, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredProblems.length === 0 ? (
            <p className="text-muted">No problems found.</p>
          ) : (
            filteredProblems.map((problem) => {
              const voteCount =
                (problem.Likes?.length || 0) + (problem.Dislikes?.length || 0);
              const currentStatus = statusDrafts[problem._id] || 'Pending';

              return (
                <div className="problem-admin-card" key={problem._id}>
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                    <h5>{problem.ProblemTitle}</h5>
                    <span className={getStatusBadgeClass(problem.status || 'Pending')}>
                      {problem.status || 'Pending'}
                    </span>
                  </div>
                  <p className="text-muted mb-0 mt-2">{problem.ProblemDescription}</p>
                  <div className="problem-meta-row">
                    <span>
                      <strong>Posted by:</strong>{' '}
                      {problem.PostedBy?.username || 'Unknown'}
                    </span>
                    <span>
                      <strong>City:</strong> {problem.City}, {problem.State}
                    </span>
                    <span>
                      <strong>Category:</strong> {problem.ProblemCategory}
                    </span>
                    <span>
                      <strong>Urgency:</strong> {problem.Urgency}
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

                  <div className="dashboard-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSaveStatus(problem._id)}
                    >
                      Save Status
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEdit(problem)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(problem._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </>
      )}

      {activeTab === 'users' && !loading && (
        <div className="users-table-wrap">
          <table className="table users-table mb-0">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>City</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.city}</td>
                  <td>
                    <div className="role-pill-group">
                      {ROLE_OPTIONS.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          className={`role-pill role-pill--${role.pillClass} ${
                            u.role === role.value ? 'role-pill--active' : ''
                          }`}
                          onClick={() => handleRoleChange(u._id, role.value)}
                          disabled={isGovtRoleDisabled(u, role.value)}
                          title={
                            isGovtRoleDisabled(u, role.value)
                              ? 'This city already has 5 government employees'
                              : undefined
                          }
                        >
                          {role.label}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u._id?.toString() === currentAdminId?.toString() ? (
                      <span className="text-muted small">You</span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteUser(u)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
