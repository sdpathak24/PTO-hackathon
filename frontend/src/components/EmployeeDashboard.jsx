import React, { useState } from "react";
import PTOForm from "./PTOForm";
import Calendar from "./Calendar";
import AIChatbot from "./AIChatbot";

const EmployeeDashboard = ({ user, onLogout }) => {
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <div className="user-avatar">
            <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
          <div className="user-details">
            <h3>Welcome back, {user?.name || 'User'}!</h3>
            <p>Employee Dashboard</p>
          </div>
        </div>
        <button onClick={onLogout} className="logout-button">Sign out</button>
      </div>

      <div className="dashboard-grid">
        <div className="pto-form-column">
          <PTOForm user={user} />
        </div>
        <div className="calendar-column">
          <Calendar user={user} />
        </div>
      </div>

      <div className="ai-assistant-bottom">
        <div className="compact-chat-container">
          <button 
            className="compact-chat-toggle"
            onClick={() => setShowAIChat(!showAIChat)}
          >
            <span className="chat-icon">A</span>
            <span className="chat-text">Ask Athena</span>
          </button>
          
          {showAIChat && (
            <div className="compact-chat-window">
              <div className="chat-header">
                <span>Athena AI</span>
                <button 
                  className="chat-close"
                  onClick={() => setShowAIChat(false)}
                >
                  ×
                </button>
              </div>
              <div className="chat-messages">
                <div className="message bot">
                  Hi! I can help with leave questions. What do you need?
                </div>
              </div>
              <div className="chat-input-area">
                <input 
                  type="text" 
                  placeholder="Ask about your leaves..."
                  className="chat-input"
                />
                <button className="chat-send">→</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
