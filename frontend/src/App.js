import React from "react";
import PTOForm from "./components/PTOForm";
import ManagerDashboard from "./components/ManagerDashboard";
import "./App.css";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>SmartPTO</h1>
      <PTOForm />
      <hr />
      <ManagerDashboard />
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
