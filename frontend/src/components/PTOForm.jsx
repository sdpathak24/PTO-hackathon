import React, { useState } from "react";
import { submitPTO } from "../api/api";

const PTOForm = ({ user }) => {
  const [form, setForm] = useState({ email: user?.email || "", startDate: "", endDate: "", leaveType: "" });
  const [response, setResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startDate') {
      // If start date changes, reset end date if it's before the new start date
      setForm(prev => ({
        ...prev,
        startDate: value,
        endDate: prev.endDate && value > prev.endDate ? "" : prev.endDate
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const startDate = new Date(form.startDate);
      const endDate = new Date(form.endDate);
      const daysRequested = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      const ptoData = {
        email: form.email,
        startDate: form.startDate,
        endDate: form.endDate,
        leaveType: form.leaveType,
        daysRequested: daysRequested
      };

      const res = await submitPTO(ptoData);
      setResponse(res.data);
      
      // Clear form after successful submission
      setForm({ email: user?.email || "", startDate: "", endDate: "", leaveType: "" });
      
      // Hide success message after 5 seconds
      setTimeout(() => setResponse(null), 5000);
    } catch (err) {
      console.error(err);
      setResponse({ error: err.response?.data?.error || err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pto-form-section">
      <div className="section-header">
        <h2>Request Paid Time Off</h2>
        <p>Submit your PTO request and receive instant coverage analysis</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="pto-form">
          <div className="form-group">
            <label>Your Email</label>
            <input 
              type="email" 
              name="email" 
              value={form.email}
              placeholder="Enter your email address" 
              required 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Leave Type</label>
            <select 
              name="leaveType" 
              value={form.leaveType}
              required 
              onChange={handleChange}
            >
              <option value="">Select leave type</option>
              <option value="personal">Personal</option>
              <option value="sick">Sick</option>
              <option value="maternal">Maternal</option>
              <option value="paternal">Paternal</option>
              <option value="bereavement">Bereavement</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                name="startDate" 
                value={form.startDate}
                required 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input 
                type="date" 
                name="endDate" 
                value={form.endDate}
                min={form.startDate || new Date().toISOString().split('T')[0]}
                required 
                onChange={handleChange} 
              />
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit PTO Request"}
          </button>
        </form>
      </div>

      {response && (
        <div className="response-section">
          {response.error ? (
            <div className="error-message">
              <div className="error-header">Unable to Submit Request</div>
              <div className="error-details">{response.error}</div>
            </div>
          ) : (
            <div className="success-message">
              <div className="success-header">Request Submitted Successfully!</div>
              <div className="form-cleared-notice">Form has been cleared for your next request.</div>
            </div>
          )}
        </div>
      )}

      {response && response.analysis && (
        <div className="analysis-section">
          <h3>Coverage Analysis</h3>
          <div className="analysis-grid">
            <div className={`analysis-card ${response.analysis.risk ? 'risk' : 'safe'}`}>
              <div className="card-header">
                <span className="risk-text">
                  {response.analysis.risk ? "HIGH RISK" : "SAFE TO APPROVE"}
                </span>
              </div>
              <p className="suggestion">{response.analysis.suggestion}</p>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Team Size</span>
                <span className="stat-value">{response.analysis.teamCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Min Required</span>
                <span className="stat-value">{response.analysis.minOnDuty}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Currently Off</span>
                <span className="stat-value">{response.analysis.overlapping}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PTOForm;

