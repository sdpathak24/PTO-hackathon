import React, { useState } from "react";
import { submitPTO, getAIRecommendation } from "../api/api";
import Recommendation from "./Recommendation";

const PTOForm = () => {
  const [form, setForm] = useState({ email: "", startDate: "", endDate: "", reason: "" });
  const [response, setResponse] = useState(null);
  const [aiText, setAiText] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submitPTO(form);
      setResponse(res.data);

      if (res.data.pto?._id) {
        const aiRes = await getAIRecommendation(res.data.pto._id);
        setAiText(aiRes.data.recommendation);
      }
    } catch (err) {
      console.error(err);
      setResponse({ error: "Something went wrong" });
    }
  };

  return (
    <div>
      <h2>Request PTO</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Your email" required onChange={handleChange} />
        <input type="date" name="startDate" required onChange={handleChange} />
        <input type="date" name="endDate" required onChange={handleChange} />
        <input type="text" name="reason" placeholder="Reason" required onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>

      {response && response.analysis && (
        <div style={{ marginTop: "20px" }}>
          <h3>Coverage Analysis:</h3>
          <pre>{JSON.stringify(response.analysis, null, 2)}</pre>
        </div>
      )}

      {aiText && <Recommendation text={aiText} />}
      {response?.error && <p style={{ color: "red" }}>{response.error}</p>}
    </div>
  );
};

export default PTOForm;
