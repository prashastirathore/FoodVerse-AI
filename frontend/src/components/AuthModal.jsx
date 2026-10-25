import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { user, login, register, loginDemoGuest, logout, loading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetCalories, setTargetCalories] = useState(2000);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, targetCalories);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication error.');
    }
  };

  const handleDemoGuest = async () => {
    setError('');
    try {
      await loginDemoGuest();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--forest-900)' }}>
              {mode === 'login' ? 'Welcome to FoodVerse' : 'Create Chef Account'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Secure JWT authentication with MongoDB persistence
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.65rem 0.9rem', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', color: '#B91C1C', fontSize: '0.84rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {/* 1-Click Instant Guest Button */}
        <div style={{ marginBottom: '1.4rem' }}>
          <button
            type="button"
            className="btn btn-forest"
            onClick={handleDemoGuest}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
            }}
          >
            <Sparkles size={18} color="var(--mint-400)" />
            <span>1-Click Continue as Demo Guest (Chef Alex)</span>
          </button>
          <div style={{ textAlign: 'center', margin: '1rem 0 0.6rem 0', position: 'relative' }}>
            <span style={{ background: '#FFFFFF', padding: '0 0.8rem', color: 'var(--text-muted)', fontSize: '0.78rem', position: 'relative', zIndex: 1 }}>
              or enter account details
            </span>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--cream-border)' }} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Chef Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="chef@foodverse.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Daily Calorie Target (kcal)</label>
              <input
                type="number"
                className="form-input"
                value={targetCalories}
                onChange={(e) => setTargetCalories(Number(e.target.value))}
                min={1000}
                max={4500}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.6rem' }}
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to FoodVerse' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{ background: 'none', border: 'none', color: 'var(--mint-600)', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--mint-600)', fontWeight: 700, cursor: 'pointer' }}
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
