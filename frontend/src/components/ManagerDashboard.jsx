import React, { useState, useEffect } from "react";
import { getCoverage, getAllPTORequests, updatePTOStatus } from "../api/api";
import UserManagement from "./UserManagement";

const ManagerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [team, setTeam] = useState("Core");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [coverage, setCoverage] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllRequests();
  }, []);

  const loadAllRequests = async () => {
    try {
      const res = await getAllPTORequests();
      setAllRequests(res.data);
    } catch (err) {
      console.error("Error loading requests:", err);
    }
  };

  const handleFetch = async () => {
    if (!from || !to) {
      alert("Please select both from and to dates");
      return;
    }
    try {
      setLoading(true);
      const res = await getCoverage(team, from, to);
      setCoverage(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await updatePTOStatus(requestId, newStatus);
      await loadAllRequests(); // Reload requests
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", component: null },
    { id: "requests", label: "PTO Requests", component: null },
    { id: "coverage", label: "Coverage Analysis", component: null },
    { id: "team", label: "Team Management", component: UserManagement }
  ];

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Total Requests</h3>
            <p>{allRequests.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p>{allRequests.filter(r => r.status === 'pending').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Approved</h3>
            <p>{allRequests.filter(r => r.status === 'approved').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>Denied</h3>
            <p>{allRequests.filter(r => r.status === 'denied').length}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="requests-section">
      <h3>All PTO Requests</h3>
      <div className="requests-list">
        {allRequests.length === 0 ? (
          <div className="empty-state">No PTO requests found</div>
        ) : (
          allRequests.map(request => (
            <div key={request._id} className="request-item">
              <div className="request-info">
                <div className="employee-info">
                  <span className="employee-name">{request.user?.name || 'Unknown'}</span>
                  <span className="employee-email">{request.user?.email}</span>
                </div>
                <div className="request-dates">
                  {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                </div>
                <div className="request-reason">{request.reason || 'No reason provided'}</div>
              </div>
              <div className="request-actions">
                <span className={`status-badge ${request.status}`}>
                  {request.status.toUpperCase()}
                </span>
                {request.status === 'pending' && (
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleStatusUpdate(request._id, 'approved')}
                      className="approve-btn"
                    >
                      ✅ Approve
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(request._id, 'denied')}
                      className="deny-btn"
                    >
                      ❌ Deny
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderCoverage = () => (
    <div className="coverage-section">
      <div className="coverage-query-section">
          <h3>Coverage Analysis</h3>
        <div className="query-form">
          <div className="form-group">
            <label>Team</label>
            <input 
              type="text" 
              value={team} 
              placeholder="Enter team name" 
              onChange={(e) => setTeam(e.target.value)} 
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>From Date</label>
              <input 
                type="date" 
                value={from} 
                onChange={(e) => setFrom(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>To Date</label>
              <input 
                type="date" 
                value={to} 
                onChange={(e) => setTo(e.target.value)} 
              />
            </div>
          </div>

          <button onClick={handleFetch} className="submit-button" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Coverage"}
          </button>
        </div>
      </div>

      {coverage && (
        <div className="coverage-results">
          <h3>Coverage Results for {coverage.team}</h3>
          <div className="coverage-cards">
            {Object.entries(coverage.details).map(([role, detail]) => (
              <div key={role} className={`coverage-card ${detail.risk ? 'risk' : 'safe'}`}>
                <div className="card-header">
                  <h4 className="role-title">{role?.charAt(0)?.toUpperCase() + role?.slice(1) || role || 'Unknown'}</h4>
                  <span className={`status-badge ${detail.risk ? 'risk' : 'safe'}`}>
                    {detail.risk ? "At Risk" : "Safe"}
                  </span>
                </div>
                
                <div className="coverage-stats">
                  <div className="stat-row">
                    <span className="stat-label">Team Size:</span>
                    <span className="stat-value">{detail.teamCount}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Min On Duty:</span>
                    <span className="stat-value">{detail.minOnDuty}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Currently Off:</span>
                    <span className="stat-value">{detail.off}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Max Allowed Off:</span>
                    <span className="stat-value">{detail.maxAllowedOff}</span>
                  </div>
                </div>

                {detail.risk && (
                  <div className="risk-warning">
                    <p>⚠️ Coverage risk detected! Consider adjusting schedules.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'requests': return renderRequests();
      case 'coverage': return renderCoverage();
      case 'team': return <UserManagement />;
      default: return renderOverview();
    }
  };

  return (
    <div className="manager-dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <div className="user-avatar">
            <span>{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
          <div className="user-details">
            <h3>Welcome back, {user.name}!</h3>
            <p>Manager Dashboard</p>
          </div>
        </div>
        <button onClick={onLogout} className="logout-button">Sign out</button>
      </div>

      <nav className="dashboard-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`dashboard-nav-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="dashboard-content">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default ManagerDashboard;
