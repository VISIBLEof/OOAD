import { createToken, setAuthCookie } from '@/lib/auth';
import { createUser, getUserByEmail } from '@/lib/db';
import { validateEmail, validatePassword } from '@/lib/validation';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role = 'student' } = await request.json();

    if (!validateEmail(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Prevent duplicate registration
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
    }

    let user;
    try {
      user = await createUser({ name, email, passwordHash, role });
    } catch (dbErr: any) {
      console.error('createUser error:', dbErr);
      const message = dbErr?.message || dbErr?.toString() || 'Registration failed';
      if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('already exists') || (dbErr?.code && dbErr.code === '23505')) {
        return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
      }
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
    }

    const token = await createToken(user.id as string, user.email as string, user.role as string);
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      data: { userId: user.id, email: user.email, role: user.role, token },
    });
  } catch (error: any) {
    console.error('register route error:', error);
    const msg = error?.message || 'Registration failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
