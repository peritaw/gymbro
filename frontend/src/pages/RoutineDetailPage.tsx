import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Clock, Dumbbell, CalendarDays } from 'lucide-react';
import api from '../api/client';
import type { Routine } from '../types';

export default function RoutineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const { data } = await api.get(`/routines/${id}`);
        setRoutine(data);
      } catch (error) {
        console.error(error);
        navigate('/routines');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutine();
  }, [id, navigate]);

  if (isLoading || !routine) {
    return (
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '30px', height: '30px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem 0 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn-icon" onClick={() => navigate('/routines')} style={{ padding: 0 }}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="h2" style={{ flex: 1, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{routine.name}</h1>
        <Link to={`/routines/${routine.id}/edit`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
          Editar
        </Link>
      </div>

      {routine.description && (
        <p className="p" style={{ marginBottom: '1.5rem' }}>{routine.description}</p>
      )}

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarDays size={20} color="var(--accent-primary)" />
          <span className="small">Días</span>
          <span className="h3">{routine.days.length}</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <Dumbbell size={20} color="var(--accent-primary)" />
          <span className="small">Ejercicios</span>
          <span className="h3">{routine.days.reduce((acc, day) => acc + day.exercises.length, 0)}</span>
        </div>
      </div>

      {/* Start Workout Button */}
      <Link to={`/workout/${routine.id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>
        <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Play size={24} fill="currentColor" /> COMENZAR RUTINA
        </button>
      </Link>

      <h2 className="h3" style={{ marginBottom: '1rem' }}>Plan de Entrenamiento</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {routine.days.map((day, idx) => (
          <motion.div 
            key={day.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel" 
            style={{ padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 className="h3">Día {day.dayNumber}: {day.name}</h3>
              <span className="small" style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                {day.exercises.length} ejercicios
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {day.exercises.map((ex, exIdx) => (
                <div key={ex.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '24px', height: '24px', 
                    borderRadius: '50%', background: 'var(--bg-tertiary)', 
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)',
                    flexShrink: 0, marginTop: '2px'
                  }}>
                    {exIdx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600 }}>{ex.name}</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                      <span>{ex.sets} series</span>
                      <span>•</span>
                      <span>{ex.reps} reps</span>
                      {ex.weight > 0 && (
                        <>
                          <span>•</span>
                          <span>{ex.weight} kg</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {day.exercises.length === 0 && (
                <p className="small" style={{ fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>Descanso</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
