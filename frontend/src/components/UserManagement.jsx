import React, { useState, useEffect } from "react";
import { getAllUsers, createUser } from "../api/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "engineer",
    team: "Core"
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createUser(newUser);
      setNewUser({ name: "", email: "", role: "engineer", team: "Core" });
      await loadUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const getRoleColor = (role) => {
    const colors = {
      engineer: "#3b82f6",
      designer: "#8b5cf6",
      manager: "#10b981",
      qa: "#f59e0b",
      support: "#ef4444"
    };
    return colors[role] || "#6b7280";
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>👥 Team Management</h2>
        <p>Manage your team members and their roles</p>
      </div>

      <div className="management-grid">
        <div className="add-user-section">
          <h3>➕ Add New Team Member</h3>
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={newUser.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleChange}
                >
                  <option value="engineer">👨‍💻 Engineer</option>
                  <option value="designer">🎨 Designer</option>
                  <option value="manager">👩‍💼 Manager</option>
                  <option value="qa">🔍 QA</option>
                  <option value="support">🎧 Support</option>
                </select>
              </div>

              <div className="form-group">
                <label>Team</label>
                <input
                  type="text"
                  name="team"
                  placeholder="Team name"
                  value={newUser.team}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Adding..." : "Add Team Member"}
            </button>
          </form>
        </div>

        <div className="users-list-section">
          <h3>👥 Current Team Members ({users.length})</h3>
          
          {loading && users.length === 0 ? (
            <div className="loading">Loading team members...</div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <p>No team members yet. Add some to get started!</p>
            </div>
          ) : (
            <div className="users-grid">
              {users.map(user => (
                <div key={user._id} className="user-card">
                  <div className="user-avatar">
                    <span style={{ backgroundColor: getRoleColor(user.role) }}>
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="user-info">
                    <h4>{user.name}</h4>
                    <p className="user-email">{user.email}</p>
                    <div className="user-meta">
                      <span 
                        className="role-badge" 
                        style={{ backgroundColor: getRoleColor(user.role) }}
                      >
                        {user.role}
                      </span>
                      <span className="team-badge">{user.team}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
