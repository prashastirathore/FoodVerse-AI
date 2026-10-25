import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, X, CheckCircle2, AlertCircle } from 'lucide-react';

const ImageUploader = ({
  onAnalyze,
  samples = [],
  title = "Upload Food Image",
  subtitle = "Drag & drop your food photo or click to browse (JPG, PNG, WEBP)",
  hintPlaceholder = "Optional hint (e.g. 'Homemade sourdough bread' or 'Prep station #1')",
  buttonText = "Analyze with AI",
  loading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [promptHint, setPromptHint] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedSample(null);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedSample(null);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const selectSampleItem = (sample) => {
    setSelectedFile(null);
    setSelectedSample(sample);
    setPreviewUrl(sample.image_url);
    if (sample.hint) {
      setPromptHint(sample.hint);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setSelectedSample(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile && !selectedSample) return;
    onAnalyze({
      file: selectedFile,
      sampleId: selectedSample?.id,
      promptHint: promptHint,
    });
  };

  return (
    <div className="card" style={{ marginBottom: '1.8rem' }}>
      <form onSubmit={handleSubmit}>
        {/* Upload dropzone or active preview */}
        {!previewUrl ? (
          <div
            className={`upload-dropzone ${isDragging ? 'drag-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--mint-100)',
                color: 'var(--mint-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem auto',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <Upload size={28} />
            </div>
            <h3 style={{ fontSize: '1.18rem', marginBottom: '0.4rem', color: 'var(--forest-900)' }}>
              {title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
              {subtitle}
            </p>
            <div style={{ marginTop: '1rem' }}>
              <span className="badge badge-mint" style={{ cursor: 'pointer' }}>
                Browse Files
              </span>
            </div>
          </div>
        ) : (
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              maxHeight: '340px',
              background: '#0D2B1E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '340px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <button
              type="button"
              onClick={clearSelection}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.65)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}
              title="Remove image"
            >
              <X size={18} />
            </button>
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(8, 28, 19, 0.85)',
                color: 'white',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                fontWeight: 600,
                backdropFilter: 'blur(6px)',
              }}
            >
              {selectedSample ? `Sample: ${selectedSample.name}` : `Selected: ${selectedFile?.name}`}
            </div>
          </div>
        )}

        {/* Quick Sample Selector */}
        {samples.length > 0 && (
          <div style={{ marginTop: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--forest-800)' }}>
                ✨ Or Pick a Sample to Test Instantly:
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Zero upload needed
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {samples.map((s) => {
                const isChosen = selectedSample?.id === s.id;
                return (
                  <div
                    key={s.id}
                    id={`sample-item-${s.id}`}
                    onClick={() => selectSampleItem(s)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: isChosen ? 'var(--mint-100)' : 'var(--cream-50)',
                      border: `1.5px solid ${isChosen ? 'var(--mint-500)' : 'var(--cream-border)'}`,
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    <img
                      src={s.image_url}
                      alt={s.name}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          color: 'var(--forest-900)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {s.category || s.status_preview}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Prompt hint input */}
        <div style={{ marginTop: '1.2rem' }}>
          <label className="form-label">
            Context Notes / Specific Observations (Optional)
          </label>
          <input
            type="text"
            className="form-input"
            placeholder={hintPlaceholder}
            value={promptHint}
            onChange={(e) => setPromptHint(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
          {previewUrl && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearSelection}
              disabled={loading}
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            id="analyze-submit-btn"
            className="btn btn-primary"
            disabled={(!selectedFile && !selectedSample) || loading}
            style={{ minWidth: '180px' }}
          >
            {loading ? (
              <>
                <span className="pulse-indicator" style={{ marginRight: '6px' }} />
                Analyzing with Gemini...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                {buttonText}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageUploader;
