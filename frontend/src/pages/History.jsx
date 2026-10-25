import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Utensils, Apple, ClipboardCheck, Sparkles, Calendar } from 'lucide-react';
import { nutritionApi } from '../api/nutritionApi';

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    nutritionApi
      .getHistory()
      .then((data) => {
        setHistoryItems(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const filteredItems = filter === 'all'
    ? historyItems
    : historyItems.filter((item) => item.type === filter);

  return (
    <div>
      <div style={{ marginBottom: '1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-900)' }}>
            Intelligence & Scan History Archive
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Review past multimodal food recognition, produce freshness assessments, and kitchen audits stored in MongoDB.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--cream-card)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-border)' }}>
          {['all', 'nutrition', 'freshness', 'hygiene'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: filter === f ? 'var(--forest-800)' : 'transparent',
                color: filter === f ? '#FFFFFF' : 'var(--forest-900)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <span className="pulse-indicator" style={{ marginRight: '6px' }} />
          Loading audit logs from database...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <HistoryIcon size={42} color="var(--mint-400)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-900)' }}>No scans recorded in this category yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '400px', margin: '0.5rem auto' }}>
            Run a food recognition scan, freshness check, or kitchen audit to view persistent history here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredItems.map((item, idx) => (
            <div
              key={item._id || idx}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: item.type === 'nutrition' ? 'var(--mint-100)' : item.type === 'freshness' ? '#FEF3C7' : '#E0F2FE',
                    color: item.type === 'nutrition' ? 'var(--mint-600)' : item.type === 'freshness' ? '#D97706' : '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.type === 'nutrition' ? <Utensils size={20} /> : item.type === 'freshness' ? <Apple size={20} /> : <ClipboardCheck size={20} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-mint">{item.type}</span>
                    {item.is_demo && <span className="badge badge-amber">Demo Data</span>}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--forest-900)', marginTop: '0.2rem' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    {item.summary}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--forest-900)' }}>
                    {item.health_score || 90}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} /> {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
