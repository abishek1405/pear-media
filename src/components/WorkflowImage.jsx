
import { useState } from "react";
import { analyzeImage, generateVariation } from "./apiHelpers";

export default function WorkflowImage() {
  const [preview, setPreview]         = useState("");   
  const [base64, setBase64]           = useState("");   
  const [analysis, setAnalysis]       = useState(null); 
  const [generated, setGenerated]     = useState("");   
  const [status, setStatus]           = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [step, setStep]               = useState(1);

  
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    
    if (!file.type.startsWith("image/")) {
      setStatus("Please upload an image file (JPEG, PNG, WebP, etc.).");
      return;
    }
    
    if (file.size > 20 * 1024 * 1024) {
      setStatus("Image too large. Please upload a file under 20 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setBase64(reader.result);  
      setAnalysis(null);
      setGenerated("");
      setStep(1);
      setStatus("Image loaded. Click Analyse to continue.");
    };
    reader.onerror = () => setStatus("Failed to read file.");
    reader.readAsDataURL(file);
  };

  
  const handleAnalyze = async () => {
    if (!base64) {
      setStatus("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    setStatus("Analysing image with AI vision…");
    setAnalysis(null);
    setGenerated("");

    const { result, error } = await analyzeImage(base64);

    setIsLoading(false);
    if (error) {
      setStatus(`Analysis failed: ${error}`);
    } else {
      setAnalysis(result);
      setStep(2);
      setStatus("✓ Analysis complete! Review the details below.");
    }
  };

  
  const handleGenerate = async () => {
    if (!analysis) return;
    setIsLoading(true);
    setStatus("Generating stylistic variation… this may take 10–20 seconds.");
    setGenerated("");

    const { result, error } = await generateVariation(analysis);

    setIsLoading(false);
    if (error) {
      setStatus(`Variation generation failed: ${error}`);
    } else {
      setGenerated(result);
      setStep(3);
      setStatus("✓ Variation generated!");
    }
  };

  const handleReset = () => {
    setPreview("");
    setBase64("");
    setAnalysis(null);
    setGenerated("");
    setStatus("");
    setStep(1);
  };

  return (
    <div className="workflow-container">
      <div className="steps-indicator">
        {["Upload Image", "Review Analysis", "Variation"].map((label, i) => (
          <div key={i} className={`step-dot ${step > i ? "done" : step === i + 1 ? "active" : ""}`}>
            <span className="dot-num">{i + 1}</span>
            <span className="dot-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="card upload-card">
        <label className="field-label">Upload an image</label>
        <label className="upload-zone">
          {preview
            ? <img src={preview} alt="preview" className="upload-preview" />
            : <span className="upload-placeholder">Click or drag an image here</span>
          }
          <input
            type="file"
            accept="image"
            onChange={handleUpload}
            style={{ display: "none" }}
            disabled={isLoading}
          />
        </label>
        {preview && (
          <button
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={isLoading}
          >
            {isLoading && step === 1 ? "Analysing…" : "🔍 Analyse Image"}
          </button>
        )}
      </div>

      {analysis && (
        <div className="card">
          <label className="field-label">AI Vision Analysis</label>
          <div className="analysis-grid">
            <AnalysisRow label="Main Subject"   value={analysis.mainSubject} />
            <AnalysisRow label="Artistic Style" value={analysis.artisticStyle} />
            <AnalysisRow label="Lighting"       value={analysis.lighting} />
            <AnalysisRow label="Mood"           value={analysis.mood} />
            <div className="analysis-row">
              <span className="analysis-label">Color Palette</span>
              <div className="color-swatches">
                {(analysis.colorPalette || []).map((c, i) => (
                  <span key={i} className="color-chip">{c}</span>
                ))}
              </div>
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading && step === 2 ? "Generating…" : "🎨 Generate Variation"}
          </button>
        </div>
      )}

      {generated && (
        <div className="card result-card">
          <label className="field-label">Stylistic variation</label>
          <img src={generated} alt="Generated variation" className="result-img" />
          <div className="result-actions">
            <a href={generated} target="_blank" rel="noreferrer" className="btn-secondary">
              Open full size ↗
            </a>
            <button className="btn-secondary" onClick={handleReset}>
              Try another image
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


function AnalysisRow({ label, value }) {
  return (
    <div className="analysis-row">
      <span className="analysis-label">{label}</span>
      <span className="analysis-value">{value}</span>
    </div>
  );
}