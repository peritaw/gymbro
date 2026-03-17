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
  const [weight, setWeight] = useState(user?.weight || '');
  const [height, setHeight] = useState(user?.height || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setWeeklyGoal(user.weeklyGoal || 3);
      setWeight(user.weight || '');
      setHeight(user.height || '');
    }
  }, [user]);

  const bmi = height && weight ? Number(weight) / Math.pow(Number(height) / 100, 2) : null;

  const getBMICategory = (val: number) => {
    if (val < 18.5) return { label: 'Bajo peso', color: '#3b82f6', pos: '15%' }; // Blue
    if (val < 25) return { label: 'Normal', color: '#10b981', pos: '40%' };   // Green
    if (val < 30) return { label: 'Sobrepeso', color: '#f59e0b', pos: '65%' }; // Orange
    return { label: 'Obesidad', color: '#ef4444', pos: '85%' };             // Red
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      await updateProfile({ 
        name, 
        weeklyGoal, 
        weight: weight ? Number(weight) : undefined, 
        height: height ? Number(height) : undefined 
      });
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
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Peso (kg)</label>
              <input 
                type="number" 
                step="0.1"
                className="form-input" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="75.5"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Altura (cm)</label>
              <input 
                type="number" 
                className="form-input" 
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
              />
            </div>
          </div>

          {bmi && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <span className="small" style={{ color: 'var(--text-tertiary)' }}>Tu IMC</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.25rem', color: getBMICategory(bmi).color }}>
                    {bmi.toFixed(1)}
                  </div>
                  <div className="small" style={{ fontWeight: 600, color: getBMICategory(bmi).color }}>
                    {getBMICategory(bmi).label.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div style={{ position: 'relative', height: '8px', width: '100%', background: 'linear-gradient(to right, #3b82f6 0%, #3b82f6 18.5%, #10b981 18.5%, #10b981 25%, #f59e0b 25%, #f59e0b 30%, #ef4444 30%, #ef4444 100%)', borderRadius: '4px', overflow: 'visible', marginTop: '1rem' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: `${Math.min(100, Math.max(0, (bmi - 10) / 30 * 100))}%`, 
                  top: '-8px',
                  width: '2px', 
                  height: '24px', 
                  background: 'white',
                  boxShadow: '0 0 10px rgba(255,255,255,0.8)',
                  zIndex: 2,
                  transition: 'left 0.5s ease-out'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                <span>10</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>
          )}

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
