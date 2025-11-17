import { getCurrentUser } from '@/lib/auth';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Only admins can update users' }, { status: 403 });
    }

    const { id } = await params;
    const { name, role } = await request.json();

    const result = await sql`
      UPDATE users SET name = ${name}, role = ${role} WHERE id = ${id}
      RETURNING id, name, email, role, created_at
    `;

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Only admins can delete users' }, { status: 403 });
    }

    const { id } = await params;

    await sql`DELETE FROM users WHERE id = ${id}`;

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
  }
}
