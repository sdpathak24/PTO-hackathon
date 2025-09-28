import React, { useState, useEffect } from "react";
import { getAllPTORequests } from "../api/api";

const PTOHistory = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await getAllPTORequests();
      // Filter requests for current user (in real app, backend would handle this)
      const userRequests = response.data.filter(req => req.user?.email === user.email);
      setRequests(userRequests);
    } catch (error) {
      console.error("Error loading PTO requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'denied': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅';
      case 'denied': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading your PTO requests...</div>
      </div>
    );
  }

  return (
    <div className="pto-history">
      <div className="section-header">
        <h2>📋 My PTO Requests</h2>
        <p>Track the status of your time-off requests</p>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No PTO requests yet</h3>
          <p>Submit your first PTO request to get started!</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map(request => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <div className="request-dates">
                  <span className="date-range">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </span>
                  <span className="days-count">
                    {calculateDays(request.startDate, request.endDate)} days
                  </span>
                </div>
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(request.status) }}
                >
                  <span className="status-icon">{getStatusIcon(request.status)}</span>
                  <span className="status-text">{request.status.toUpperCase()}</span>
                </div>
              </div>

              <div className="request-details">
                {request.reason && (
                  <div className="reason-section">
                    <strong>Reason:</strong> {request.reason}
                  </div>
                )}
                <div className="submission-info">
                  <span>Submitted: {formatDate(request.createdAt)}</span>
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="pending-notice">
                  <span>⏳ Your request is being reviewed by management</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PTOHistory;
