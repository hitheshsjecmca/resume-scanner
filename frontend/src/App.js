import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/upload-resume", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResult(data.extracted_text);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Resume Scanner 🚀</h1>

      <input type="file" onChange={handleFileChange} />
      <br /><br />

      <button onClick={handleUpload}>Upload Resume</button>

      <h3>Extracted Text:</h3>
      <p>{result}</p>
    </div>
  );
}

export default App;