import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Ruler, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import type { Measurement } from '../types';

export default function MeasurementsPage() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    chest: '',
    waist: '',
    arms: '',
    legs: ''
  });

  const fetchMeasurements = async () => {
    try {
      const { data } = await api.get('/measurements');
      setMeasurements(data);
    } catch (error) {
      console.error('Error fetching measurements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { date: formData.date };
      if (formData.weight) payload.weight = parseFloat(formData.weight);
      if (formData.chest) payload.chest = parseFloat(formData.chest);
      if (formData.waist) payload.waist = parseFloat(formData.waist);
      if (formData.arms) payload.arms = parseFloat(formData.arms);
      if (formData.legs) payload.legs = parseFloat(formData.legs);

      await api.post('/measurements', payload);
      setShowForm(false);
      setFormData({ date: new Date().toISOString().split('T')[0], weight: '', chest: '', waist: '', arms: '', legs: '' });
      fetchMeasurements();
    } catch (error) {
      console.error('Error saving measurement:', error);
    }
  };

  const chartData = measurements
    .filter(m => m.weight != null)
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      peso: m.weight
    }));

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem 0 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link to="/profile" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 className="h2" style={{ margin: 0 }}>Medidas Corporales</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel" 
        style={{ padding: '1.5rem', marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ruler size={18} /> Evolución del Peso
          </h2>
          <button 
            className="btn btn-primary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', gap: '0.25rem' }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : <><Plus size={16} /> Agregar</>}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Fecha</label>
                <input type="date" className="form-input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Peso (kg)</label>
                <input type="number" step="0.1" className="form-input" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Cintura (cm)</label>
                <input type="number" step="0.1" className="form-input" value={formData.waist} onChange={e => setFormData({...formData, waist: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Pecho (cm)</label>
                <input type="number" step="0.1" className="form-input" value={formData.chest} onChange={e => setFormData({...formData, chest: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Brazos (cm)</label>
                <input type="number" step="0.1" className="form-input" value={formData.arms} onChange={e => setFormData({...formData, arms: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Piernas (cm)</label>
                <input type="number" step="0.1" className="form-input" value={formData.legs} onChange={e => setFormData({...formData, legs: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Guardar Medidas</button>
          </form>
        )}

        {chartData.length > 0 ? (
          <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--accent-primary)', fontWeight: 600 }}
                  formatter={(value: any) => [`${value} kg`, 'Peso']}
                />
                <Line 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="var(--accent-primary)" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--bg-secondary)', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: 'var(--accent-primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
            No hay datos de peso para graficar. Agregá tu primera medida.
          </div>
        )}
      </motion.div>

      <h2 className="h3" style={{ marginBottom: '1rem' }}>Historial</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {measurements.slice().reverse().map(m => (
          <div key={m.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{new Date(m.date).toLocaleDateString('es-ES')}</div>
              <div className="small" style={{ color: 'var(--text-tertiary)', marginTop: '0.25rem', display: 'flex', gap: '0.75rem' }}>
                {m.chest && <span>Pecho: {m.chest}</span>}
                {m.waist && <span>Cintura: {m.waist}</span>}
              </div>
            </div>
            {m.weight && (
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                {m.weight} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-tertiary)' }}>kg</span>
              </div>
            )}
          </div>
        ))}
        {measurements.length === 0 && (
          <p className="small" style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>Aún no hay registros de medidas.</p>
        )}
      </div>
    </div>
  );
}
