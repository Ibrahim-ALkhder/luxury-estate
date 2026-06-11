import { create } from 'zustand';
import { api, setToken } from '../services/api';

interface AuthState {
  isLoggedIn: boolean;
  user: { id: string; name: string; email: string; role: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<{ name: string; email: string }>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: async (email, password) => {
    try {
      const data = await api.post<{ token: string; user: { id: string; name: string; email: string; role: string } }>('/auth/login', { email, password });
      const isAdmin = data.user.role === 'admin';
      if (!isAdmin) return false;
      setToken(data.token);
      set({ isLoggedIn: true, user: { id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role } });
      return true;
    } catch {
      return false;
    }
  },
  logout: () => { setToken(null); set({ isLoggedIn: false, user: null }); },
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null,
  })),
}));
