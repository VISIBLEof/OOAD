import { getCurrentUser } from '@/lib/auth';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { quizzesStore, quizAttemptsStore, incrementQuizAttemptId, initializeStorage, saveAttempts } from '@/lib/storage';

// Initialize storage on module load
initializeStorage();

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if quiz exists in memory or database
    let quiz = quizzesStore.get(id);
    
    if (!quiz) {
      try {
        const result = await sql`
          SELECT id, title, time_limit_minutes FROM quizzes WHERE id = ${id}
        `;
        if (result.rows.length > 0) {
          quiz = result.rows[0];
        }
      } catch {
        // Database not available
      }
    }

    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    }

    // Try to save to database first, fall back to in-memory
    let attempt;
    try {
      const result = await sql`
        INSERT INTO quiz_attempts (quiz_id, student_id)
        VALUES (${id}, ${user.userId})
        RETURNING id, quiz_id, student_id, started_at
      `;
      attempt = result.rows[0];
    } catch (dbError) {
      console.log('Database error, using in-memory storage for quiz attempt');
      
      // Use in-memory storage
      const attemptId = `attempt_${incrementQuizAttemptId()}`;
      attempt = {
        id: attemptId,
        quiz_id: id,
        student_id: user.userId,
        student_email: user.email,
        started_at: new Date().toISOString(),
      };
      quizAttemptsStore.set(attemptId, attempt);
      saveAttempts();
    }

    return NextResponse.json({
      success: true,
      data: {
        attemptId: attempt.id,
        quizId: attempt.quiz_id,
        startedAt: attempt.started_at,
        timeLimitMinutes: quiz.time_limit_minutes || 60,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Quiz start error:', error);
    return NextResponse.json({ success: false, error: 'Failed to start quiz' }, { status: 500 });
  }
}
