import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Users, UserPlus, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/client';
import type { User } from '../types';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState<User[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [trainerEmail, setTrainerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchData = async () => {
    try {
      const [trainersRes, clientsRes] = await Promise.all([
        api.get('/auth/my-trainers'),
        api.get('/auth/my-clients')
      ]);
      setTrainers(trainersRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssociateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      await api.post('/auth/associate-trainer', { email: trainerEmail });
      setMessage({ text: 'Entrenador asociado con éxito', type: 'success' });
      setTrainerEmail('');
      fetchData();
    } catch (error: any) {
      setMessage({ 
        text: error.response?.data?.message || 'Error al asociar entrenador', 
        type: 'error' 
      });
    }
  };

  const handleAssignClient = async () => {
    if (!selectedClient || !selectedTrainerId) return;
    
    setMessage({ text: '', type: '' });
    try {
      await api.post('/auth/assign-client', { 
        clientId: selectedClient.id, 
        trainerId: parseInt(selectedTrainerId) 
      });
      setMessage({ text: 'Cliente asignado con éxito', type: 'success' });
      setSelectedClient(null);
      setSelectedTrainerId('');
      fetchData();
    } catch (error: any) {
      setMessage({ 
        text: error.response?.data?.message || 'Error al asignar alumno', 
        type: 'error' 
      });
    }
  };

  if (isLoading) return <div className="loading-spinner" />;

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <p className="small">Panel de Empresa</p>
        <h1 className="h2">{user?.name}</h1>
      </header>

      {message.text && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.5rem',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
            display: 'flex', gap: '0.5rem', alignItems: 'center'
          }}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </motion.div>
      )}

      {/* Associate Trainer Form */}
      <section className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 className="h3" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={20} /> Asociar Entrenador
        </h2>
        <form onSubmit={handleAssociateTrainer} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="email" 
            className="form-input" 
            placeholder="email@entrenador.com" 
            value={trainerEmail}
            onChange={(e) => setTrainerEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">Asociar</button>
        </form>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Trainers List */}
        <section className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 className="h3" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={20} /> Mis Entrenadores ({trainers.length})
          </h2>
          {trainers.length === 0 ? (
            <p className="small" style={{ color: 'var(--text-tertiary)' }}>No hay entrenadores asociados.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {trainers.map(t => (
                <div key={t.id} style={{ 
                  padding: '0.75rem', 
                  background: 'var(--bg-tertiary)', 
                  borderRadius: 'var(--radius-md)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  border: t.pendingCompanyId ? '1px dashed var(--accent-primary)' : '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{t.name}</p>
                    <p className="small" style={{ color: 'var(--text-tertiary)' }}>{t.email}</p>
                  </div>
                  {t.pendingCompanyId && (
                    <span className="small" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Invitación Pendiente</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Clients List */}
        <section className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 className="h3" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} /> Mis Alumnos ({clients.length})
          </h2>
          {clients.length === 0 ? (
            <p className="small" style={{ color: 'var(--text-tertiary)' }}>No hay alumnos registrados.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {clients.map(c => (
                <div key={c.id} style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{c.name}</p>
                    <p className="small" style={{ color: 'var(--text-tertiary)' }}>{c.email}</p>
                  </div>
                  {c.trainerId ? (
                    <div className="small" style={{ color: 'var(--success)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span>Asignado</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                        {trainers.find(t => t.id === c.trainerId)?.name || 'Entrenador'}
                      </span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setSelectedClient(c)}
                      className="btn btn-secondary" 
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                      Asignar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Assignment Modal (Simplified) */}
      {selectedClient && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1000 
        }}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '400px', width: '100%', border: '1px solid var(--accent-primary)' }}>
            <h2 className="h3" style={{ marginBottom: '1rem' }}>Asignar Alumno</h2>
            <p className="p" style={{ marginBottom: '1.5rem' }}>Elegí un entrenador para <strong>{selectedClient.name}</strong>:</p>
            
            <select 
              className="form-input" 
              value={selectedTrainerId} 
              onChange={(e) => setSelectedTrainerId(e.target.value)}
              style={{ marginBottom: '1.5rem' }}
            >
              <option value="">Seleccionar Entrenador...</option>
              {trainers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn glass-panel" style={{ flex: 1 }} onClick={() => setSelectedClient(null)}>Cancelar</button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }} 
                disabled={!selectedTrainerId}
                onClick={handleAssignClient}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
