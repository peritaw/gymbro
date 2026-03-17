import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types';
import api from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  updateProfile: (data: { name?: string, weeklyGoal?: number }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token and user in localStorage on mount
    const storedToken = localStorage.getItem('gymbro_token');
    const storedUser = localStorage.getItem('gymbro_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('gymbro_user');
      }
    }
    setIsLoading(false);

    // Listen for unauthorized events from api client
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const handleAuthResponse = (data: AuthResponse) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('gymbro_token', data.token);
    localStorage.setItem('gymbro_user', JSON.stringify(data.user));
  };

  const login = async (credentials: LoginCredentials) => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    handleAuthResponse(data);
  };

  const register = async (credentials: RegisterCredentials) => {
    const { data } = await api.post<AuthResponse>('/auth/register', credentials);
    handleAuthResponse(data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('gymbro_token');
    localStorage.removeItem('gymbro_user');
  };

  const updateProfile = async (data: { name?: string, weeklyGoal?: number }) => {
    const res = await api.post<User>('/auth/profile', data);
    setUser(res.data);
    localStorage.setItem('gymbro_user', JSON.stringify(res.data));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
