import React from 'react';
import {
  LayoutDashboard,
  Utensils,
  Apple,
  ClipboardCheck,
  ChefHat,
  CalendarDays,
  History,
  Settings,
  Sparkles,
  Database,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen, onOpenAuth }) => {
  const { user, systemStatus } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'nutrition', label: 'Food Recognition & Nutrition', icon: Utensils, badge: 'Vision AI' },
    { id: 'freshness', label: 'Food Freshness Detection', icon: Apple, badge: 'Inspection' },
    { id: 'hygiene', label: 'Restaurant Hygiene Audit', icon: ClipboardCheck, badge: 'Safety' },
    { id: 'assistant', label: 'Smart Cooking Assistant', icon: ChefHat, badge: 'Voice/Chat' },
    { id: 'meal_planner', label: 'Personalized Meal Planner', icon: CalendarDays, badge: 'Macros' },
    { id: 'history', label: 'Intelligence History', icon: History },
    { id: 'settings', label: 'Settings & Gemini Key', icon: Settings },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8, 28, 19, 0.7)',
            zIndex: 90,
          }}
        />
      )}

      <aside
        style={{
          width: '280px',
          background: 'var(--forest-sidebar)',
          color: 'var(--text-light)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(178, 239, 213, 0.12)',
          zIndex: 95,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: mobileOpen ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          bottom: 0,
          height: '100vh',
          overflowY: 'auto',
          transform: mobileOpen ? 'translateX(0)' : (window.innerWidth <= 1024 && !mobileOpen ? 'translateX(-100%)' : 'none'),
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.8rem 1.4rem 1.4rem 1.4rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: '1.15',
                }}
              >
                FoodVerse <span style={{ color: 'var(--mint-400)' }}>AI</span>
              </h2>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--mint-300)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Multimodal Food Agent
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ padding: '1.2rem 0.8rem', flex: 1 }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'rgba(255, 255, 255, 0.45)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 0.8rem 0.6rem 0.8rem',
            }}
          >
            Core Capabilities
          </div>
          <ul style={{ listStyle: 'none' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} style={{ marginBottom: '0.35rem' }}>
                  <button
                    onClick={() => handleSelect(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.75rem 0.95rem',
                      borderRadius: 'var(--radius-md)',
                      background: isActive
                        ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.08) 100%)'
                        : 'transparent',
                      border: isActive ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid transparent',
                      color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.72)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 700 : 500,
                      fontFamily: 'var(--font-heading)',
                      textAlign: 'left',
                      transition: 'var(--transition)',
                    }}
                  >
                    <Icon
                      size={19}
                      color={isActive ? 'var(--mint-400)' : 'rgba(255, 255, 255, 0.65)'}
                    />
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: 'var(--radius-pill)',
                          background: isActive ? 'var(--mint-500)' : 'rgba(255, 255, 255, 0.1)',
                          color: isActive ? '#081C13' : 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* System & AI Badge Footer */}
        <div
          style={{
            padding: '1.2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Status Box */}
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>AI Vision Engine:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className={systemStatus.gemini_live_ai ? 'pulse-indicator' : 'pulse-indicator pulse-amber'} />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: systemStatus.gemini_live_ai ? 'var(--mint-400)' : '#FBBF24' }}>
                  {systemStatus.gemini_live_ai ? 'Live Gemini' : 'Demo Mode'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>Database:</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--mint-300)', fontWeight: 600 }}>
                {systemStatus.database_mode || 'MongoDB'}
              </span>
            </div>
          </div>

          {/* User profile capsule */}
          <div
            onClick={onOpenAuth}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            title="Click to view profile or login"
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981, #047857)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : 'C'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name || 'Chef Alex'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--mint-300)' }}>
                {user?.is_demo ? 'Guest Chef (Demo)' : 'Verified Member'}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
