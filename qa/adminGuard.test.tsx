import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock the zustand store
const mockUseAuthStore = vi.fn();

vi.mock('../src/store/authStore', () => ({
  useAuthStore: (selector?: (s: any) => any) => {
    const state = mockUseAuthStore();
    return selector ? selector(state) : state;
  },
}));

import AdminGuard from '../src/features/auth/AdminGuard';

describe('AdminGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to /secure-portal when not logged in', () => {
    mockUseAuthStore.mockReturnValue({ isLoggedIn: false, user: null });

    const { container } = render(
      <MemoryRouter initialEntries={['/dummy']}>
        <AdminGuard><div data-testid="admin-content">Secret</div></AdminGuard>
      </MemoryRouter>
    );

    // Navigate component renders null — children should not appear
    expect(container.querySelector('[data-testid="admin-content"]')).toBeNull();
  });

  it('should redirect to /forbidden when logged in as non-admin', () => {
    mockUseAuthStore.mockReturnValue({
      isLoggedIn: true,
      user: { email: 'user@test.com', role: 'user' },
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/dummy']}>
        <AdminGuard><div data-testid="admin-content">Secret</div></AdminGuard>
      </MemoryRouter>
    );

    // Should redirect to /forbidden (Navigate component), not render children
    expect(container.querySelector('[data-testid="admin-content"]')).toBeNull();
  });

  it('should render children when logged in as admin', () => {
    mockUseAuthStore.mockReturnValue({
      isLoggedIn: true,
      user: { email: 'admin@test.com', role: 'admin' },
    });

    const { getByTestId } = render(
      <MemoryRouter>
        <AdminGuard><div data-testid="admin-content">Secret</div></AdminGuard>
      </MemoryRouter>
    );

    expect(getByTestId('admin-content')).toBeTruthy();
    expect(getByTestId('admin-content').textContent).toBe('Secret');
  });
});
