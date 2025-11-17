import { getCurrentUser } from '@/lib/auth';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { quizzesStore, quizAttemptsStore, initializeStorage } from '@/lib/storage';
import { createClient } from '@supabase/supabase-js';

initializeStorage();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
    if (error || !user) return null;
    return user.email || null;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const quizId = searchParams.get('quizId');

    if (!quizId) {
      return NextResponse.json({ success: false, error: 'Quiz ID required' }, { status: 400 });
    }

    // Get quiz to verify teacher owns it (from memory or database)
    let quiz = quizzesStore.get(quizId);
    
    if (!quiz) {
      try {
        const quizResult = await sql`
          SELECT id, course_id FROM quizzes WHERE id = ${quizId}
        `;
        if (quizResult.rows.length > 0) {
          quiz = quizResult.rows[0];
        }
      } catch {
        // Database not available
      }
    }

    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    }

    // Get all attempts for this quiz from memory
    let attempts = Array.from(quizAttemptsStore.values()).filter(
      (attempt) => attempt.quiz_id === quizId && attempt.finished_at
    );

    // If user is a student, only return their submission
    if (user.role === 'student') {
      attempts = attempts.filter((attempt) => attempt.student_email === user.email);
    }

    // Try to get from database as well
    let dbAttempts: any[] = [];
    try {
      const dbResult = await sql`
        SELECT id, quiz_id, student_id, answers, score, started_at, finished_at 
        FROM quiz_attempts 
        WHERE quiz_id = ${quizId} AND finished_at IS NOT NULL
      `;
      dbAttempts = dbResult.rows;
      
      // If student, filter by their ID
      if (user.role === 'student') {
        dbAttempts = dbAttempts.filter((attempt) => attempt.student_id === user.userId);
      }
    } catch {
      // Database not available
    }

    // Combine and deduplicate
    const allAttempts = [...attempts];
    for (const dbAttempt of dbAttempts) {
      if (!allAttempts.find((a) => a.id === dbAttempt.id)) {
        allAttempts.push(dbAttempt);
      }
    }

    // Fetch emails for attempts that don't have them
    const attemptsWithEmails = await Promise.all(
      allAttempts.map(async (attempt) => {
        if (attempt.student_email) {
          return attempt;
        }
        const email = await getUserEmail(attempt.student_id);
        return {
          ...attempt,
          student_email: email,
        };
      })
    );

    return NextResponse.json({ success: true, data: attemptsWithEmails }, { status: 200 });
  } catch (error: any) {
    console.error('Get submissions error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
