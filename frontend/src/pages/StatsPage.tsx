import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Activity, CheckCircle2, TrendingUp, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Stats, Routine } from '../types';
import api from '../api/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistLoading, setIsHistLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, routinesRes] = await Promise.all([
          api.get('/training-logs/stats'),
          api.get('/routines')
        ]);
        setStats(statsRes.data);
        setRoutines(routinesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchExerciseHistory = async (exId: number) => {
    setIsHistLoading(true);
    try {
      const { data } = await api.get(`/training-logs/history/${exId}`);
      // Process data for chart: find max weight per date
      const chartData = data.map((log: any) => {
        const maxWeight = Math.max(...log.exerciseLogs.map((el: any) => el.weight), 0);
        return {
          date: new Date(log.date).toLocaleDateString('es', { day: '2-digit', month: '2-digit' }),
          weight: maxWeight,
          fullDate: log.date
        };
      }).sort((a: any, b: any) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
      
      setHistory(chartData);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsHistLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExerciseId) {
      fetchExerciseHistory(selectedExerciseId);
    }
  }, [selectedExerciseId]);

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

      {/* Exercise Progress Section */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <TrendingUp size={24} color="var(--accent-primary)" />
        <h2 className="h3">Evolución de Fuerza</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel" 
        style={{ padding: '1.5rem', marginBottom: '4rem' }}
      >
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={16} /> Seleccioná un ejercicio para ver tu progreso
          </label>
          <select 
            className="form-input" 
            style={{ appearance: 'auto', paddingRight: '2rem' }}
            value={selectedExerciseId || ''}
            onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
          >
            <option value="" disabled>Elegir ejercicio...</option>
            {routines.map(routine => (
              <optgroup key={routine.id} label={routine.name}>
                {routine.days.flatMap(day => day.exercises).map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {selectedExerciseId ? (
          <div style={{ height: '250px', width: '100%', marginTop: '1rem' }}>
            {isHistLoading ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-tertiary)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="var(--text-tertiary)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `${val}kg`}
                  />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: '12px' }}
                    itemStyle={{ color: 'var(--accent-primary)', fontWeight: 700 }}
                    cursor={{ stroke: 'var(--accent-primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="var(--accent-primary)" 
                    strokeWidth={3} 
                    dot={{ fill: 'var(--accent-primary)', r: 4, strokeWidth: 0 }} 
                    activeDot={{ r: 6, strokeWidth: 0, fill: 'white' }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                <p className="small">No hay historial para este ejercicio todavía.<br/>¡Empezá a entrenar para ver tus datos!</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0', opacity: 0.5 }}>
            <Activity size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
            <p className="small">Seleccioná un ejercicio de la lista superior para visualizar tus pesos históricos.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
