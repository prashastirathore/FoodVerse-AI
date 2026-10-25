import React from 'react';
import { AlertTriangle, Info, ShieldCheck } from 'lucide-react';

const DisclaimerBanner = ({ type = 'general' }) => {
  const content = {
    nutrition: {
      title: 'Nutritional Estimation Advisory',
      text: 'Nutritional estimates, portion weights, and macro values are visual AI approximations based on photographic analysis and should not replace clinical medical dietary advice.',
      badge: 'Estimate Advisory',
    },
    freshness: {
      title: 'Food Safety & Freshness Notice',
      text: 'Visual inspection detects surface patterns, discoloration, and visible mold only. Optical AI cannot detect odorless microbial contamination, chemical toxins, or guarantee food safety. When in doubt, discard questionable food.',
      badge: 'Visual Safety Advisory',
    },
    hygiene: {
      title: 'Hygiene Audit Advisory',
      text: 'This automated audit is an assistive photographic monitoring tool. It does not replace official municipal health certifications, regulatory microbiological tests, or comprehensive on-site inspections.',
      badge: 'Compliance Advisory',
    },
    general: {
      title: 'FoodVerse AI Scientific Advisory',
      text: 'Nutrition figures are estimates and visual food-safety assessments cannot establish microbiological contamination or guarantee food safety.',
      badge: 'Safety First',
    },
  }[type] || {
    title: 'Advisory',
    text: 'Nutrition values are estimates; visual food-safety assessments cannot guarantee safety.',
    badge: 'Notice',
  };

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #FEF3C7 0%, #FFFBEB 100%)',
        border: '1.5px solid #FCD34D',
        borderRadius: 'var(--radius-md)',
        padding: '0.9rem 1.2rem',
        margin: '1.2rem 0',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        style={{
          background: '#F59E0B',
          color: 'white',
          borderRadius: '50%',
          width: '26px',
          height: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        <AlertTriangle size={15} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#92400E' }}>
            {content.title}
          </span>
          <span
            style={{
              background: '#FDE68A',
              color: '#78350F',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.1rem 0.45rem',
              borderRadius: '999px',
              textTransform: 'uppercase',
            }}
          >
            {content.badge}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#78350F', lineHeight: '1.45' }}>
          {content.text}
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
