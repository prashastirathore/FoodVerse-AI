import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Sparkles } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import HygieneScorecard from '../components/HygieneScorecard';
import { hygieneApi } from '../api/hygieneApi';

const HygieneAudit = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    hygieneApi.getSamples().then(setSamples).catch(() => {});
  }, []);

  const handleAudit = async ({ file, sampleId, promptHint }) => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      if (sampleId) {
        formData.append('sample_id', sampleId);
      }
      if (promptHint) {
        formData.append('location_hint', promptHint);
      }

      const data = await hygieneApi.auditHygiene(formData);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to complete kitchen hygiene audit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.4rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-900)' }}>
          Commercial & Residential Kitchen Hygiene Audit
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Analyze food preparation counters, cooking lines, sinks, and storage areas for visible grease, cross-contamination risks, clutter, and regulatory compliance. Receive graded scores and corrective action plans.
        </p>
      </div>

      {error && (
        <div style={{ padding: '0.8rem 1.2rem', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', color: '#B91C1C', marginBottom: '1.2rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      <ImageUploader
        title="Upload Kitchen or Prep Station Photo"
        subtitle="Upload photos of prep stations, cook lines, refrigeration, or dishwashing zones for optical audit"
        samples={samples}
        onAnalyze={handleAudit}
        loading={loading}
        buttonText="Execute Hygiene Audit"
        hintPlaceholder="e.g. 'Station 2 salad prep line during lunch rush' or 'Exhaust hood and flat-top grill'"
      />

      {result && <HygieneScorecard data={result} />}
    </div>
  );
};

export default HygieneAudit;
