import React, { useState, useEffect } from 'react';
import { Utensils, Sparkles, History as HistoryIcon } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import NutritionCharts from '../components/NutritionCharts';
import { nutritionApi } from '../api/nutritionApi';

const NutritionAnalysis = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    nutritionApi.getSamples().then(setSamples).catch(() => {});
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
        formData.append('prompt_hint', promptHint);
      }

      const data = await nutritionApi.analyzeNutrition(formData);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze food nutrition.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.4rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-900)' }}>
          Food Recognition & Nutrition Analysis
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Upload meal photos for multimodal Gemini Vision AI to identify food items, estimate calories, calculate macronutrients (protein, carbs, fats, fiber), and evaluate nutritional density.
        </p>
      </div>

      {error && (
        <div style={{ padding: '0.8rem 1.2rem', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', color: '#B91C1C', marginBottom: '1.2rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Image Uploader */}
      <ImageUploader
        title="Upload Meal or Dish Photo"
        subtitle="Upload a clear photo of your dish or pick a preset below to analyze with Gemini Vision AI"
        samples={samples}
        onAnalyze={handleAnalyze}
        loading={loading}
        buttonText="Recognize & Analyze Nutrition"
        hintPlaceholder="e.g. 'Homemade grain bowl with olive oil dressing' or '2 slices of artisanal sourdough'"
      />

      {/* Analysis Result Display */}
      {result && <NutritionCharts data={result} />}
    </div>
  );
};

export default NutritionAnalysis;
