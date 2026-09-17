import { describe, expect, it } from 'vitest';
import {
  emailChangeConfirmSchema,
  emailChangeRequestSchema,
  profileUpdateSchema,
} from '../src/index.js';

describe('profileUpdateSchema', () => {
  it('accepts a display name with the current password', () => {
    const parsed = profileUpdateSchema.parse({
      displayName: '  王奶奶  ',
      currentPassword: 'old-secret-1',
    });

    expect(parsed.displayName).toBe('王奶奶');
  });

  it('requires the current password so old credentials are always checked', () => {
    const parsed = profileUpdateSchema.safeParse({ displayName: '王奶奶' });

    expect(parsed.success).toBe(false);
  });

  it('rejects an empty display name and unknown fields', () => {
    expect(
      profileUpdateSchema.safeParse({ displayName: '   ', currentPassword: 'x' }).success,
    ).toBe(false);
    expect(
      profileUpdateSchema.safeParse({
        displayName: '王奶奶',
        currentPassword: 'x',
        email: 'sneaky@example.com',
      }).success,
    ).toBe(false);
  });
});

describe('emailChangeRequestSchema', () => {
  it('accepts a new email with the current password', () => {
    const parsed = emailChangeRequestSchema.parse({
      newEmail: 'New@Example.com ',
      currentPassword: 'old-secret-1',
    });

    expect(parsed.newEmail).toBe('New@Example.com');
  });

  it('rejects an invalid email or a missing password', () => {
    expect(
      emailChangeRequestSchema.safeParse({
        newEmail: 'not-an-email',
        currentPassword: 'x',
      }).success,
    ).toBe(false);
    expect(
      emailChangeRequestSchema.safeParse({ newEmail: 'a@b.co' }).success,
    ).toBe(false);
  });
});

describe('emailChangeConfirmSchema', () => {
  it('requires the request id and confirmation token for the second step', () => {
    const parsed = emailChangeConfirmSchema.safeParse({
      requestId: '7b0b68c6-9d1f-4b0e-9f6a-3f0c2f7a9c11',
      token: 'abc123',
    });

    expect(parsed.success).toBe(true);
    expect(emailChangeConfirmSchema.safeParse({ requestId: 'bad', token: 'abc' }).success).toBe(
      false,
    );
    expect(
      emailChangeConfirmSchema.safeParse({
        requestId: '7b0b68c6-9d1f-4b0e-9f6a-3f0c2f7a9c11',
      }).success,
    ).toBe(false);
  });
});
