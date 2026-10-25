import React from 'react';
import { Menu, Sparkles, Key, User, ShieldAlert, CheckCircle, Search, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TopNav = ({ activeTab, setMobileOpen, onOpenAuth, onOpenSettings }) => {
  const { user, systemStatus } = useAuth();

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard': return 'FoodTech Intelligence Dashboard';
      case 'nutrition': return 'Food Recognition & Nutritional Breakdown';
      case 'freshness': return 'Visual Food Freshness & Shelf-Life Assessment';
      case 'hygiene': return 'Commercial Kitchen & Hygiene Monitoring Audit';
      case 'assistant': return 'Chef FoodVerse AI – Smart Culinary Assistant';
      case 'meal_planner': return 'Personalized Multi-Day Meal Planner';
      case 'history': return 'Intelligence & Audit History Archive';
      case 'settings': return 'System Settings & Gemini AI Configuration';
      default: return 'FoodVerse AI Multimodal Agent';
    }
  };

  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid var(--cream-border)',
        padding: '0.9rem 2.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="btn btn-secondary btn-icon"
          onClick={() => setMobileOpen((prev) => !prev)}
          style={{ display: 'none' }}
          id="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>FoodVerse AI</span>
            <span>/</span>
            <span style={{ color: 'var(--mint-600)' }}>{activeTab.toUpperCase()}</span>
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            {getPageTitle(activeTab)}
          </h1>
        </div>
      </div>

      {/* Right: Mode Indicator & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Gemini Live AI vs Demo Simulation Badge */}
        {systemStatus.gemini_live_ai ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--mint-100)',
              border: '1.5px solid var(--mint-400)',
              color: 'var(--mint-700)',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <span className="pulse-indicator" />
            <span>Live Gemini Vision AI Active</span>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.35rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              background: '#FEF3C7',
              border: '1.5px solid #FCD34D',
              color: '#92400E',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <span className="pulse-indicator pulse-amber" />
            <span>Demo Simulation Mode</span>
            <button
              onClick={onOpenSettings}
              style={{
                background: '#D97706',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '0.15rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginLeft: '0.25rem',
              }}
            >
              <Key size={12} />
              Set API Key
            </button>
          </div>
        )}

        {/* User Button */}
        <button
          onClick={onOpenAuth}
          className="btn btn-secondary"
          style={{
            padding: '0.45rem 0.95rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--forest-800)',
              color: 'var(--mint-300)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <span style={{ fontWeight: 600 }}>{user?.name || 'Chef Alex'}</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default TopNav;
