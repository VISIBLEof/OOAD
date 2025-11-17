import { createToken, setAuthCookie } from '@/lib/auth';
import { getUserByEmail } from '@/lib/db';
import { validateEmail } from '@/lib/validation';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!validateEmail(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    try {
      const passwordHash = user.password_hash as string | undefined;
      if (!passwordHash) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }
      const passwordMatch = await bcrypt.compare(password, passwordHash);
      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }
    } catch (err) {
      console.error('password compare error:', err);
      return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
    }

    const token = await createToken(user.id as string, user.email as string, user.role as string);
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      data: { userId: user.id, email: user.email, role: user.role, token },
    });
  } catch (error: any) {
    console.error('login route error:', error);
    const msg = error?.message || 'Login failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
