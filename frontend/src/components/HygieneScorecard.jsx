import React from 'react';
import { ShieldCheck, AlertCircle, CheckSquare, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import DisclaimerBanner from './DisclaimerBanner';

const HygieneScorecard = ({ data }) => {
  if (!data) return null;

  const {
    location_name,
    overall_score = 88,
    grade = 'Grade B',
    risk_level = 'Low-to-Moderate Risk',
    executive_summary,
    checklist_breakdown = [],
    findings = [],
    corrective_actions = [],
    positive_observations = [],
    is_demo,
    ai_model_used,
  } = data;

  let gradeColor = 'var(--mint-500)';
  let gradeBadge = 'badge-mint';
  if (overall_score < 70) {
    gradeColor = 'var(--accent-rose)';
    gradeBadge = 'badge-rose';
  } else if (overall_score < 85) {
    gradeColor = 'var(--accent-amber)';
    gradeBadge = 'badge-amber';
  }

  return (
    <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
      {/* Hero Audit Grade Card */}
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
            <span className="badge badge-mint">{grade}</span>
            <span className={`badge ${gradeBadge}`}>{risk_level}</span>
            {is_demo && <span className="badge badge-amber">Demo Audit</span>}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>
            {location_name}
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.94rem', lineHeight: '1.5' }}>
            {executive_summary}
          </p>
        </div>

        {/* Audit Score Circle */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: `1.5px solid ${gradeColor}`,
            borderRadius: 'var(--radius-xl)',
            padding: '1.2rem 1.6rem',
            textAlign: 'center',
            minWidth: '160px',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--mint-300)', textTransform: 'uppercase', fontWeight: 700 }}>
            Hygiene Score
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', lineHeight: '1.1' }}>
            {overall_score}
            <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.85)' }}>
            {overall_score >= 90 ? '✅ Outstanding Cleanliness' : '⚠️ Minor Remediation'}
          </div>
        </div>
      </div>

      {/* Checklist Breakdown */}
      {checklist_breakdown.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--forest-900)' }}>
            📋 Area Sanitation & Compliance Breakdown
          </h3>
          <div className="grid-2">
            {checklist_breakdown.map((item, idx) => {
              const isPass = item.status === 'Pass';
              return (
                <div
                  key={idx}
                  style={{
                    padding: '0.9rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isPass ? 'var(--mint-50)' : 'var(--accent-amber-bg)',
                    border: `1px solid ${isPass ? 'var(--mint-200)' : '#FCD34D'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--forest-900)' }}>
                      {item.category_name}
                    </span>
                    <span className={`badge ${isPass ? 'badge-mint' : 'badge-amber'}`}>
                      {item.score}/100
                    </span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-body)', margin: 0 }}>
                    {item.notes}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Corrective Actions Table */}
      {corrective_actions.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <CheckSquare size={20} color="var(--forest-900)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-900)', margin: 0 }}>
              Prioritized Corrective Action Plan
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {corrective_actions.map((action, idx) => {
              const isUrgent = action.priority.toLowerCase().includes('immediate');
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '0.9rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isUrgent ? '#FFF1F2' : 'var(--cream-50)',
                    border: `1.5px solid ${isUrgent ? '#FECDD3' : 'var(--cream-border)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: isUrgent ? 'var(--accent-rose)' : 'var(--forest-800)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--forest-900)' }}>
                        {action.action}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} /> Target Completion: {action.target_timeline}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${isUrgent ? 'badge-rose' : 'badge-forest'}`} style={{ flexShrink: 0 }}>
                    {action.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Positive Observations */}
      {positive_observations.length > 0 && (
        <div className="card card-mint" style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.05rem', color: 'var(--forest-900)', marginBottom: '0.6rem' }}>
            🌟 Commendable Sanitation Practices Observed
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {positive_observations.map((obs, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                <CheckCircle2 size={16} color="var(--mint-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Compliance Disclaimer */}
      <DisclaimerBanner type="hygiene" />
    </div>
  );
};

export default HygieneScorecard;
