import { api, getToken, setToken } from './api';
import { getItem, setItem, removeItem } from './storage';
import type { User, Lead } from '../types';

// ── Auth API (strictly server-side; no localStorage fallback) ──

export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    const data = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    setToken(data.token);
    setItem('luxury-current-user', data.user);
    return data.user;
  } catch {
    return null;
  }
}

export async function registerUser(
  email: string, password: string, name: string, phone: string
): Promise<boolean> {
  try {
    const data = await api.post<{ token: string; user: User }>('/auth/register', { name, email, password, phone });
    setToken(data.token);
    setItem('luxury-current-user', data.user);
    return true;
  } catch (err: any) {
    if (err?.status === 409) return false;
    return false;
  }
}

export async function verifyUserPassword(email: string, password: string): Promise<boolean> {
  try {
    const token = getToken();
    await api.post('/auth/verify-password', { email, password }, token || undefined);
    return true;
  } catch {
    return false;
  }
}

export async function updateUserPassword(
  email: string, oldPassword: string, newPassword: string
): Promise<boolean> {
  try {
    const token = getToken();
    const data = await api.put<{ user: User }>('/auth/profile', { oldPassword, newPassword, name: '', email }, token || undefined);
    setItem('luxury-current-user', data.user);
    return true;
  } catch {
    return false;
  }
}

// ── Session persistence (token + current user only, NOT a user DB) ──

export function setCurrentUser(user: User | null) {
  if (user) setItem('luxury-current-user', user);
  else removeItem('luxury-current-user');
}

export function getCurrentUser(): User | null {
  return getItem<User | null>('luxury-current-user', null);
}
