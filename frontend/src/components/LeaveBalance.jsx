import React, { useState, useEffect } from "react";
import { getLeaveBalances } from "../api/api";

const LeaveBalance = ({ user }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.email) {
      loadBalance();
    }
  }, [user]);

  const loadBalance = async () => {
    try {
      setLoading(true);
      const response = await getLeaveBalances(new Date().getFullYear());
      
      // Find balance for current user
      const userBalance = response.data.find(b => b.user.email === user.email);
      setBalance(userBalance);
    } catch (error) {
      console.error("Error loading balance:", error);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      personal: "P",
      sick: "S",
      bereavement: "B",
      maternity: "M",
      paternity: "F"
    };
    return icons[category] || "L";
  };

  const getCategoryColor = (category) => {
    const colors = {
      personal: "#8d6e63",
      sick: "#d32f2f",
      bereavement: "#6f5a53",
      maternity: "#ad1457",
      paternity: "#5c4033"
    };
    return colors[category] || "#6f5a53";
  };

  const getUtilizationPercentage = (used, allocated) => {
    if (allocated === 0) return 0;
    return ((used / allocated) * 100).toFixed(1);
  };

  // Early return if user is not available
  if (!user || !user.email) {
    return (
      <div className="leave-balance">
        <div className="section-header">
          <h2>My Leave Balance</h2>
          <p>User information not available</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="leave-balance">
        <div className="section-header">
          <h2>My Leave Balance</h2>
          <p>Track your remaining leave days by category</p>
        </div>
        <div className="loading">Loading your leave balance...</div>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className="leave-balance">
        <div className="section-header">
          <h2>My Leave Balance</h2>
          <p>Track your remaining leave days by category</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">L</div>
          <h3>No Leave Balance Found</h3>
          <p>Your leave balance hasn't been initialized yet. Please contact HR.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leave-balance">
      <div className="section-header">
        <h2>My Leave Balance</h2>
        <p>Track your remaining leave days by category for {new Date().getFullYear()}</p>
      </div>

      <div className="balance-overview">
        <div className="total-stats">
          <div className="total-card">
            <h3>Total Allocated</h3>
            <p>{Object.values(balance.balances).reduce((sum, cat) => sum + cat.allocated, 0)} days</p>
          </div>
          <div className="total-card">
            <h3>Total Used</h3>
            <p>{Object.values(balance.balances).reduce((sum, cat) => sum + cat.used, 0)} days</p>
          </div>
          <div className="total-card">
            <h3>Total Remaining</h3>
            <p>{Object.values(balance.balances).reduce((sum, cat) => sum + cat.remaining, 0)} days</p>
          </div>
        </div>
      </div>

      <div className="category-balances">
        <h3>Leave Categories</h3>
        <div className="balance-cards">
          {Object.entries(balance.balances).map(([category, data]) => (
            <div key={category} className="balance-card">
              <div className="card-header">
                <div className="category-info">
                  <span className="category-icon">{getCategoryIcon(category)}</span>
                  <div className="category-details">
                    <h4>{category?.charAt(0)?.toUpperCase() + category?.slice(1) || category || 'Unknown'}</h4>
                    <p>Leave Category</p>
                  </div>
                </div>
                <div className="utilization-badge">
                  {getUtilizationPercentage(data.used, data.allocated)}% used
                </div>
              </div>

              <div className="balance-stats">
                <div className="stat-row">
                  <span className="stat-label">Allocated:</span>
                  <span className="stat-value">{data.allocated} days</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Used:</span>
                  <span className="stat-value">{data.used} days</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Remaining:</span>
                  <span className="stat-value remaining">{data.remaining} days</span>
                </div>
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{
                    width: `${getUtilizationPercentage(data.used, data.allocated)}%`,
                    backgroundColor: getCategoryColor(category)
                  }}
                ></div>
              </div>

              {data.remaining === 0 && (
                <div className="exhausted-notice">
                  <span>No {category} leaves remaining this year</span>
                </div>
              )}
              
              {data.remaining <= 2 && data.remaining > 0 && (
                <div className="low-balance-notice">
                  <span>Only {data.remaining} {category} leave(s) left</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="balance-insights">
        <h3>Quick Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <span className="insight-icon">U</span>
            <div className="insight-text">
              <h4>Utilization Rate</h4>
              <p>
                {((Object.values(balance.balances).reduce((sum, cat) => sum + cat.used, 0) / 
                  Object.values(balance.balances).reduce((sum, cat) => sum + cat.allocated, 0)) * 100).toFixed(1)}% 
                of your leaves used
              </p>
            </div>
          </div>
          
          <div className="insight-card">
            <span className="insight-icon">A</span>
            <div className="insight-text">
              <h4>Most Available</h4>
              <p>
                {Object.entries(balance.balances)
                  .sort(([,a], [,b]) => b.remaining - a.remaining)[0]
                  ?.[0]?.charAt(0)?.toUpperCase() + 
                  Object.entries(balance.balances)
                    .sort(([,a], [,b]) => b.remaining - a.remaining)[0]
                    ?.[0]?.slice(1) || 'N/A'} leaves
              </p>
            </div>
          </div>

          <div className="insight-card">
            <span className="insight-icon">Y</span>
            <div className="insight-text">
              <h4>Year Progress</h4>
              <p>
                {Math.round((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 
                  (new Date(new Date().getFullYear() + 1, 0, 1) - new Date(new Date().getFullYear(), 0, 1)) * 100)}% 
                through the year
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalance;
