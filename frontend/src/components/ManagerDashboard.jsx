import React, { useState } from "react";
import { getCoverage } from "../api/api";

const ManagerDashboard = () => {
  const [team, setTeam] = useState("Core");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [coverage, setCoverage] = useState(null);

  const handleFetch = async () => {
    try {
      const res = await getCoverage(team, from, to);
      setCoverage(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Manager Dashboard</h2>
      <input type="text" value={team} placeholder="Team" onChange={(e) => setTeam(e.target.value)} />
      <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
      <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      <button onClick={handleFetch}>Get Coverage</button>

      {coverage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Coverage Details:</h3>
          {Object.entries(coverage.details).map(([role, detail]) => (
            <div key={role} style={{ marginBottom: "10px" }}>
              <h4>{role}</h4>
              <p>Team Count: {detail.teamCount}</p>
              <p>Min On Duty: {detail.minOnDuty}</p>
              <p>Off: {detail.off}</p>
              <p>Max Allowed Off: {detail.maxAllowedOff}</p>
              <p>Risk: {detail.risk ? "⚠️ Risk" : "✅ Safe"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
