import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { env } from '@/lib/env';

// Password sign-in for /admin. There is one password, ADMIN_PASSWORD, kept in
// the server environment. A successful sign-in sets an HttpOnly cookie holding
// an expiry time signed with a key derived from that password, so changing
// ADMIN_PASSWORD signs every open session out.

const COOKIE = 'sj_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // seconds — one week

const sha256 = (s: string) => createHash('sha256').update(s).digest();

function signingKey(): Buffer | null {
    const password = env('ADMIN_PASSWORD');
    return password ? createHmac('sha256', 'scalejade-admin-session').update(password).digest() : null;
}

const sign = (payload: string, key: Buffer) => createHmac('sha256', key).update(payload).digest('base64url');

export const isConfigured = () => env('ADMIN_PASSWORD') !== undefined;

/** Constant-time comparison against ADMIN_PASSWORD. */
export function passwordMatches(input: string): boolean {
    const password = env('ADMIN_PASSWORD');
    if (!password) return false;
    return timingSafeEqual(sha256(input), sha256(password));
}

export async function startSession() {
    const key = signingKey();
    if (!key) throw new Error('ADMIN_PASSWORD is not set.');
    const expires = String(Date.now() + MAX_AGE * 1000);
    (await cookies()).set(COOKIE, `${expires}.${sign(expires, key)}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/admin',
        maxAge: MAX_AGE,
    });
}

export async function endSession() {
    (await cookies()).set(COOKIE, '', { path: '/admin', maxAge: 0 });
}

export async function isAdmin(): Promise<boolean> {
    const key = signingKey();
    const value = (await cookies()).get(COOKIE)?.value;
    if (!key || !value) return false;

    const [expires, signature] = value.split('.');
    if (!expires || !signature) return false;
    const expected = Buffer.from(sign(expires, key));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
    return Number(expires) > Date.now();
}

/** Call at the top of every admin page and every admin server action. */
export async function requireAdmin() {
    if (!(await isAdmin())) redirect('/admin/login');
}
