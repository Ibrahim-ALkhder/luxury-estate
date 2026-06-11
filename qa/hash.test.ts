import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../src/services/hash';

describe('hashPassword', () => {
  it('should return a 64-character hex string for any input', async () => {
    const hash = await hashPassword('hello');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should produce different hashes for different passwords', async () => {
    const hash1 = await hashPassword('password1');
    const hash2 = await hashPassword('password2');
    expect(hash1).not.toBe(hash2);
  });

  it('should produce consistent hashes for the same input', async () => {
    const hash1 = await hashPassword('test123');
    const hash2 = await hashPassword('test123');
    expect(hash1).toBe(hash2);
  });

  it('should handle empty string', async () => {
    const hash = await hashPassword('');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should handle special characters and unicode', async () => {
    const hash = await hashPassword('héllo!@#世界');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should handle very long passwords', async () => {
    const long = 'a'.repeat(1000);
    const hash = await hashPassword(long);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('verifyPassword', () => {
  it('should return true for matching password and hash', async () => {
    const hash = await hashPassword('mypassword');
    const result = await verifyPassword('mypassword', hash);
    expect(result).toBe(true);
  });

  it('should return false for wrong password', async () => {
    const hash = await hashPassword('correct');
    const result = await verifyPassword('wrong', hash);
    expect(result).toBe(false);
  });

  it('should return false for wrong hash format', async () => {
    const result = await verifyPassword('test', 'invalidhash');
    expect(result).toBe(false);
  });
});
