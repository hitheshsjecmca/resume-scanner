import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [analysis, setAnalysis] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
  if (!file || !jobDesc) {
    alert("Upload resume and enter job description");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_desc", jobDesc);

  const response = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  setAnalysis(data.analysis);
};

  return (
  <div className="container">
    <h1 className="title">Resume  Scanner 🚀</h1>

    <div className="card">
      <input type="file" onChange={handleFileChange} />

      <textarea
        placeholder="Paste Job Description"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <button onClick={handleUpload}>Analyze Resume</button>
    </div>

    {analysis && (
      <div className="result-card">
        <h2>Match Score</h2>
        <p className="score">{analysis.match_score}%</p>

        <h3>Matched Skills</h3>
        <ul>
          {analysis.matched_skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>

        <h3>Missing Skills</h3>
        <ul>
          {analysis.missing_skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>

        <h3>Suggestions</h3>
        <ul>
          {analysis.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
}

export default App;