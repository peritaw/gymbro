import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import ClientDashboard from './ClientDashboard';
import TrainerDashboard from './TrainerDashboard';
import CompanyDashboard from './CompanyDashboard';

export default function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (user?.role === UserRole.COMPANY) {
    return <CompanyDashboard />;
  }

  if (user?.role === UserRole.TRAINER) {
    return <TrainerDashboard />;
  }

  return <ClientDashboard />;
}
