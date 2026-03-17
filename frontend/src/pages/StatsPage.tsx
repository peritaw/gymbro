import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, CalendarDays, Activity, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Stats } from '../types';
import api from '../api/client';

export default function StatsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/training-logs/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '30px', height: '30px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const totalCompletionsThisWeek = stats.weeklyBreakdown.filter(d => d.completed).length;
  const goal = user?.weeklyGoal || 3;
  const adherence = Math.min(100, Math.round((totalCompletionsThisWeek / goal) * 100));

  return (
    <div style={{ padding: '1rem 0 2rem' }}>
      <h1 className="h1" style={{ marginBottom: '1.5rem' }}>Tu Progreso</h1>

      {/* Hero Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel" 
          style={{ 
            padding: '1.25rem', 
            background: stats.currentStreak > 0 ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.05))' : undefined,
            border: stats.currentStreak > 0 ? '1px solid rgba(249, 115, 22, 0.3)' : undefined
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
            <Flame size={20} />
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Racha Actual</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span className="h1" style={{ lineHeight: 1 }}>{stats.currentStreak}</span>
            <span className="small">días</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel" style={{ padding: '1.25rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-tertiary)' }}>
            <Trophy size={20} />
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Mejor Racha</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span className="h2" style={{ lineHeight: 1 }}>{stats.bestStreak}</span>
            <span className="small">días</span>
          </div>
        </motion.div>
      </div>

      {/* Current Week Adherence */}
      <h2 className="h3" style={{ marginBottom: '1rem' }}>Esta Semana</h2>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              <Activity size={18} />
              <span>Adherencia</span>
            </div>
            <span className="h2">{adherence}%</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="h3">{totalCompletionsThisWeek}</span>
            <span className="small"> / {goal} días meta</span>
          </div>
        </div>

        {/* Mini days circles */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
          {stats.weeklyBreakdown.map((day, idx) => {
            const isToday = new Date(day.date).toDateString() === new Date().toDateString();
            
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: day.completed ? 'var(--success)' : 'var(--bg-tertiary)',
                  border: isToday && !day.completed ? '2px solid var(--accent-primary)' : 'none',
                  color: day.completed ? 'white' : 'var(--text-tertiary)',
                  boxShadow: day.completed ? '0 0 10px rgba(16,185,129,0.3)' : 'none'
                }}>
                  {day.completed ? <CheckCircle2 size={16} /> : <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{day.dayName.charAt(0)}</span>}
                </div>
                <span style={{ fontSize: '0.65rem', color: isToday ? 'var(--accent-primary)' : 'var(--text-tertiary)', fontWeight: isToday ? 700 : 500 }}>
                  {day.dayName.substring(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Monthly Stats */}
      <h2 className="h3" style={{ marginBottom: '1rem' }}>Resumen Mensual</h2>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel" style={{ padding: '1.5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.75rem', background: 'var(--accent-glow)', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)' }}>
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="small">Entrenamientos Completados (Mes)</p>
            <p className="h2">{stats.completedThisMonth}</p>
          </div>
        </div>
        
        <p className="small" style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center' }}>
          Toda gota de sudor cuenta. ¡Seguí así!
        </p>
      </motion.div>
    </div>
  );
}
