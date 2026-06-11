import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../../types';
import { useFavoritesStore } from '../../store/favoritesStore';
import {
  loginUser, registerUser,
  setCurrentUser, getCurrentUser,
} from '../../services/authService';
import { setToken } from '../../services/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      loadFavorites(user.id);
    } else {
      setCurrentUser(null);
      clearFavorites();
    }
  }, [user, loadFavorites, clearFavorites]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = await loginUser(email, password);
    if (found) { setUser(found); return true; }
    return false;
  };

  const register = async (email: string, password: string, name: string, phone: string): Promise<boolean> => {
    const ok = await registerUser(email, password, name, phone);
    if (ok) {
      const newUser = await loginUser(email, password);
      if (newUser) setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => { setUser(null); setToken(null); };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
