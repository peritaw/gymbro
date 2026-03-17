import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await api.post('/auth/forgot-password', { email });
      setStatus('success');
      setMessage('Te enviamos un email con las instrucciones para recuperar tu contraseña.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Ocurrió un error. Por favor, intentá nuevamente.');
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
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Volver al login
        </Link>

        <div style={{ marginBottom: '2rem' }}>
          <h1 className="h2" style={{ marginBottom: '0.5rem' }}>Recuperar Contraseña</h1>
          <p className="p">Ingresá tu email y te enviaremos un link para resetearla.</p>
        </div>

        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '1rem 0' }}
          >
            <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--success)', fontWeight: 500 }}>{message}</p>
          </motion.div>
        ) : (
          <>
            {status === 'error' && (
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
                {message}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
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

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Enviando...' : 'Enviar link de recuperación'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
