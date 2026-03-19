import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { Users, ClipboardList, TrendingUp } from 'lucide-react';
import api from '../api/client';
import type { User } from '../types';

export default function TrainerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/auth/my-clients');
        setClients(res.data);
      } catch (error) {
        console.error('Error fetching trainer data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="loading-spinner" />;

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <p className="small">Panel de Entrenador</p>
        <h1 className="h2">Hola, {user?.name.split(' ')[0]}</h1>
      </header>

      {user?.pendingCompanyId && (
        <div className="glass-panel" style={{ 
          padding: '1.5rem', 
          marginBottom: '2rem', 
          border: '1px solid var(--accent-primary)',
          background: 'rgba(var(--accent-rgb), 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 className="h3" style={{ marginBottom: '0.5rem' }}>Invitación de Empresa</h3>
            <p className="p">Una empresa quiere asociarte a su equipo.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn btn-primary" 
              onClick={async () => {
                await api.post('/auth/accept-invitation');
                window.location.reload();
              }}
            >
              Aceptar
            </button>
            <button 
              className="btn glass-panel" 
              onClick={async () => {
                await api.post('/auth/reject-invitation');
                window.location.reload();
              }}
            >
              Rechazar
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Users size={32} style={{ margin: '0 auto 1rem', color: 'var(--accent-primary)' }} />
          <h3 className="h1">{clients.length}</h3>
          <p className="small">Alumnos Activos</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <ClipboardList size={32} style={{ margin: '0 auto 1rem', color: 'var(--accent-primary)' }} />
          <h3 className="h1">0</h3>
          <p className="small">Planes Pendientes</p>
        </div>
      </div>

      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 className="h3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} /> Mis Alumnos
        </h2>
        {clients.length === 0 ? (
          <p className="p" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem 0' }}>
            No tenés alumnos asignados actualmente.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {clients.map(c => (
              <div key={c.id} style={{ 
                padding: '1rem', 
                background: 'var(--bg-tertiary)', 
                borderRadius: 'var(--radius-md)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{c.name}</p>
                  <p className="small" style={{ color: 'var(--text-tertiary)' }}>{c.email}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
                    title="Asignar Plan"
                    onClick={() => {
                      /* Navigate to routine form with client preselected or similar */
                      alert(`Asignar plan a ${c.name}`);
                    }}
                  >
                    <ClipboardList size={18} />
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
                    title="Ver Seguimiento"
                    onClick={() => {
                      navigate(`/tracking/${c.id}`);
                    }}
                  >
                    <TrendingUp size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
