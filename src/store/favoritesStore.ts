import { create } from 'zustand';

function currentUserId(): string | null {
  try {
    const user = JSON.parse(localStorage.getItem('luxury-current-user') || 'null');
    return user?.id || null;
  } catch {
    return null;
  }
}

function persistFavorites(favorites: string[]) {
  const uid = currentUserId();
  if (uid) {
    localStorage.setItem(`luxury-favorites-${uid}`, JSON.stringify(favorites));
  }
}

function loadFavoritesFromStorage(userId: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(`luxury-favorites-${userId}`) || '[]');
  } catch {
    return [];
  }
}

interface FavoritesState {
  favorites: string[];
  addFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  loadFavorites: (userId: string) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favorites: [],
  addFavorite: (propertyId) => {
    const updated = get().favorites.includes(propertyId)
      ? get().favorites
      : [...get().favorites, propertyId];
    persistFavorites(updated);
    set({ favorites: updated });
  },
  removeFavorite: (propertyId) => {
    const updated = get().favorites.filter((id) => id !== propertyId);
    persistFavorites(updated);
    set({ favorites: updated });
  },
  isFavorite: (propertyId) => get().favorites.includes(propertyId),
  loadFavorites: (userId) => set({ favorites: loadFavoritesFromStorage(userId) }),
  clearFavorites: () => set({ favorites: [] }),
}));
