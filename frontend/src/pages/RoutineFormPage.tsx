import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Save, Trash2, GripVertical, ChevronRight, X } from 'lucide-react';
import api from '../api/client';
import type { Routine, RoutineDay, Exercise } from '../types';

export default function RoutineFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id && id !== 'new';

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<Omit<RoutineDay, 'id'>[]>(
    isEditing ? [] : [{ dayNumber: 1, name: 'Día 1', muscleGroup: '', exercises: [] }]
  );

  // UI State
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseLibrary, setExerciseLibrary] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Partial<Exercise>>({
    name: '', sets: 3, reps: 10, weight: 0, notes: ''
  });
  const [editingExerciseIdx, setEditingExerciseIdx] = useState<number | null>(null);

  useEffect(() => {
    if (isEditing) {
      fetchRoutine();
    }
    fetchExerciseLibrary();
  }, [id]);

  const fetchExerciseLibrary = async () => {
    try {
      const { data } = await api.get('/exercises/library');
      setExerciseLibrary(data);
    } catch (error) {
      console.error('Error fetching exercise library:', error);
    }
  };

  const fetchRoutine = async () => {
    try {
      const { data } = await api.get(`/routines/${id}`);
      setName(data.name);
      setDescription(data.description || '');
      setDays(data.days);
    } catch (error) {
      console.error(error);
      navigate('/routines');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDay = () => {
    const newDayNumber = days.length + 1;
    setDays([...days, { dayNumber: newDayNumber, name: `Día ${newDayNumber}`, muscleGroup: '', exercises: [] }]);
    setActiveDayIdx(days.length);
  };

  const handleRemoveDay = (idx: number) => {
    if (days.length <= 1) return;
    const newDays = days.filter((_, i) => i !== idx).map((day, i) => ({ ...day, dayNumber: i + 1 }));
    setDays(newDays);
    setActiveDayIdx(Math.min(activeDayIdx, newDays.length - 1));
  };

  const handleUpdateDay = (idx: number, field: keyof RoutineDay, value: string) => {
    const newDays = [...days];
    newDays[idx] = { ...newDays[idx], [field]: value };
    setDays(newDays);
  };

  const openExerciseModal = (exerciseIdx: number | null = null) => {
    if (exerciseIdx !== null) {
      setCurrentExercise(days[activeDayIdx].exercises[exerciseIdx]);
      setEditingExerciseIdx(exerciseIdx);
    } else {
      setCurrentExercise({ name: '', sets: 3, reps: 10, weight: 0, notes: '' });
      setEditingExerciseIdx(null);
    }
    setShowExerciseModal(true);
  };

  const saveExercise = () => {
    if (!currentExercise.name) return;
    
    const newDays = [...days];
    const newExercise = currentExercise as Exercise;
    
    if (editingExerciseIdx !== null) {
      newDays[activeDayIdx].exercises[editingExerciseIdx] = newExercise;
    } else {
      newExercise.order = newDays[activeDayIdx].exercises.length;
      newDays[activeDayIdx].exercises.push(newExercise);
    }
    
    setDays(newDays);
    setShowExerciseModal(false);
  };

  const handleRemoveExercise = (idx: number) => {
    const newDays = [...days];
    newDays[activeDayIdx].exercises.splice(idx, 1);
    // Reorder
    newDays[activeDayIdx].exercises = newDays[activeDayIdx].exercises.map((ex, i) => ({ ...ex, order: i }));
    setDays(newDays);
  };

  const handleSaveRoutine = async () => {
    if (!name.trim() || days.length === 0) return;
    
    setIsSaving(true);
    try {
      const payload = { name, description, days };
      if (isEditing) {
        await api.patch(`/routines/${id}`, payload);
      } else {
        await api.post('/routines', payload);
      }
      navigate('/routines');
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div style={{ padding: '1rem 0 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn-icon" onClick={() => navigate('/routines')} style={{ padding: 0 }}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="h2" style={{ flex: 1 }}>{isEditing ? 'Editar Rutina' : 'Nueva Rutina'}</h1>
        <button 
          className="btn btn-primary" 
          onClick={handleSaveRoutine}
          disabled={isSaving || !name.trim()}
          style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem' }}
        >
          <Save size={18} /> Guardar
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">Nombre de la rutina</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Ej: Push Pull Legs"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Descripción (Opcional)</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Ej: Foco en hipertrofia"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Days Tabs */}
      <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {days.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDayIdx(idx)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                background: activeDayIdx === idx ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: activeDayIdx === idx ? 'white' : 'var(--text-secondary)',
                border: 'none',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {day.name}
            </button>
          ))}
          <button
            onClick={handleAddDay}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-full)',
              background: 'transparent',
              border: '1px dashed var(--text-tertiary)',
              color: 'var(--text-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Active Day Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDayIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="glass-panel"
          style={{ padding: '1.5rem', minHeight: '300px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <input 
                type="text" 
                className="form-input" 
                value={days[activeDayIdx].name}
                onChange={(e) => handleUpdateDay(activeDayIdx, 'name', e.target.value)}
                style={{ background: 'transparent', borderBottom: '1px solid var(--border-subtle)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, fontSize: '1.25rem', fontWeight: 600, padding: '0.25rem 0' }}
              />
            </div>
            {days.length > 1 && (
              <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleRemoveDay(activeDayIdx)}>
                <Trash2 size={20} />
              </button>
            )}
          </div>

          {/* Exercises List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {days[activeDayIdx].exercises.map((ex, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-secondary)' }}>
                <GripVertical size={20} color="var(--text-tertiary)" />
                <div style={{ flex: 1 }} onClick={() => openExerciseModal(idx)}>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>{ex.name}</p>
                  <p className="small">{ex.sets} series x {ex.reps} reps {ex.weight ? `@ ${ex.weight}kg` : ''}</p>
                </div>
                <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleRemoveExercise(idx); }} style={{ color: 'var(--danger)' }}>
                  <X size={18} />
                </button>
              </div>
            ))}

            {days[activeDayIdx].exercises.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <p className="p" style={{ marginBottom: '1rem' }}>No hay ejercicios en este día</p>
                <button className="btn btn-secondary" onClick={() => openExerciseModal()} style={{ display: 'inline-flex', gap: '0.5rem' }}>
                  <Plus size={18} /> Agregar Ejercicio
                </button>
              </div>
            )}
          </div>

          {days[activeDayIdx].exercises.length > 0 && (
            <button className="btn btn-secondary" onClick={() => openExerciseModal()} style={{ width: '100%', display: 'flex', gap: '0.5rem' }}>
              <Plus size={20} /> Añadir Ejercicio
            </button>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Exercise Modal */}
      {showExerciseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            style={{ 
              background: 'var(--bg-secondary)', width: '100%', maxWidth: '480px', 
              borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)',
              padding: '1.5rem', paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="h3">{editingExerciseIdx !== null ? 'Editar Ejercicio' : 'Añadir Ejercicio'}</h3>
              <button className="btn-icon" onClick={() => setShowExerciseModal(false)}><X size={24} /></button>
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Nombre del ejercicio</label>
              <input 
                type="text" 
                className="form-input" 
                value={currentExercise.name} 
                onChange={(e) => {
                  setCurrentExercise({...currentExercise, name: e.target.value});
                  setShowSuggestions(true);
                }} 
                onFocus={() => setShowSuggestions(true)}
                placeholder="Ej: Press de Banca" 
                autoFocus 
              />
              
              {showSuggestions && currentExercise.name && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)', marginTop: '0.25rem',
                  maxHeight: '150px', overflowY: 'auto', zIndex: 110,
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  {exerciseLibrary
                    .filter(ex => ex.name.toLowerCase().includes(currentExercise.name!.toLowerCase()) && ex.name.toLowerCase() !== currentExercise.name!.toLowerCase())
                    .slice(0, 5)
                    .map(ex => (
                      <div 
                        key={ex.id}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)' }}
                        onClick={() => {
                          setCurrentExercise({...currentExercise, name: ex.name});
                          setShowSuggestions(false);
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>{ex.name}</div>
                        <div className="small" style={{ color: 'var(--text-tertiary)' }}>{ex.muscleGroup} • {ex.equipment || 'Ninguno'}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Series</label>
                <input type="number" className="form-input" value={currentExercise.sets} onChange={(e) => setCurrentExercise({...currentExercise, sets: parseInt(e.target.value) || 0})} min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Repeticiones</label>
                <input type="number" className="form-input" value={currentExercise.reps} onChange={(e) => setCurrentExercise({...currentExercise, reps: parseInt(e.target.value) || 0})} min="1" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Peso estimativo (kg) Opcional</label>
              <input type="number" className="form-input" value={currentExercise.weight || ''} onChange={(e) => setCurrentExercise({...currentExercise, weight: parseFloat(e.target.value) || 0})} min="0" step="0.5" />
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={saveExercise} disabled={!currentExercise.name}>
              {editingExerciseIdx !== null ? 'Guardar Cambios' : 'Añadir a la rutina'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
