import React, { useState, useEffect } from 'react';
import { Apple, ShieldCheck, AlertCircle } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import FreshnessScorecard from '../components/FreshnessScorecard';
import { freshnessApi } from '../api/freshnessApi';

const FreshnessDetection = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    freshnessApi.getSamples().then(setSamples).catch(() => {});
  }, []);

  const handleAnalyze = async ({ file, sampleId, promptHint }) => {
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
        formData.append('item_hint', promptHint);
      }

      const data = await freshnessApi.analyzeFreshness(formData);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to detect food freshness.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.4rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-900)' }}>
          Food Freshness & Spoilage Detection
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Inspect fruits, vegetables, baked goods, and prepared foods for visible signs of bruising, discoloration, mold-like spores, and wilting. Receive shelf-life estimates and zero-waste rescue tips.
        </p>
      </div>

      {error && (
        <div style={{ padding: '0.8rem 1.2rem', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', color: '#B91C1C', marginBottom: '1.2rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      <ImageUploader
        title="Upload Food or Produce Photo"
        subtitle="Upload produce, bakery, meat, or prepared food photos to inspect visible freshness indicators"
        samples={samples}
        onAnalyze={handleAnalyze}
        loading={loading}
        buttonText="Detect Freshness & Shelf-Life"
        hintPlaceholder="e.g. 'Bananas stored at room temp for 4 days' or 'Refrigerated organic spinach'"
      />

      {result && <FreshnessScorecard data={result} />}
    </div>
  );
};

export default FreshnessDetection;
