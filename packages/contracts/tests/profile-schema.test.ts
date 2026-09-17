import { describe, expect, it } from 'vitest';
import {
  profileEmailUpdateSchema,
  profileNameUpdateSchema,
} from '../src/index.js';

describe('profileNameUpdateSchema', () => {
  it('accepts a valid name change with confirmation and password', () => {
    const parsed = profileNameUpdateSchema.parse({
      displayName: '  新姓名  ',
      confirmName: '新姓名',
      currentPassword: 'old-secret',
    });

    expect(parsed.displayName).toBe('新姓名');
    expect(parsed.confirmName).toBe('新姓名');
  });

  it('rejects a blank display name', () => {
    const parsed = profileNameUpdateSchema.safeParse({
      displayName: '   ',
      confirmName: '   ',
      currentPassword: 'old-secret',
    });

    expect(parsed.success).toBe(false);
  });

  it('rejects an empty current password', () => {
    const parsed = profileNameUpdateSchema.safeParse({
      displayName: '新姓名',
      confirmName: '新姓名',
      currentPassword: '',
    });

    expect(parsed.success).toBe(false);
  });

  it('rejects unknown fields', () => {
    const parsed = profileNameUpdateSchema.safeParse({
      displayName: '新姓名',
      confirmName: '新姓名',
      currentPassword: 'old-secret',
      userId: 'other-user',
    });

    expect(parsed.success).toBe(false);
  });
});

describe('profileEmailUpdateSchema', () => {
  it('accepts a valid email change with confirmation and password', () => {
    const parsed = profileEmailUpdateSchema.parse({
      email: 'new@example.com',
      confirmEmail: 'new@example.com',
      currentPassword: 'old-secret',
    });

    expect(parsed.email).toBe('new@example.com');
  });

  it('rejects an invalid email', () => {
    const parsed = profileEmailUpdateSchema.safeParse({
      email: 'not-an-email',
      confirmEmail: 'not-an-email',
      currentPassword: 'old-secret',
    });

    expect(parsed.success).toBe(false);
  });

  it('rejects a missing password', () => {
    const parsed = profileEmailUpdateSchema.safeParse({
      email: 'new@example.com',
      confirmEmail: 'new@example.com',
    });

    expect(parsed.success).toBe(false);
  });
});
