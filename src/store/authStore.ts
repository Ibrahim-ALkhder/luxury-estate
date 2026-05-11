import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: { email: string; role: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (email, password) => {
    if (email === 'admin@luxestate.com' && password === 'admin123') {
      set({ isLoggedIn: true, user: { email, role: 'admin' } });
      return true;
    }
    return false;
  },
  logout: () => set({ isLoggedIn: false, user: null }),
}));