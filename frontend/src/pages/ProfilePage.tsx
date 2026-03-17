import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, LogOut, Save, Target, Ruler } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [weeklyGoal, setWeeklyGoal] = useState(user?.weeklyGoal || 3);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setWeeklyGoal(user.weeklyGoal || 3);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      await updateProfile({ name, weeklyGoal });
      setMessage({ text: 'Perfil actualizado correctamente', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Error al actualizar el perfil', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '1rem 0 2rem' }}>
      <h1 className="h1" style={{ marginBottom: '1.5rem' }}>Perfil</h1>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel" 
        style={{ padding: '1.5rem', marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            <User size={32} />
          </div>
          <div>
            <h2 className="h3">{user?.name}</h2>
            <p className="small" style={{ color: 'var(--text-tertiary)' }}>{user?.email}</p>
          </div>
        </div>

        {message.text && (
          <div style={{ 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
            border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input 
              type="text" 
              className="form-input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={16} /> 
              Objetivo Semanal (días)
            </label>
            <input 
              type="number" 
              className="form-input" 
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(parseInt(e.target.value) || 1)}
              min="1"
              max="7"
              required
            />
            <p className="small" style={{ color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              Define tu meta de entrenamientos por semana para calcular tu porcentaje de adherencia.
            </p>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSaving}
            style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
          >
            <Save size={20} />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: '2rem' }}
      >
        <Link to="/measurements" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)' }}>
                <Ruler size={20} />
              </div>
              <span style={{ fontWeight: 600 }}>Cargar Medidas Corporales</span>
            </div>
            <span style={{ color: 'var(--text-tertiary)' }}>&rarr;</span>
          </div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button 
          onClick={handleLogout}
          className="glass-panel" 
          style={{ 
            width: '100%', 
            padding: '1rem', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--danger)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            background: 'rgba(239, 68, 68, 0.05)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </motion.div>
    </div>
  );
}
