import React, { useState, useEffect } from "react";
import { getChatbotResponse } from "../api/api";
import { createUser } from "../api/api";

const HRDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("policies");
  const [policies, setPolicies] = useState([]);
  const [users, setUsers] = useState([]);
  // analytics is now rendered with dummy data in the Analytics tab
  const [newPolicy, setNewPolicy] = useState({
    role: "intern",
    leaveCategories: {
      personal: 0,
      sick: 0,
      bereavement: 0,
      maternity: 0,
      paternity: 0
    }
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "intern",
    team: "Core",
    gender: "male",
    maritalStatus: "single",
    level: "intern"
  });

  // Leave Insights filters
  const [roleFilter, setRoleFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('ytd'); // last30, quarter, ytd

  useEffect(() => {
    loadPolicies();
    loadUsers();
  }, []);

  const loadPolicies = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/hr/leave-policies");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPolicies(data);
    } catch (error) {
      console.error("Error loading policies:", error);
      setPolicies([]); // Set empty array on error
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  // Removed remote analytics fetch; Analytics tab uses clear, dummy policy-focused data

  const handleCreatePolicy = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/hr/leave-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPolicy)
      });
      
      if (response.ok) {
        setNewPolicy({
          role: "intern",
          leaveCategories: {
            personal: 0,
            sick: 0,
            bereavement: 0,
            maternity: 0,
            paternity: 0
          }
        });
        loadPolicies();
      }
    } catch (error) {
      console.error("Error creating policy:", error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(newUser);
      if (response.data) {
        // Initialize leave balance for new user
        await fetch(`http://localhost:8080/api/hr/employee/${response.data._id}/initialize-balance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ year: new Date().getFullYear() })
        });
        
        setNewUser({
          name: "",
          email: "",
          role: "intern",
          team: "Core",
          gender: "male",
          maritalStatus: "single",
          level: "intern"
        });
        loadUsers();
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const tabs = [
    { id: "policies", label: "Leave Policies" },
    { id: "employees", label: "Employee Management" },
    { id: "insights", label: "Leave Insights" }
  ];

  const renderPolicies = () => (
    <div className="oracle-policies-section">
      <div className="sacred-form-container">
        <div className="form-header">
          <h3 className="oracle-section-title">Leave Policies</h3>
          <p className="oracle-section-subtitle">Define annual allocations for each role</p>
        </div>

        <form onSubmit={handleCreatePolicy} className="sacred-policy-form">
          <div className="form-field">
            <label className="oracle-label">Role</label>
            <select
              value={newPolicy.role}
              onChange={(e) => setNewPolicy({...newPolicy, role: e.target.value})}
              className="oracle-select"
            >
              <option value="intern">Intern</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
              <option value="manager">Manager</option>
              <option value="director">Director</option>
            </select>
          </div>

          <div className="sacred-leave-grid">
            <h5 className="leave-grid-title">Leave Entitlements</h5>
            <div className="leave-categories-grid">
              <div className="category-field">
                <label className="category-label">Personal</label>
                <input
                  type="number"
                  min="0"
                  value={newPolicy.leaveCategories.personal}
                  onChange={(e) => setNewPolicy({
                    ...newPolicy,
                    leaveCategories: {
                      ...newPolicy.leaveCategories,
                      personal: parseInt(e.target.value) || 0
                    }
                  })}
                  className="oracle-input"
                />
              </div>
              
              <div className="category-field">
                <label className="category-label">Sick</label>
                <input
                  type="number"
                  min="0"
                  value={newPolicy.leaveCategories.sick}
                  onChange={(e) => setNewPolicy({
                    ...newPolicy,
                    leaveCategories: {
                      ...newPolicy.leaveCategories,
                      sick: parseInt(e.target.value) || 0
                    }
                  })}
                  className="oracle-input"
                />
              </div>
              
              <div className="category-field">
                <label className="category-label">Bereavement</label>
                <input
                  type="number"
                  min="0"
                  value={newPolicy.leaveCategories.bereavement}
                  onChange={(e) => setNewPolicy({
                    ...newPolicy,
                    leaveCategories: {
                      ...newPolicy.leaveCategories,
                      bereavement: parseInt(e.target.value) || 0
                    }
                  })}
                  className="oracle-input"
                />
              </div>
              
              <div className="category-field">
                <label className="category-label">Maternal</label>
                <input
                  type="number"
                  min="0"
                  value={newPolicy.leaveCategories.maternity}
                  onChange={(e) => setNewPolicy({
                    ...newPolicy,
                    leaveCategories: {
                      ...newPolicy.leaveCategories,
                      maternity: parseInt(e.target.value) || 0
                    }
                  })}
                  className="oracle-input"
                />
              </div>
              
              <div className="category-field">
                <label className="category-label">Paternal</label>
                <input
                  type="number"
                  min="0"
                  value={newPolicy.leaveCategories.paternity}
                  onChange={(e) => setNewPolicy({
                    ...newPolicy,
                    leaveCategories: {
                      ...newPolicy.leaveCategories,
                      paternity: parseInt(e.target.value) || 0
                    }
                  })}
                  className="oracle-input"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="golden-save-button">
            Save Policy
          </button>
        </form>
      </div>

      <div className="sacred-table-container">
        <h4 className="table-title">Current Policies ({policies.length})</h4>
        <div className="sacred-policies-table">
          <div className="table-header">
            <div className="header-cell role-header">Role</div>
            <div className="header-cell year-header">Year</div>
            <div className="header-cell personal-header">Personal</div>
            <div className="header-cell sick-header">Sick</div>
            <div className="header-cell bereavement-header">Bereavement</div>
            <div className="header-cell maternal-header">Maternal</div>
            <div className="header-cell paternal-header">Paternal</div>
          </div>
          
          {policies.map(policy => (
            <div key={policy._id} className="table-row">
              <div className="table-cell role-cell">
                <span className="role-name">{policy.role?.charAt(0)?.toUpperCase() + policy.role?.slice(1) || policy.role || 'Unknown'}</span>
              </div>
              <div className="table-cell year-cell">
                <span className="year-badge">{policy.year}</span>
              </div>
              <div className="table-cell personal-cell">{policy.leaveCategories.personal}</div>
              <div className="table-cell sick-cell">{policy.leaveCategories.sick}</div>
              <div className="table-cell bereavement-cell">{policy.leaveCategories.bereavement}</div>
              <div className="table-cell maternal-cell">{policy.leaveCategories.maternity}</div>
              <div className="table-cell paternal-cell">{policy.leaveCategories.paternity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="employees-section">
      <div className="section-header">
        <h3>👥 Employee Management</h3>
        <p>Add new employees and manage their leave allocations</p>
      </div>

      <div className="employees-grid">
        <div className="add-employee-section">
          <h4>➕ Add New Employee</h4>
          <form onSubmit={handleCreateUser} className="employee-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value, level: e.target.value})}
                >
                  <option value="intern">Intern</option>
                  <option value="junior">Junior</option>
                  <option value="senior">Senior</option>
                  <option value="manager">Manager</option>
                  <option value="director">Director</option>
                </select>
              </div>
              <div className="form-group">
                <label>Team</label>
                <input
                  type="text"
                  placeholder="Team name"
                  value={newUser.team}
                  onChange={(e) => setNewUser({...newUser, team: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={newUser.gender}
                  onChange={(e) => setNewUser({...newUser, gender: e.target.value})}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Marital Status</label>
                <select
                  value={newUser.maritalStatus}
                  onChange={(e) => setNewUser({...newUser, maritalStatus: e.target.value})}
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
            </div>

            <button type="submit" className="submit-button">
              👤 Add Employee
            </button>
          </form>
        </div>

        <div className="employees-list">
          <h4>👥 Current Employees ({users.length})</h4>
          <div className="employees-cards">
            {users.map(user => (
              <div key={user._id} className="employee-card">
                <div className="employee-avatar">
                  <span>{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
                <div className="employee-info">
                  <h5>{user.name}</h5>
                  <p className="employee-email">{user.email}</p>
                  <div className="employee-meta">
                    <span className="role-badge">{user.role}</span>
                    <span className="team-badge">{user.team}</span>
                  </div>
                  <div className="employee-details">
                    <span>{user.gender} • {user.maritalStatus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsights = () => {

    // Dummy structured data (replace with backend later)
    const months = ['2025-01','2025-02','2025-03','2025-04','2025-05','2025-06','2025-07','2025-08','2025-09'];
    const categories = ['personal','sick','bereavement','maternity','paternity'];
    const rolesForData = ['engineer','manager','intern'];
    const seeded = (seed) => {
      let x = seed; return () => (x = (x*9301+49297)%233280) / 233280;
    };
    const rand = seeded(42);
    const dummyData = rolesForData.reduce((acc, r) => {
      acc[r] = months.reduce((macc, m) => {
        macc[m] = categories.reduce((cacc, c) => {
          // generate small realistic numbers
          const base = { personal: 6, sick: 4, bereavement: 1, maternity: 0.5, paternity: 0.8 }[c] || 2;
          cacc[c] = Math.max(0, Math.round(base + (rand()-0.5)*base));
          return cacc;
        }, {});
        return macc;
      }, {});
      return acc;
    }, {});

    // Time window filter
    const getMonthsWindow = () => {
      if (periodFilter === 'last30') return months.slice(-1);
      if (periodFilter === 'quarter') return months.slice(-3);
      return months; // ytd/all
    };
    const activeMonths = getMonthsWindow();
    const activeRoles = roleFilter === 'all' ? rolesForData : [roleFilter];

    // Aggregate helpers
    const sumByCategory = categories.reduce((obj, c) => ({...obj, [c]:0}), {});
    const aggregated = activeRoles.reduce((acc, r) => {
      activeMonths.forEach(m => {
        categories.forEach(c => { acc[c] += dummyData[r][m][c]; });
      });
      return acc;
    }, {...sumByCategory});

    const totalUsed = Object.values(aggregated).reduce((a,b)=>a+b,0);
    const mostUsedEntry = Object.entries(aggregated).sort((a,b)=>b[1]-a[1])[0] || ['personal',0];
    const employeesNearLimit = Math.max(0, Math.round((aggregated.personal + aggregated.sick)/10));

    // Monthly totals for line chart
    const monthlyTotals = activeMonths.map(m => {
      return activeRoles.reduce((sum, r) => sum + categories.reduce((s,c)=>s+dummyData[r][m][c],0), 0);
    });
    const last = monthlyTotals[monthlyTotals.length-1] || 0;
    const prev = monthlyTotals[monthlyTotals.length-2] || 0;
    const monthChangePct = prev ? Math.round(((last - prev) / prev) * 100) : 0;

    // Dynamic insights from data
    const insights = [];
    const sickShare = totalUsed ? Math.round((aggregated.sick/totalUsed)*100) : 0;
    if (sickShare >= 50) insights.push('⚠️ Sick leave is trending higher than usual.');
    else if (sickShare >= 35) insights.push('Sick leave share is elevated; monitor approvals.');
    insights.push(`${employeesNearLimit} employees are within 2 days of their annual quota.`);
    if (monthChangePct >= 15) insights.push(`Leave requests up ${monthChangePct}% vs previous month.`);
    else insights.push('Team coverage appears stable this month.');

    const usageSnapshot = {
      totalLeaves: totalUsed,
      mostUsedCategory: mostUsedEntry[0]?.charAt(0)?.toUpperCase() + mostUsedEntry[0]?.slice(1) || mostUsedEntry[0] || 'Unknown',
      employeesNearLimit,
      avgPerEmployee: Math.round(totalUsed / 12)
    };

    // Chart helpers
    const pieColors = ['#fbbf24','#f59e0b','#eab308','#d97706','#fde68a'];
    const getPieColor = (i) => pieColors[i % pieColors.length];

    return (
      <div className="oracle-analytics-section">
        <div className="analytics-header">
          <h3 className="oracle-section-title">Leave Insights</h3>
          <p className="oracle-section-subtitle">Policy-focused snapshot and AI guidance</p>
        </div>

        <div className="analytics-grid">
          {/* Filters */}
          <div className="insight-filters">
            <div className="filter-group">
              <label>Role</label>
              <select value={roleFilter} onChange={(e)=>setRoleFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="engineer">Engineer</option>
                <option value="manager">Manager</option>
                <option value="intern">Intern</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Period</label>
              <select value={periodFilter} onChange={(e)=>setPeriodFilter(e.target.value)}>
                <option value="last30">Last 30 days</option>
                <option value="quarter">Last Quarter</option>
                <option value="ytd">YTD</option>
              </select>
            </div>
          </div>
          {/* Usage Snapshot */}
          <div className="usage-snapshot-container">
            <div className="section-header">
              <h4 className="section-title">Usage Snapshot</h4>
            </div>
            <div className="snapshot-cards">
              <div className="snapshot-card">
                <div className="snapshot-content">
                  <h5>Total Leaves Taken</h5>
                  <p className="snapshot-number">{usageSnapshot.totalLeaves}</p>
                  <p className="snapshot-label">This Year</p>
                </div>
              </div>
              <div className="snapshot-card">
                <div className="snapshot-content">
                  <h5>Most Frequently Used Type</h5>
                  <p className="snapshot-number">{usageSnapshot.mostUsedCategory}</p>
                  <p className="snapshot-label">Across all employees</p>
                </div>
              </div>
              <div className="snapshot-card">
                <div className="snapshot-content">
                  <h5>Avg Days Per Employee</h5>
                  <p className="snapshot-number">{Math.round(usageSnapshot.totalLeaves / 12)}</p>
                  <p className="snapshot-label">Approximate</p>
                </div>
              </div>
              <div className="snapshot-card">
                <div className="snapshot-content">
                  <h5>Employees Near Limit</h5>
                  <p className="snapshot-number">{usageSnapshot.employeesNearLimit}</p>
                  <p className="snapshot-label">Within 2 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-card">
              <h5 className="chart-title">Leaves Taken per Type</h5>
              <div className="chart bar-chart">
                {categories.map((c) => {
                  const val = aggregated[c];
                  const max = Math.max(...Object.values(aggregated), 1);
                  const height = Math.round((val / max) * 100);
                  return (
                    <div key={c} className="bar-item">
                      <div className="bar" style={{ height: `${height}%` }} />
                      <span className="bar-label">{c?.charAt(0)?.toUpperCase()+c?.slice(1) || c || 'Unknown'}</span>
                      <span className="bar-value">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="chart-card">
              <h5 className="chart-title">Usage Distribution</h5>
              <div className="chart pie-chart">
                {(() => {
                  const total = totalUsed || 1;
                  let acc = 0;
                  const segments = categories.map((c, i) => {
                    const start = (acc / total) * 360; acc += aggregated[c];
                    const end = (acc / total) * 360;
                    return `${getPieColor(i)} ${start}deg ${end}deg`;
                  }).join(', ');
                  return (
                    <div className="pie" style={{ background: `conic-gradient(${segments})` }} />
                  );
                })()}
                <div className="legend">
                  {categories.map((c, i) => (
                    <div key={c} className="legend-item">
                      <span className="legend-swatch" style={{ background: getPieColor(i) }} />
                      <span className="legend-label">{c?.charAt(0)?.toUpperCase()+c?.slice(1) || c || 'Unknown'} ({aggregated[c]})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h5 className="chart-title">Monthly Trend</h5>
              <div className="chart line-chart">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                  {(() => {
                    const max = Math.max(...monthlyTotals, 1);
                    const pts = monthlyTotals.map((v, idx) => {
                      const x = (idx/(monthlyTotals.length-1||1))*100;
                      const y = 40 - (v/max)*35 - 2;
                      return `${x},${y}`;
                    }).join(' ');
                    return <polyline fill="none" stroke="#8d6e63" strokeWidth="2" points={pts} />;
                  })()}
                </svg>
                <div className="line-legend">
                  {activeMonths.map((m,i)=> (<span key={m}>{m.slice(5)}</span>))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="athena-insights-container">
            <div className="section-header">
              <h4 className="section-title">Insights</h4>
            </div>
            <div className="insights-card">
              <div className="insights-list">
                {insights.slice(0,3).map((insight, index) => (
                  <div key={index} className="insight-item">
                    <p className="insight-text">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'policies': return renderPolicies();
      case 'employees': return renderEmployees();
      case 'insights': return renderInsights();
      default: return renderPolicies();
    }
  };

  // Inline Athena chat dock (minimal, bottom-right)
  const AthenaChatDock = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
      { role: 'system', text: 'Ask Athena about leave policies or coverage.' }
    ]);
    const [input, setInput] = useState('');

    const send = async () => {
      if (!input.trim()) return;
      const userMsg = { role: 'user', text: input.trim() };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      try {
        const res = await getChatbotResponse('hr@example.com', userMsg.text);
        const text = res.data?.response || res.data?.suggestion?.response || 'Athena is thinking...';
        setMessages(prev => [...prev, { role: 'assistant', text }]);
      } catch (e) {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Unable to reach Athena right now.' }]);
      }
    };

    return (
      <div className={`athena-dock ${open ? 'open' : ''}`}>
        {!open && (
          <button className="athena-fab" onClick={()=>setOpen(true)}>💬</button>
        )}
        {open && (
          <div className="athena-panel">
            <div className="athena-header-row">
              <span className="athena-title-mini">Athena Chat</span>
              <button className="athena-close" onClick={()=>setOpen(false)}>✕</button>
            </div>
            <div className="athena-messages">
              {messages.map((m,i)=> (
                <div key={i} className={`msg ${m.role}`}>{m.text}</div>
              ))}
            </div>
            <div className="athena-input-row">
              <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about policies, coverage..." />
              <button onClick={send}>Send</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="hr-oracle-dashboard">
      {/* Celestial Background Elements */}
      <div className="celestial-bg">
        <div className="stars"></div>
        <div className="moon"></div>
      </div>

      <div className="oracle-header">
        <div className="oracle-title">
          <h1 className="oracle-main-title">HR Dashboard – PTOPilot</h1>
          <p className="oracle-subtitle">Manage policies, employees, and insights.</p>
          <div className="laurel-decoration"></div>
        </div>
        <button onClick={onLogout} className="oracle-logout">
          Sign out
        </button>
      </div>

      <nav className="oracle-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`oracle-nav-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="oracle-content">
        {renderActiveTab()}
        {activeTab === 'insights' && (
          <div className="athena-chat-dock">
            <AthenaChatDock />
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
