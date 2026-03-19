import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, AlertCircle, Briefcase, GraduationCap, Users } from 'lucide-react';
import { UserRole } from '../types';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, email, password, role });
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Error al registrarse. El email podría estar en uso.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-layout" style={{ justifyContent: 'center', padding: '1rem' }}>
      <motion.div 
        className="container glass-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ padding: '2rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="h2" style={{ marginBottom: '0.5rem' }}>Crear Cuenta</h1>
          <p className="p">Unite a Gym Bro y empezá a trackear</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid var(--danger)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Tu nombre (e.g. Chris)"
                style={{ paddingLeft: '2.5rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
              <input 
                type="email" 
                className="form-input" 
                placeholder="tu@email.com"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Rol</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setRole(UserRole.CLIENT)}
                className={`btn ${role === UserRole.CLIENT ? 'btn-primary' : 'glass-panel'}`}
                style={{ 
                  flexDirection: 'column', 
                  gap: '0.25rem', 
                  padding: '1rem 0',
                  fontSize: '0.75rem',
                  border: role === UserRole.CLIENT ? 'none' : '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <Users size={20} />
                Alumno
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.TRAINER)}
                className={`btn ${role === UserRole.TRAINER ? 'btn-primary' : 'glass-panel'}`}
                style={{ 
                  flexDirection: 'column', 
                  gap: '0.25rem', 
                  padding: '1rem 0',
                  fontSize: '0.75rem',
                  border: role === UserRole.TRAINER ? 'none' : '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <GraduationCap size={20} />
                Entrenador
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.COMPANY)}
                className={`btn ${role === UserRole.COMPANY ? 'btn-primary' : 'glass-panel'}`}
                style={{ 
                  flexDirection: 'column', 
                  gap: '0.25rem', 
                  padding: '1rem 0',
                  fontSize: '0.75rem',
                  border: role === UserRole.COMPANY ? 'none' : '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <Briefcase size={20} />
                Empresa
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="Mínimo 6 caracteres"
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
            Iniciá sesión
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
