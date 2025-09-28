import React, { useState } from "react";

const LoginPage = ({ onLogin, loading }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && role) {
      onLogin(email, role);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome to PTOPilot</h2>
          <p>Sign in to access your personalized dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="employee">Employee - Submit PTO Requests</option>
              <option value="manager">Manager - Approve & Monitor Coverage</option>
              <option value="hr">HR - Manage Policies & Analytics</option>
            </select>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="demo-credentials">
          <h4>Demo Credentials</h4>
          <div className="credential-cards">
            <div className="credential-card">
              <h5>Employee Access</h5>
              <p><strong>Email:</strong> khushi@example.com</p>
              <p><strong>Role:</strong> Employee</p>
              <button 
                onClick={() => {
                  setEmail("khushi@example.com");
                  setRole("employee");
                }}
                className="demo-button"
              >
                Use Demo
              </button>
            </div>
            <div className="credential-card">
              <h5>Manager Access</h5>
              <p><strong>Email:</strong> manager@example.com</p>
              <p><strong>Role:</strong> Manager</p>
              <button 
                onClick={() => {
                  setEmail("manager@example.com");
                  setRole("manager");
                }}
                className="demo-button"
              >
                Use Demo
              </button>
            </div>
            <div className="credential-card">
              <h5>HR Access</h5>
              <p><strong>Email:</strong> hr@example.com</p>
              <p><strong>Role:</strong> HR</p>
              <button 
                onClick={() => {
                  setEmail("hr@example.com");
                  setRole("hr");
                }}
                className="demo-button"
              >
                Use Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
