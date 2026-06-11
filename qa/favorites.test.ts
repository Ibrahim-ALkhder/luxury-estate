import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage
function createMockStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  };
}

beforeEach(() => {
  const mock = createMockStorage();
  Object.defineProperty(globalThis, 'localStorage', { value: mock, writable: true });
});

describe('Favorites localStorage persistence', () => {
  const userId = 'test_user_123';
  const FAV_KEY = `luxury-favorites-${userId}`;

  it('should store favorites array under per-user key', () => {
    localStorage.setItem(FAV_KEY, JSON.stringify(['prop1', 'prop2']));
    const stored = JSON.parse(localStorage.getItem(FAV_KEY)!);
    expect(stored).toEqual(['prop1', 'prop2']);
  });

  it('should add a favorite', () => {
    const existing = JSON.parse(localStorage.getItem(FAV_KEY) || '[]') as string[];
    existing.push('prop_new');
    localStorage.setItem(FAV_KEY, JSON.stringify(existing));

    const stored = JSON.parse(localStorage.getItem(FAV_KEY)!);
    expect(stored).toContain('prop_new');
    expect(stored).toHaveLength(1);
  });

  it('should remove a favorite', () => {
    localStorage.setItem(FAV_KEY, JSON.stringify(['prop1', 'prop2', 'prop3']));

    const existing = JSON.parse(localStorage.getItem(FAV_KEY)!) as string[];
    const filtered = existing.filter((id) => id !== 'prop2');
    localStorage.setItem(FAV_KEY, JSON.stringify(filtered));

    const stored = JSON.parse(localStorage.getItem(FAV_KEY)!);
    expect(stored).toEqual(['prop1', 'prop3']);
  });

  it('should clear all favorites', () => {
    localStorage.setItem(FAV_KEY, JSON.stringify(['prop1', 'prop2']));
    localStorage.removeItem(FAV_KEY);
    expect(localStorage.getItem(FAV_KEY)).toBeNull();
  });

  it('should handle empty state', () => {
    const stored = JSON.parse(localStorage.getItem(FAV_KEY) || '[]') as string[];
    expect(stored).toEqual([]);
  });

  it('should not leak between different users', () => {
    localStorage.setItem('luxury-favorites-user1', JSON.stringify(['prop_a']));
    localStorage.setItem('luxury-favorites-user2', JSON.stringify(['prop_b']));

    const user1 = JSON.parse(localStorage.getItem('luxury-favorites-user1')!);
    const user2 = JSON.parse(localStorage.getItem('luxury-favorites-user2')!);

    expect(user1).toEqual(['prop_a']);
    expect(user2).toEqual(['prop_b']);
    expect(user1).not.toEqual(user2);
  });
});
