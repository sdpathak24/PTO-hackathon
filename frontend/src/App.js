import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import EmployeeDashboard from "./components/EmployeeDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import HRDashboard from "./components/HRDashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, role) => {
    setLoading(true);
    try {
      // Simulate login - in real app, you'd validate credentials
      const userData = { email, role, name: email.split('@')[0] };
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const renderDashboard = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'employee':
        return <EmployeeDashboard user={user} onLogout={handleLogout} />;
      case 'manager':
        return <ManagerDashboard user={user} onLogout={handleLogout} />;
      case 'hr':
        return <HRDashboard user={user} onLogout={handleLogout} />;
      default:
        return <EmployeeDashboard user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">PTOPilot</h1>
          <p className="app-subtitle">Leave management and coverage insights for modern teams</p>
        </div>
      </header>

      <main className="app-main">
        <div className="main-content">
          {!user ? (
            <LoginPage onLogin={handleLogin} loading={loading} />
          ) : (
            renderDashboard()
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by Athena AI • Built for the Girls Hack PTO Challenge</p>
      </footer>
    </div>
  );
}

export default App;

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
