import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production');

export async function createToken(userId: string, email: string, role: string) {
  const token = await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  
  return token;
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { userId: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function getAuthToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    console.log('getAuthToken - found token:', token ? 'yes' : 'no');
    return token;
  } catch (err) {
    console.log('getAuthToken - cookies() error:', err);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const token = await getAuthToken();
    console.log('getCurrentUser - token from cookie:', token ? 'yes' : 'no');
    if (!token) return null;
    const verified = await verifyToken(token);
    console.log('getCurrentUser - verified:', verified ? 'yes' : 'no');
    return verified;
  } catch (err) {
    console.log('getCurrentUser - error:', err);
    return null;
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}
