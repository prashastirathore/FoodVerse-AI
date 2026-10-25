import React from 'react';
import { Apple, ShieldCheck, AlertTriangle, Clock, Thermometer, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import DisclaimerBanner from './DisclaimerBanner';

const FreshnessScorecard = ({ data }) => {
  if (!data) return null;

  const {
    item_name,
    category,
    freshness_status,
    freshness_index = 80,
    confidence = 0.9,
    estimated_shelf_life,
    visible_signs = [],
    observations = [],
    storage_recommendation,
    culinary_rescue_tips,
    is_demo,
    ai_model_used,
  } = data;

  // Determine status color theme
  let statusBadgeClass = 'badge-mint';
  let gaugeColor = 'var(--mint-500)';
  if (freshness_index < 60) {
    statusBadgeClass = 'badge-rose';
    gaugeColor = 'var(--accent-rose)';
  } else if (freshness_index < 80) {
    statusBadgeClass = 'badge-amber';
    gaugeColor = 'var(--accent-amber)';
  }

  return (
    <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
      {/* Top Banner Card */}
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
            <span className="badge badge-mint">{category}</span>
            <span className="badge badge-forest">{ai_model_used || 'Gemini Vision AI'}</span>
            {is_demo && <span className="badge badge-amber">Demo Sample</span>}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>
            {item_name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.6rem' }}>
            <span className={`badge ${statusBadgeClass}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
              {freshness_status}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)' }}>
              Confidence: {Math.round(confidence * 100)}%
            </span>
          </div>
        </div>

        {/* Freshness Index Dial */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: `1.5px solid ${gaugeColor}`,
            borderRadius: 'var(--radius-xl)',
            padding: '1.2rem 1.6rem',
            textAlign: 'center',
            minWidth: '160px',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--mint-300)', textTransform: 'uppercase', fontWeight: 700 }}>
            Freshness Index
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', lineHeight: '1.1' }}>
            {freshness_index}
            <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.85)' }}>
            {freshness_index >= 85 ? '🟢 Peak Freshness' : (freshness_index >= 65 ? '🟡 Consume Soon' : '🔴 High Spoilage Risk')}
          </div>
        </div>
      </div>

      {/* Shelf Life & Storage Grid */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--mint-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Clock size={20} color="var(--mint-500)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--forest-900)' }}>Estimated Shelf Life</h3>
          </div>
          <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-800)', marginBottom: '0.4rem' }}>
            {estimated_shelf_life}
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Calculated from visible cellular turgor, color spectrum, and post-harvest oxidation.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Thermometer size={20} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--forest-900)' }}>Storage Recommendation</h3>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
            {storage_recommendation}
          </p>
        </div>
      </div>

      {/* Visible Signs Audit Table */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--forest-900)' }}>
          🔬 Visible Freshness & Degradation Inspection
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {visible_signs.map((sign, idx) => {
            const hasIssue = sign.observed && sign.severity !== 'None';
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: hasIssue ? 'var(--accent-amber-bg)' : 'var(--mint-50)',
                  border: `1px solid ${hasIssue ? '#FCD34D' : 'var(--mint-200)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  {hasIssue ? (
                    <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <CheckCircle2 size={18} color="var(--mint-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--forest-900)' }}>
                      {sign.category}
                    </div>
                    <div style={{ fontSize: '0.83rem', color: 'var(--text-body)', marginTop: '0.2rem' }}>
                      {sign.details}
                    </div>
                  </div>
                </div>

                <span
                  className={`badge ${hasIssue ? 'badge-amber' : 'badge-mint'}`}
                  style={{ flexShrink: 0, marginLeft: '1rem' }}
                >
                  {hasIssue ? `${sign.severity} Severity` : 'Clear'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Culinary Rescue Tips */}
      {culinary_rescue_tips && (
        <div
          className="card card-mint"
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--mint-500)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--forest-900)', marginBottom: '0.25rem' }}>
              🍳 Zero-Waste Culinary Rescue Tips
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', margin: 0, lineHeight: '1.5' }}>
              {culinary_rescue_tips}
            </p>
          </div>
        </div>
      )}

      {/* Food Safety Caution Disclaimer */}
      <DisclaimerBanner type="freshness" />
    </div>
  );
};

export default FreshnessScorecard;
