import React from "react";

const Recommendation = ({ text }) => (
  <div
    style={{ marginTop: "20px", padding: "10px", border: "1px solid #333", borderRadius: "5px", background: "#f0f8ff" }}
  >
    <h3>Athena AI Recommendation:</h3>
    <p>{text}</p>
  </div>
);

export default Recommendation;
