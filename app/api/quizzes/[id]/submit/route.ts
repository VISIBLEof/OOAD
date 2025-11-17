import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { quizAttemptsStore, initializeStorage, saveAttempts } from '@/lib/storage';

initializeStorage();

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { attemptId, answers } = await request.json();

    // Get attempt from memory
    const attempt = quizAttemptsStore.get(attemptId);
    if (!attempt) {
      return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
    }

    const updatedAttempt = {
      ...attempt,
      answers,
      score: null,
      finished_at: new Date().toISOString(),
      student_email: user.email,
    };

    quizAttemptsStore.set(attemptId, updatedAttempt);

    // Save to file immediately for persistence
    await saveAttempts();

    return NextResponse.json({ success: true, data: { attemptId, finished_at: updatedAttempt.finished_at } }, { status: 201 });
  } catch (error: any) {
    console.error('Quiz submit error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit quiz' }, { status: 500 });
  }
}
