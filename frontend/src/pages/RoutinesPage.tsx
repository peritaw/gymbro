import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, CheckCircle2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import type { Routine } from '../types';
import { routineTemplates } from '../data/templates';

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mine' | 'templates'>('mine');
  const [isAddingTemplate, setIsAddingTemplate] = useState<number | null>(null);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const response = await api.get('/routines');
      setRoutines(response.data);
    } catch (error) {
      console.error('Error fetching routines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await api.patch(`/routines/${id}/activate`);
      fetchRoutines(); // Refresh to update active status
    } catch (error) {
      console.error('Error activating routine:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que querés eliminar esta rutina?')) {
      try {
        await api.delete(`/routines/${id}`);
        setRoutines(routines.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting routine:', error);
      }
    }
  };

  const handleAddTemplate = async (template: any, idx: number) => {
    setIsAddingTemplate(idx);
    try {
      await api.post('/routines', template);
      await fetchRoutines();
      setActiveTab('mine');
    } catch (error) {
      console.error('Error adding template:', error);
    } finally {
      setIsAddingTemplate(null);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '30px', height: '30px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem 0 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="h1">Tus Rutinas</h1>
        <Link to="/routines/new" style={{ textDecoration: 'none' }}>
          <button className="btn btn-primary btn-icon" style={{ width: '40px', height: '40px', padding: 0 }}>
            <Plus size={24} />
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-full)' }}>
        <button 
          onClick={() => setActiveTab('mine')}
          style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-full)', background: activeTab === 'mine' ? 'var(--bg-secondary)' : 'transparent', color: activeTab === 'mine' ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeTab === 'mine' ? 'var(--shadow-sm)' : 'none' }}
        >
          Mis Rutinas
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-full)', background: activeTab === 'templates' ? 'var(--bg-secondary)' : 'transparent', color: activeTab === 'templates' ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeTab === 'templates' ? 'var(--shadow-sm)' : 'none' }}
        >
          Plantillas
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activeTab === 'mine' ? (
          <>
        {routines.map((routine, idx) => (
          <motion.div
            key={routine.id}
            className="glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{ 
              padding: '1.25rem',
              border: routine.isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {routine.isActive && (
              <div style={{ 
                position: 'absolute', top: 0, right: 0, 
                background: 'var(--accent-primary)', color: 'white',
                padding: '0.25rem 0.75rem',
                borderBottomLeftRadius: 'var(--radius-md)',
                fontSize: '0.75rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '0.25rem'
              }}>
                <CheckCircle2 size={12} /> ACTIVA
              </div>
            )}

            <Link to={`/routines/${routine.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{ marginRight: '3rem' }}>
                <h3 className="h3" style={{ marginBottom: '0.25rem' }}>{routine.name}</h3>
                <p className="p" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {routine.days?.length || 0} día{(routine.days?.length || 0) !== 1 ? 's' : ''} de entrenamiento
                  {routine.description ? ` • ${routine.description}` : ''}
                </p>
              </div>
            </Link>

            <div style={{ 
              position: 'absolute', top: '1.25rem', right: '1rem',
              display: 'flex', gap: '0.5rem'
            }}>
              <div className="dropdown" style={{ position: 'relative' }}>
                <button 
                  className="btn-icon" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const dropdown = e.currentTarget.nextElementSibling;
                    if (dropdown) dropdown.classList.toggle('show');
                  }}
                >
                  <MoreVertical size={20} />
                </button>
                <div className="dropdown-menu" style={{
                  position: 'absolute', right: 0, top: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem',
                  display: 'none',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  minWidth: '150px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 10
                }}>
                  {!routine.isActive && (
                    <button 
                      onClick={() => handleActivate(routine.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '0.5rem', textAlign: 'left', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                    >
                      Marcar Activa
                    </button>
                  )}
                  <Link to={`/routines/${routine.id}/edit`} style={{ textDecoration: 'none', color: 'var(--text-primary)', padding: '0.5rem', display: 'block', borderRadius: 'var(--radius-sm)' }}>
                    Editar
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(routine.id);
                      e.currentTarget.closest('.dropdown-menu')?.classList.remove('show');
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--danger)', padding: '0.5rem', textAlign: 'left', cursor: 'pointer', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
                <style>{`.dropdown-menu.show { display: flex !important; }`}</style>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {routine.days?.map((day) => (
                <div key={day.id} style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: 'var(--radius-sm)', 
                  background: 'var(--bg-tertiary)',
                  fontSize: '0.75rem', fontWeight: 600,
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap'
                }}>
                  D{day.dayNumber}: {day.name}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {routines.length === 0 && (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderStyle: 'dashed' }}>
             <p className="p" style={{ marginBottom: '1rem' }}>Todavía no creaste ninguna rutina.</p>
             <Link to="/routines/new" style={{ textDecoration: 'none' }}>
                <button className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
                  <Plus size={18} /> Crear Primera Rutina
                </button>
             </Link>
          </div>
        )}
        </>
        ) : (
          <>
            {routineTemplates.map((template, idx) => (
              <motion.div
                key={idx}
                className="glass-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ padding: '1.25rem' }}
              >
                <h3 className="h3" style={{ marginBottom: '0.25rem', color: 'var(--accent-primary)' }}>{template.name}</h3>
                <p className="p" style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  {template.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {template.days.map((day, dIdx) => (
                    <div key={dIdx} style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 'var(--radius-sm)', 
                      background: 'var(--bg-tertiary)',
                      fontSize: '0.75rem', fontWeight: 600,
                      color: 'var(--text-tertiary)'
                    }}>
                      D{day.dayNumber}: {day.name}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleAddTemplate(template, idx)}
                  disabled={isAddingTemplate === idx}
                  className="btn btn-secondary"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Plus size={18} />
                  {isAddingTemplate === idx ? 'Añadiendo...' : 'Añadir a mis rutinas'}
                </button>
              </motion.div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
