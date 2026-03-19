import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import type { Stats, Routine } from '../types';
import api from '../api/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ClientTrackingPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, routinesRes] = await Promise.all([
          api.get(`/training-logs/stats/${clientId}`),
          api.get(`/routines`) // This should probably be /routines/client/${clientId} if implementation allows
        ]);
        setStats(statsRes.data);
        setRoutines(routinesRes.data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [clientId]);

  const fetchExerciseHistory = async (exId: number) => {
    try {
      const { data } = await api.get(`/training-logs/history/${clientId}/${exId}`);
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
    }
  };

  useEffect(() => {
    if (selectedExerciseId) {
      fetchExerciseHistory(selectedExerciseId);
    }
  }, [selectedExerciseId]);

  if (isLoading || !stats) return <div className="loading-spinner" />;

  return (
    <div style={{ padding: '1rem 0 2rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="h1">Seguimiento de Alumno</h1>
      </header>

      {/* Basic Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <p className="small" style={{ color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>Racha</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span className="h1">{stats.currentStreak}</span>
            <span className="small">días</span>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <p className="small" style={{ color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>Total Entrenamientos</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span className="h1">{stats.totalWorkouts}</span>
          </div>
        </div>
      </div>

      <section className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 className="h3" style={{ marginBottom: '1rem' }}>Desempeño Semanal</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {stats.weeklyBreakdown.map((day, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '30px', height: '30px', borderRadius: '50%', 
                background: day.completed ? 'var(--success)' : 'var(--bg-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.25rem'
              }}>
                {day.completed && <CheckCircle2 size={16} color="white" />}
              </div>
              <span style={{ fontSize: '0.65rem' }}>{day.dayName}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 className="h3" style={{ marginBottom: '1.5rem' }}>Evolución de Cargas</h3>
        <select 
          className="form-input" 
          style={{ marginBottom: '1.5rem' }}
          value={selectedExerciseId || ''} 
          onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
        >
          <option value="">Elegir ejercicio...</option>
          {routines.flatMap(r => r.days).flatMap(d => d.exercises).map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>

        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={10} />
              <YAxis stroke="var(--text-tertiary)" fontSize={10} tickFormatter={(v) => `${v}kg`} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: 'none' }} />
              <Line type="monotone" dataKey="weight" stroke="var(--accent-primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
