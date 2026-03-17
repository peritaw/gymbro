import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Flame, Play, Clock, CalendarDays, Plus, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import type { Routine, Stats } from '../types';

export default function HomePage() {
  const { user } = useAuth();
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routinesRes, statsRes] = await Promise.all([
          api.get('/routines'),
          api.get('/training-logs/stats')
        ]);
        
        const active = routinesRes.data.find((r: Routine) => r.isActive);
        setActiveRoutine(active || routinesRes.data[0] || null);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getWeekAdherence = () => {
    if (!stats || stats.weeklyBreakdown.length === 0) return 0;
    const completed = stats.weeklyBreakdown.filter(d => d.completed).length;
    const goal = user?.weeklyGoal || 3;
    return Math.min(100, Math.round((completed / goal) * 100));
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Header Profile Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}
      >
        <div>
          <p className="small">{getGreeting()},</p>
          <h1 className="h2" style={{ lineHeight: 1.2 }}>{user?.name.split(' ')[0]}</h1>
        </div>
        
        {/* Streak Badge */}
        <div className="glass-panel" style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
          background: stats && stats.currentStreak > 0 ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.2))' : undefined,
          border: stats && stats.currentStreak > 0 ? '1px solid var(--accent-primary)' : undefined
        }}>
          <Flame size={20} color={stats && stats.currentStreak > 0 ? "var(--accent-primary)" : "var(--text-tertiary)"} 
            style={stats && stats.currentStreak > 0 ? { filter: 'drop-shadow(0 0 5px rgba(249,115,22,0.5))' } : {}}
          />
          <span style={{ fontWeight: 700, fontSize: '1.125rem', color: stats && stats.currentStreak > 0 ? "var(--accent-primary)" : "var(--text-tertiary)" }}>
            {stats?.currentStreak || 0} <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>días</span>
          </span>
        </div>
      </motion.div>

      {/* Quick Stats Summary */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}
      >
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)' }}>
            <CalendarDays size={16} />
            <span className="small">Adherencia Semanal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <span className="h1" style={{ lineHeight: 1 }}>{getWeekAdherence()}%</span>
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', marginTop: '0.25rem', overflow: 'hidden' }}>
            <div style={{ width: `${getWeekAdherence()}%`, height: '100%', background: 'var(--success)', borderRadius: '2px' }} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)' }}>
            <Clock size={16} />
            <span className="small">Entrenamientos Mes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <span className="h1" style={{ lineHeight: 1 }}>{stats?.completedThisMonth || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* Active Routine Section */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 className="h3">Entrenamiento de Hoy</h2>
        <Link to="/routines" style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', textDecoration: 'none' }}>
          Ver todas
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {activeRoutine ? (
          <div className="glass-panel" style={{ 
            padding: '1.5rem', 
            background: 'linear-gradient(to bottom right, var(--bg-secondary), var(--bg-primary))',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background design element */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: 'var(--accent-glow)',
              borderRadius: '50%',
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--accent-glow)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem' }}>
              RUTINA ACTIVA
            </div>
            
            <h3 className="h2" style={{ marginBottom: '0.25rem' }}>{activeRoutine.name}</h3>
            {activeRoutine.description && (
              <p className="p" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>{activeRoutine.description}</p>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {activeRoutine.days.map((day, idx) => (
                <div key={idx} style={{ 
                  width: '32px', height: '32px', 
                  borderRadius: 'var(--radius-sm)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-tertiary)',
                  fontSize: '0.875rem', fontWeight: 600,
                  color: 'var(--text-secondary)'
                }}>
                  D{day.dayNumber}
                </div>
              ))}
            </div>

            <Link to={`/workout/${activeRoutine.id}`} style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ width: '100%', display: 'flex', gap: '0.5rem' }}>
                <Play size={20} fill="currentColor" />
                COMENZAR ENTRENAMIENTO
              </button>
            </Link>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderStyle: 'dashed' }}>
             <Dumbbell size={48} color="var(--text-tertiary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
             <h3 className="h3" style={{ marginBottom: '0.5rem' }}>No tenés rutinas</h3>
             <p className="p" style={{ marginBottom: '1.5rem' }}>Creá tu primera rutina para empezar a entrenar.</p>
             <Link to="/routines/new" style={{ textDecoration: 'none' }}>
                <button className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
                  <Plus size={18} /> Crear Rutina
                </button>
             </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
