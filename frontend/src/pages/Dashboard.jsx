import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Utensils,
  Apple,
  ClipboardCheck,
  ChefHat,
  CalendarDays,
  Flame,
  ArrowRight,
  TrendingUp,
  Activity,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { dashboardApi } from '../api/mealApi';
import { useAuth } from '../context/AuthContext';

const Dashboard = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .getStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Dashboard stats load error:', err);
        setLoading(false);
      });
  }, []);

  const featureCards = [
    {
      id: 'nutrition',
      title: 'Food Recognition & Nutrition',
      desc: 'Multimodal Gemini vision analysis to detect meal portions, calories, and macros.',
      icon: Utensils,
      color: 'linear-gradient(135deg, #0F3827 0%, #164E34 100%)',
      badge: 'Vision AI',
    },
    {
      id: 'freshness',
      title: 'Freshness & Spoilage Detection',
      desc: 'Inspect visible bruising, mold patterns, and wilting with shelf-life forecasts.',
      icon: Apple,
      color: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      badge: 'Inspection',
    },
    {
      id: 'hygiene',
      title: 'Restaurant Hygiene Monitoring',
      desc: 'Commercial kitchen visual audits, cleanliness scoring, and corrective actions.',
      icon: ClipboardCheck,
      color: 'linear-gradient(135deg, #115E59 0%, #0D9488 100%)',
      badge: 'Safety Grade',
    },
    {
      id: 'assistant',
      title: 'Smart Culinary Assistant',
      desc: 'Voice & chat culinary agent for recipes, substitutions, and step-by-step cooking.',
      icon: ChefHat,
      color: 'linear-gradient(135deg, #854D0E 0%, #D97706 100%)',
      badge: 'Hands-Free Voice',
    },
    {
      id: 'meal_planner',
      title: 'Personalized Meal Planner',
      desc: 'Calorie-targeted weekly meal blueprints, 1-click swaps, and smart grocery checklists.',
      icon: CalendarDays,
      color: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
      badge: 'Calorie Macro Sync',
    },
  ];

  return (
    <div>
      {/* Welcome Hero Banner */}
      <div
        className="card card-forest"
        style={{
          marginBottom: '1.8rem',
          padding: '2.2rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #081C13 0%, #0F3827 50%, #164E34 100%)',
          boxShadow: 'var(--shadow-forest)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span className="badge badge-mint">
              <Sparkles size={13} /> Gemini Multimodal Intelligence
            </span>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)' }}>
              FoodTech Dashboard v1.0
            </span>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.6rem' }}>
            Welcome back, {user?.name || 'Chef Alex'}!
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.4rem' }}>
            Your multimodal culinary intelligence command center. Upload dishes for instant nutritional breakdown, inspect produce freshness, audit kitchen hygiene, or plan your weekly nutrition.
          </p>

          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('nutrition')}>
              <Utensils size={18} /> Analyze Food Nutrition
            </button>
            <button className="btn btn-forest" onClick={() => setActiveTab('assistant')}>
              <ChefHat size={18} /> Ask Cooking Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '1.8rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Food Analyses</span>
            <Utensils size={18} color="var(--mint-500)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            {stats?.breakdown?.nutrition_scans || 12}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--mint-600)', fontWeight: 600 }}>
            Macro & calorie breakdown
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Freshness Audits</span>
            <Apple size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            {stats?.breakdown?.freshness_scans || 8}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
            Avg score 87/100 (Peak)
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Kitchen Audits</span>
            <ClipboardCheck size={18} color="#0D9488" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            {stats?.breakdown?.hygiene_audits || 4}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#0D9488', fontWeight: 600 }}>
            Grade B (Good compliance)
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Daily Calorie Goal</span>
            <Flame size={18} color="var(--accent-rose)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            {stats?.calorie_target || 2000} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>kcal</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Target maintenance intake
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards (All 5 features) */}
      <div style={{ marginBottom: '1.8rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-900)', marginBottom: '1rem', fontWeight: 800 }}>
          ⚡ Multimodal Feature Command Center
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.2rem',
          }}
        >
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className="card"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid var(--mint-500)`,
                  transition: 'var(--transition)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: feat.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="badge badge-mint">{feat.badge}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--forest-900)', marginBottom: '0.4rem' }}>
                    {feat.title}
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                    {feat.desc}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--mint-600)',
                  }}
                >
                  <span>Launch Tool</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Nutrition Trends & Activity Feed */}
      <div className="grid-2" style={{ marginBottom: '1.8rem' }}>
        {/* Weekly Chart */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-900)' }}>
                Weekly Calorie & Macronutrient Trends
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Energy intake vs 2,000 kcal target
              </span>
            </div>
            <span className="badge badge-mint">Target Sync</span>
          </div>

          {/* Pure CSS / SVG Chart */}
          <div style={{ padding: '0.8rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '0.8rem', borderBottom: '2px solid var(--cream-border)', paddingBottom: '0.5rem' }}>
              {(stats?.weekly_trends || [
                { day: 'Mon', calories: 2150, protein: 140 },
                { day: 'Tue', calories: 1980, protein: 135 },
                { day: 'Wed', calories: 2240, protein: 150 },
                { day: 'Thu', calories: 2050, protein: 142 },
                { day: 'Fri', calories: 2300, protein: 148 },
                { day: 'Sat', calories: 2180, protein: 130 },
                { day: 'Sun', calories: 2020, protein: 138 },
              ]).map((bar, i) => {
                const heightPct = Math.round((bar.calories / 2600) * 100);
                const isOver = bar.calories > 2200;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--forest-900)', marginBottom: '0.2rem' }}>
                      {bar.calories}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '36px',
                        height: `${heightPct}%`,
                        background: isOver
                          ? 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)'
                          : 'linear-gradient(180deg, var(--mint-400) 0%, var(--mint-600) 100%)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.5s ease',
                      }}
                      title={`${bar.day}: ${bar.calories} kcal | ${bar.protein}g protein`}
                    />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      {bar.day}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginTop: '0.8rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '10px', height: '10px', background: 'var(--mint-500)', borderRadius: '2px' }} /> On Target (1900-2200)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '10px', height: '10px', background: '#F59E0B', borderRadius: '2px' }} /> Calorie Surplus (&gt;2200)
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-900)' }}>
              Recent Intelligence Scans
            </h3>
            <button
              onClick={() => setActiveTab('history')}
              style={{ background: 'transparent', border: 'none', color: 'var(--mint-600)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              View Full History →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {(stats?.recent_activity?.length ? stats.recent_activity : [
              { type: 'nutrition', title: 'Mediterranean Salmon Bowl', summary: '585 kcal • 42.5g protein • Health Score 94/100', score: 94 },
              { type: 'freshness', title: 'Cavendish Bananas', summary: 'Status: Consume Soon (Sugar Freckling) • Score 72/100', score: 72 },
              { type: 'hygiene', title: 'Prep Line Station #2', summary: 'Grade B Compliance • Score 88/100', score: 88 },
            ]).map((act, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--cream-50)',
                  border: '1px solid var(--cream-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: act.type === 'nutrition' ? 'var(--mint-100)' : act.type === 'freshness' ? '#FEF3C7' : '#E0F2FE',
                      color: act.type === 'nutrition' ? 'var(--mint-600)' : act.type === 'freshness' ? '#D97706' : '#0284C7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {act.type === 'nutrition' ? <Utensils size={15} /> : act.type === 'freshness' ? <Apple size={15} /> : <ClipboardCheck size={15} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--forest-900)' }}>
                      {act.title}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {act.summary}
                    </div>
                  </div>
                </div>

                <span className="badge badge-mint">{act.score}/100</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
