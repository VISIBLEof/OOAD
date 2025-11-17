import { NextRequest, NextResponse } from 'next/server';
import { initializeStorage, quizAttemptsStore, saveAttempts } from '@/lib/storage';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { score } = body;

    console.log(`[Grade] Submission ID: ${id}, Score: ${score}`);

    // Validate score
    if (typeof score !== 'number' || score < 0 || score > 100) {
      console.log(`[Grade] Invalid score: ${score}`);
      return NextResponse.json(
        { error: 'Score must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    // Initialize storage
    console.log('[Grade] Initializing storage');
    await initializeStorage();

    // Find and update the attempt
    const attempt = quizAttemptsStore.get(id);
    console.log(`[Grade] Attempt found: ${attempt ? 'yes' : 'no'}`);
    console.log(`[Grade] Store size: ${quizAttemptsStore.size}`);
    console.log(`[Grade] All keys in store:`, Array.from(quizAttemptsStore.keys()));
    
    if (!attempt) {
      console.log(`[Grade] Submission ${id} not found`);
      return NextResponse.json(
        { error: `Submission ${id} not found` },
        { status: 404 }
      );
    }

    // Update the score
    const oldScore = attempt.score;
    attempt.score = score;
    attempt.graded_at = new Date().toISOString();
    attempt.graded_by = 'teacher';
    quizAttemptsStore.set(id, attempt);

    console.log(`[Grade] Updated attempt - old score: ${oldScore}, new score: ${score}`);

    // Save to file
    console.log('[Grade] Saving attempts to file');
    await saveAttempts();

    console.log('[Grade] Grade saved successfully');
    return NextResponse.json(attempt);
  } catch (error) {
    console.error('[Grade] Error:', error);
    return NextResponse.json(
      { error: `Failed to grade submission: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
