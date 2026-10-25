import React, { useState } from 'react';
import { Key, Database, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';

const Settings = () => {
  const { user, systemStatus, checkStatus } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [keyMessage, setKeyMessage] = useState(null);

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    setSavingKey(true);
    setKeyMessage(null);
    try {
      const res = await authApi.configureGeminiKey(apiKey);
      setKeyMessage({ success: true, text: res.message });
      await checkStatus();
    } catch (err) {
      setKeyMessage({ success: false, text: err.message || 'Failed to update API key.' });
    } finally {
      setSavingKey(false);
    }
  };

  const handleResetToDemo = async () => {
    setSavingKey(true);
    setApiKey('');
    try {
      const res = await authApi.configureGeminiKey('');
      setKeyMessage({ success: true, text: 'Switched to Demo Simulation Mode.' });
      await checkStatus();
    } catch (err) {
      setKeyMessage({ success: false, text: err.message });
    } finally {
      setSavingKey(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.4rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-900)' }}>
          System Settings & Gemini AI Engine
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Configure Google Gemini AI credentials, verify MongoDB storage health, and manage your culinary profile.
        </p>
      </div>

      <div className="grid-2">
        {/* Gemini API Key Configuration Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Key size={22} color="var(--mint-500)" />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-900)', margin: 0 }}>
              Google Gemini Vision AI Setup
            </h3>
          </div>

          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: systemStatus.gemini_live_ai ? 'var(--mint-100)' : '#FEF3C7',
              border: `1.5px solid ${systemStatus.gemini_live_ai ? 'var(--mint-400)' : '#FCD34D'}`,
              marginBottom: '1.2rem',
              fontSize: '0.86rem',
            }}
          >
            <div style={{ fontWeight: 800, color: systemStatus.gemini_live_ai ? 'var(--mint-700)' : '#92400E', marginBottom: '0.2rem' }}>
              Current AI Status: {systemStatus.gemini_live_ai ? '🟢 Live Gemini Vision AI Active' : '🟡 Demo Mode Active (Sample Intelligence)'}
            </div>
            <p style={{ margin: 0, color: systemStatus.gemini_live_ai ? 'var(--mint-700)' : '#78350F', fontSize: '0.8rem' }}>
              {systemStatus.gemini_live_ai
                ? 'Your Gemini API key is configured. All image uploads and questions are analyzed live using multimodal Gemini.'
                : 'Zero API credentials required! The app is operating in high-fidelity demo simulation mode using curated sample intelligence.'}
            </p>
          </div>

          {keyMessage && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: keyMessage.success ? 'var(--mint-100)' : '#FEE2E2',
                color: keyMessage.success ? 'var(--mint-700)' : '#B91C1C',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {keyMessage.text}
            </div>
          )}

          <form onSubmit={handleSaveApiKey}>
            <div className="form-group">
              <label className="form-label">
                Google Gemini API Key
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
                You can obtain a free Gemini API key at{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--mint-600)', fontWeight: 600 }}
                >
                  Google AI Studio <ExternalLink size={11} style={{ display: 'inline' }} />
                </a>
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.2rem' }}>
              <button type="submit" className="btn btn-primary" disabled={savingKey}>
                <Sparkles size={16} />
                {savingKey ? 'Testing Key...' : 'Save & Activate Live AI'}
              </button>
              {systemStatus.gemini_live_ai && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResetToDemo}
                  disabled={savingKey}
                >
                  Switch Back to Demo Mode
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Database & Infrastructure Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Database size={22} color="var(--forest-800)" />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-900)', margin: 0 }}>
              Database & Architecture State
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--cream-50)',
                border: '1px solid var(--cream-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--forest-900)' }}>
                  Storage Engine
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {systemStatus.database_mode || 'MongoDB Server (Native)'}
                </div>
              </div>
              <span className="badge badge-mint">Online & Connected</span>
            </div>

            <div
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--cream-50)',
                border: '1px solid var(--cream-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--forest-900)' }}>
                  Active User Profile
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {user?.name} ({user?.email})
                </div>
              </div>
              <span className="badge badge-forest">
                {user?.is_demo ? 'Guest Session' : 'Account'}
              </span>
            </div>

            <div
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--cream-50)',
                border: '1px solid var(--cream-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--forest-900)' }}>
                  Daily Calorie Maintenance Goal
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Calibrated to your meal plans
                </div>
              </div>
              <span style={{ fontWeight: 800, color: 'var(--forest-900)', fontSize: '0.92rem' }}>
                {user?.daily_calorie_target || 2000} kcal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
