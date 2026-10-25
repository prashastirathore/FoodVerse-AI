import React from 'react';
import { Award, Flame, Heart, Activity, CheckCircle, Lightbulb, PieChart } from 'lucide-react';
import DisclaimerBanner from './DisclaimerBanner';

const NutritionCharts = ({ data }) => {
  if (!data) return null;

  const {
    title,
    summary,
    health_score,
    dietary_classification = [],
    macronutrients = {},
    micronutrients = {},
    items = [],
    insights = [],
    recommendations = [],
    is_demo,
    ai_model_used,
  } = data;

  const cal = macronutrients.calories || 0;
  const protein = macronutrients.protein_g || 0;
  const carbs = macronutrients.carbohydrates_g || 0;
  const fats = macronutrients.fats_g || 0;
  const fiber = macronutrients.fiber_g || 0;

  // Calculate percentages
  const totalMacroGrams = (protein + carbs + fats) || 1;
  const pPct = Math.round((protein / totalMacroGrams) * 100);
  const cPct = Math.round((carbs / totalMacroGrams) * 100);
  const fPct = Math.round((fats / totalMacroGrams) * 100);

  return (
    <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
      {/* Top Header Card */}
      <div
        className="card card-forest"
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.2rem',
        }}
      >
        <div style={{ maxWidth: '620px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-mint">{ai_model_used || 'Gemini Vision AI'}</span>
            {is_demo && <span className="badge badge-amber">Demo Sample Data</span>}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>
            {title}
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.94rem', lineHeight: '1.5' }}>
            {summary}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
            {dietary_classification.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: 'var(--mint-300)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid rgba(178, 239, 213, 0.2)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Health Score Dial */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.2rem 1.6rem',
            textAlign: 'center',
            minWidth: '150px',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--mint-300)', textTransform: 'uppercase', fontWeight: 700 }}>
            Health Score
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', lineHeight: '1.1' }}>
            {health_score}
            <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--mint-300)' }}>
            {health_score >= 85 ? '🌟 Nutrient Dense' : '⚖️ Moderately Balanced'}
          </div>
        </div>
      </div>

      {/* Macronutrient Distribution Grid */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {/* Calories */}
        <div className="card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Estimated Energy</span>
            <Flame size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            {cal} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>kcal</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            ~{Math.round((cal / 2000) * 100)}% of 2,000 kcal standard target
          </div>
        </div>

        {/* Protein */}
        <div className="card" style={{ borderLeft: '4px solid var(--mint-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Protein</span>
            <span className="badge badge-mint">{pPct}%</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            {protein} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>g</span>
          </div>
          <div className="progress-bar-bg" style={{ marginTop: '0.6rem' }}>
            <div className="progress-bar-fill fill-mint" style={{ width: `${Math.min(pPct * 2, 100)}%` }} />
          </div>
        </div>

        {/* Carbohydrates & Fiber */}
        <div className="card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Carbohydrates</span>
            <span className="badge badge-blue">{cPct}%</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            {carbs} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>g</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Fiber: <strong>{fiber}g</strong> | Net: {Math.max(0, carbs - fiber)}g
          </div>
        </div>

        {/* Fats */}
        <div className="card" style={{ borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Healthy Fats</span>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#8B5CF6' }}>{fPct}%</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            {fats} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>g</span>
          </div>
          <div className="progress-bar-bg" style={{ marginTop: '0.6rem' }}>
            <div className="progress-bar-fill" style={{ width: `${Math.min(fPct * 2, 100)}%`, background: '#8B5CF6' }} />
          </div>
        </div>
      </div>

      {/* Identified Food Items Breakdown */}
      {items.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--forest-900)' }}>
            🍽️ Identified Food Components & Portions
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--cream-border)', color: 'var(--forest-900)' }}>
                  <th style={{ padding: '0.7rem 0.5rem' }}>Food Component</th>
                  <th style={{ padding: '0.7rem 0.5rem' }}>Estimated Portion</th>
                  <th style={{ padding: '0.7rem 0.5rem' }}>Calories</th>
                  <th style={{ padding: '0.7rem 0.5rem' }}>Protein</th>
                  <th style={{ padding: '0.7rem 0.5rem' }}>Carbs</th>
                  <th style={{ padding: '0.7rem 0.5rem' }}>Fats</th>
                  <th style={{ padding: '0.7rem 0.5rem' }}>Glycemic Index</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--cream-200)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--forest-900)' }}>
                      {it.name}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                      {it.portion_size}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                      {it.calories} kcal
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--mint-600)', fontWeight: 600 }}>
                      {it.protein_g}g
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      {it.carbs_g}g
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      {it.fats_g}g
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className="badge badge-mint">{it.glycemic_index || 'Low'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Micronutrients, Insights & Recommendations */}
      <div className="grid-2" style={{ marginBottom: '1.2rem' }}>
        {/* Micronutrients */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.8rem', color: 'var(--forest-900)' }}>
            🧬 Micronutrient Highlights
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {Object.entries(micronutrients).map(([micro, val], idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--mint-50)',
                  border: '1px solid var(--mint-200)',
                  padding: '0.5rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--forest-900)' }}>{micro}:</span>
                <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--mint-600)' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nutritional Insights & Tips */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.8rem', color: 'var(--forest-900)' }}>
            💡 AI Nutritional Guidance
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {insights.map((ins, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                <CheckCircle size={16} color="var(--mint-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{ins}</span>
              </li>
            ))}
            {recommendations.map((rec, idx) => (
              <li key={`rec-${idx}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                <Lightbulb size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mandatory Nutrition Estimates Disclaimer */}
      <DisclaimerBanner type="nutrition" />
    </div>
  );
};

export default NutritionCharts;
