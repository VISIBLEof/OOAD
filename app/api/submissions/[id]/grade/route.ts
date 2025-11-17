import { getCurrentUser } from '@/lib/auth';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ success: false, error: 'Only teachers can grade submissions' }, { status: 403 });
    }

    const { id } = await params;
    const { grade, feedback } = await request.json();

    const result = await sql`
      UPDATE submissions 
      SET grade = ${grade}, feedback = ${feedback || null}
      WHERE id = ${id}
      RETURNING id, assignment_id, student_id, content, grade, feedback, submitted_at
    `;

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to grade submission' }, { status: 500 });
  }
}
