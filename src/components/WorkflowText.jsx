import { useState } from "react";
import { getEnhancedPrompt, generateImage } from "../utils/apiHelpers";

export default function WorkflowText() {
  const [userPrompt, setUserPrompt]   = useState("");
  const [enhanced, setEnhanced]       = useState("");
  const [image, setImage]             = useState("");
  const [status, setStatus]           = useState("");   
  const [isLoading, setIsLoading]     = useState(false);
  const [step, setStep]               = useState(1);    

  const handleEnhance = async () => {
    if (!userPrompt.trim()) {
      setStatus("Please enter a prompt first.");
      return;
    }
    setIsLoading(true);
    setStatus("Enhancing your prompt with AI…");
    setEnhanced("");
    setImage("");

    const { result, error } = await getEnhancedPrompt(userPrompt);

    setIsLoading(false);
    if (error) {
      setStatus(`Enhancement failed: ${error}`);
    } else {
      setEnhanced(result);
      setStep(2);
      setStatus("✓ Prompt enhanced! Edit it below, then generate your image.");
    }
  };

  const handleGenerate = async () => {
    if (!enhanced.trim()) {
      setStatus("The enhanced prompt is empty.");
      return;
    }
    setIsLoading(true);
    setStatus("Generating your image… this may take 10–20 seconds.");
    setImage("");

    const { result, error } = await generateImage(enhanced);

    setIsLoading(false);
    if (error) {
      setStatus(`Image generation failed: ${error}`);
    } else {
      setImage(result);
      setStep(3);
      setStatus("✓ Image generated!");
    }
  };

  const handleReset = () => {
    setUserPrompt("");
    setEnhanced("");
    setImage("");
    setStatus("");
    setStep(1);
  };

  return (
    <div className="workflow-container">
      <div className="steps-indicator">
        {["Enter Idea", "Review & Edit", "Generated Image"].map((label, i) => (
          <div key={i} className={`step-dot ${step > i ? "done" : step === i + 1 ? "active" : ""}`}>
            <span className="dot-num">{i + 1}</span>
            <span className="dot-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <label className="field-label">Your idea</label>
        <textarea
          className="field-textarea"
          rows={3}
          placeholder="e.g. a cat in a spacesuit on the moon"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="btn-primary"
          onClick={handleEnhance}
          disabled={isLoading || !userPrompt.trim()}
        >
          {isLoading && step === 1 ? "Enhancing…" : "✦ Enhance Prompt"}
        </button>
      </div>

      {enhanced && (
        <div className="card">
          <label className="field-label">Enhanced prompt — edit freely</label>
          <textarea
            className="field-textarea"
            rows={5}
            value={enhanced}
            onChange={(e) => setEnhanced(e.target.value)}
            disabled={isLoading}
          />
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={isLoading || !enhanced.trim()}
          >
            {isLoading && step === 2 ? "Generating…" : "🎨 Generate Image"}
          </button>
        </div>
      )}

      {image && (
        <div className="card result-card">
          <label className="field-label">Generated image</label>
          <img src={image} alt="AI generated" className="result-img" />
          <div className="result-actions">
            <a href={image} target="_blank" rel="noreferrer" className="btn-secondary">
              Open full size ↗
            </a>
            <button className="btn-secondary" onClick={handleReset}>
              Start over
            </button>
          </div>
        </div>
      )}

      {isLoading && <div className="progress-bar"><div className="progress-fill" /></div>}

      {status && (
        <p className={`status-msg ${status.startsWith("✓") ? "success" : status.toLowerCase().includes("failed") ? "error" : ""}`}>
          {status}
        </p>
      )}
    </div>
  );
}