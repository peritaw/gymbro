import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Check, CheckCircle2, ChevronLeft, Flag } from 'lucide-react';
import api from '../api/client';
import type { Routine, RoutineDay, ExerciseLog } from '../types';
import RestTimer from '../components/workout/RestTimer';

export default function WorkoutPage() {
  const { id, dayId } = useParams();
  const navigate = useNavigate();
  
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [day, setDay] = useState<RoutineDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Tracking state: arrays of booleans matching sets for each exercise
  const [completedSets, setCompletedSets] = useState<{ [exerciseId: number]: boolean[] }>({});
  const [setPerformance, setSetPerformance] = useState<{ 
    [exerciseId: number]: { weight: string, reps: string }[] 
  }>({});
  const [showTimer, setShowTimer] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const initWorkout = async () => {
      try {
        const { data } = await api.get(`/routines/${id}`);
        setRoutine(data);
        
        // Find which day to do.
        // For simplicity now, we prompt the user or default to Day 1.
        // A smarter app would track the *last* day completed and suggest the *next* day.
        if (data.days && data.days.length > 0) {
          const selectedDay = dayId 
            ? data.days.find((d: any) => d.id === Number(dayId)) || data.days[0]
            : data.days[0];
          setDay(selectedDay);
          
          // Init trackers
          const completeness: { [ex: number]: boolean[] } = {};
          const performance: { [ex: number]: { weight: string, reps: string }[] } = {};
          
          selectedDay.exercises.forEach((ex: any) => {
             completeness[ex.id] = Array(ex.sets).fill(false);
             performance[ex.id] = Array(ex.sets).fill({ 
               weight: ex.weight?.toString() || '', 
               reps: ex.reps?.toString() || '' 
             });
          });
          
          setCompletedSets(completeness);
          setSetPerformance(performance);
        } else {
          navigate('/routines');
        }
      } catch (error) {
        console.error(error);
        navigate('/routines');
      } finally {
        setIsLoading(false);
      }
    };
    initWorkout();
  }, [id, dayId, navigate]);

  const toggleSet = (exerciseId: number, setIdx: number) => {
    const newSets = { ...completedSets };
    const wasCompleted = newSets[exerciseId][setIdx];
    
    newSets[exerciseId][setIdx] = !wasCompleted;
    setCompletedSets(newSets);
    
    // Automatically trigger timer if a set was JUST completed (not un-completed)
    // and it's not the absolutely last set of the workout
    if (!wasCompleted) {
      setShowTimer(true);
    }
  };

  const updatePerfValue = (exerciseId: number, setIdx: number, field: 'weight' | 'reps', value: string) => {
    const newPerf = { ...setPerformance };
    const exPerf = [...newPerf[exerciseId]];
    exPerf[setIdx] = { ...exPerf[setIdx], [field]: value };
    newPerf[exerciseId] = exPerf;
    setSetPerformance(newPerf);
  };

  const getProgressPercentage = () => {
    if (!day) return 0;
    let total = 0;
    let completed = 0;
    
    Object.values(completedSets).forEach(sets => {
      total += sets.length;
      completed += sets.filter(s => s).length;
    });
    
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const handleFinishWorkout = async () => {
    if (!routine || !day) return;
    
    const isFullyCompleted = getProgressPercentage() === 100;
    if (!isFullyCompleted && !window.confirm('No completaste todos los ejercicios. ¿Seguro querés finalizar?')) {
      return;
    }

    setIsFinishing(true);
    try {
      const durationMinutes = Math.round((Date.now() - startTime) / 60000);
      
      const exerciseLogs: ExerciseLog[] = [];
      for (const exIdStr in setPerformance) {
        const exId = Number(exIdStr);
        const setsResult = setPerformance[exId];
        const completed = completedSets[exId];
        setsResult.forEach((set, idx) => {
          if (completed[idx]) {
            exerciseLogs.push({
              exerciseId: exId,
              setNumber: idx + 1,
              weight: Number(set.weight) || 0,
              reps: Number(set.reps) || 0,
            });
          }
        });
      }

      await api.post('/training-logs', {
        routineId: routine.id,
        routineDayId: day.id,
        date: new Date().toISOString().split('T')[0],
        completed: true,
        durationMinutes,
        exerciseLogs
      });
      
      // Navigate to stats or home with success message
      navigate('/', { state: { workoutCompleted: true } });
    } catch (error) {
      console.error('Error logging workout', error);
      setIsFinishing(false);
    }
  };

  if (isLoading || !routine || !day) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Dumbbell size={40} color="var(--accent-primary)" style={{ animation: 'bounce 1s infinite alternate' }} />
        <h2 className="h2 animate-pulse">Preparando Entrenamiento...</h2>
      </div>
    );
  }

  const progress = getProgressPercentage();

  return (
    <div style={{ paddingBottom: '10rem' }}> {/* Extra padding for timer and finish button */}
      
      {/* Sticky Header with Progress */}
      <div style={{ 
        position: 'sticky', top: 0, zIndex: 10, 
        background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)',
        padding: '1rem', margin: '0 -1rem', marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn-icon" onClick={() => navigate(-1)} style={{ padding: 0 }}>
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="h3" style={{ lineHeight: 1 }}>{routine.name}</h1>
              <span className="small">{day.name}</span>
            </div>
          </div>
          <span className="h3" style={{ color: 'var(--accent-primary)' }}>{progress}%</span>
        </div>
        
        <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div 
            style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Exercises List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {day.exercises.map((ex, exIdx) => {
          const sets = completedSets[ex.id || 0] || [];
          const isExDone = sets.length > 0 && sets.every(s => s);
          
          return (
            <motion.div 
              key={ex.id}
              className="glass-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: exIdx * 0.1 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ 
                padding: '1rem', 
                background: isExDone ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                borderBottom: '1px solid var(--border-subtle)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {exIdx + 1}. {ex.name}
                    {isExDone && <CheckCircle2 size={18} color="var(--success)" />}
                  </h3>
                  {ex.weight && (
                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{ex.weight} kg</span>
                  )}
                </div>
                {ex.notes && <p className="small" style={{ marginTop: '0.25rem' }}>💡 {ex.notes}</p>}
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <span className="small"><strong>{ex.sets}</strong> series</span>
                  <span className="small"><strong>{ex.reps}</strong> reps</span>
                </div>
              </div>

              {/* Detailed Sets Tracking */}
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px', gap: '1rem', alignItems: 'center', padding: '0 0.5rem' }}>
                  <span className="small " style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.625rem', fontWeight: 700 }}>SERIE</span>
                  <span className="small" style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.625rem', fontWeight: 700 }}>KG</span>
                  <span className="small" style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.625rem', fontWeight: 700 }}>REPS</span>
                  <span className="small"></span>
                </div>
                {sets.map((isCompleted, setIdx) => (
                  <div key={setIdx} style={{ 
                    display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px', gap: '1rem', alignItems: 'center',
                    padding: '0.5rem', borderRadius: 'var(--radius-sm)',
                    background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ textAlign: 'center', fontWeight: 700, opacity: isCompleted ? 1 : 0.5 }}>{setIdx + 1}</div>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ padding: '0.4rem', textAlign: 'center', fontSize: '0.875rem', height: '36px' }}
                      value={setPerformance[ex.id || 0]?.[setIdx]?.weight || ''}
                      onChange={(e) => updatePerfValue(ex.id || 0, setIdx, 'weight', e.target.value)}
                      placeholder={ex.weight?.toString() || "0"}
                    />
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ padding: '0.4rem', textAlign: 'center', fontSize: '0.875rem', height: '36px' }}
                      value={setPerformance[ex.id || 0]?.[setIdx]?.reps || ''}
                      onChange={(e) => updatePerfValue(ex.id || 0, setIdx, 'reps', e.target.value)}
                      placeholder={ex.reps?.toString() || "0"}
                    />
                    <button
                      onClick={() => toggleSet(ex.id || 0, setIdx)}
                      style={{
                        width: '32px', height: '32px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 'var(--radius-full)',
                        background: isCompleted ? 'var(--success)' : 'var(--bg-tertiary)',
                        color: isCompleted ? 'white' : 'var(--text-tertiary)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isCompleted ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'
                      }}
                    >
                      {isCompleted ? <Check size={18} /> : <div style={{ width: '12px', height: '12px', borderRadius: '2px', border: '2px solid currentColor' }} />}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Finish Workout Button */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, 
        padding: '1rem', background: 'linear-gradient(transparent, var(--bg-primary) 30%)',
        zIndex: 50, display: 'flex', justifyContent: 'center' 
      }}>
        <div className="container" style={{ padding: 0 }}>
          <button 
            className="btn btn-primary" 
            onClick={handleFinishWorkout}
            disabled={isFinishing}
            style={{ 
              width: '100%', padding: '1.25rem', fontSize: '1.125rem', 
              display: 'flex', gap: '0.75rem', justifyContent: 'center',
              boxShadow: progress === 100 ? 'var(--shadow-glow)' : 'var(--shadow-md)',
              background: progress === 100 ? 'var(--success)' : undefined
            }}
          >
            <Flag size={24} fill={progress === 100 ? "currentColor" : "none"} />
            {isFinishing ? 'GUARDANDO...' : 'FINALIZAR ENTRENAMIENTO'}
          </button>
        </div>
      </div>

      <RestTimer isVisible={showTimer} onClose={() => setShowTimer(false)} />
    </div>
  );
}
