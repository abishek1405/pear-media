// src/App.js
import { useState } from "react";
import WorkflowText  from "./components/WorkflowText";
import WorkflowImage from "./components/WorkflowImage";
import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  const [tab, setTab] = useState("text");

  return (
    <div className="app">
      <Navbar/>
      <div className="tab-bar">
        <button
          className={`tab-btn ${tab === "text" ? "active" : ""}`}
          onClick={() => setTab("text")}
        >
          ✦ Creative Studio
        </button>
        <button
          className={`tab-btn ${tab === "image" ? "active" : ""}`}
          onClick={() => setTab("image")}
        >
          ◈ Style Lab
        </button>
      </div>

      <header className="page-header">
        {tab === "text" ? (
          <>
            <h1>Creative Studio</h1>
            <p>Type a simple idea → AI enhances it → approve → generate.</p>
          </>
        ) : (
          <>
            <h1>Style Lab</h1>
            <p>Upload an image → AI analyses its style → generate a stylistic variation.</p>
          </>
        )}
      </header>

      <main className="main">
        {tab === "text" ? <WorkflowText /> : <WorkflowImage />}
      </main>

      <footer className="footer">Pear Media AI Prototype — built with React + OpenAI</footer>
    </div>
  );
}

export default App;