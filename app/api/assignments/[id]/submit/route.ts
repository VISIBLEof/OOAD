import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { initializeStorage, submissionsStore, saveSubmissions, incrementSubmissionId } from '@/lib/storage';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Only students can submit assignments' }, { status: 403 });
    }

    const { id } = await params;
    const { content } = await request.json();

    if (!content || content.trim() === '') {
      return NextResponse.json({ success: false, error: 'Submission content cannot be empty' }, { status: 400 });
    }

    // Initialize storage
    await initializeStorage();

    // Create submission
    const submissionId = `submission_${incrementSubmissionId()}`;
    const submission = {
      id: submissionId,
      assignment_id: id,
      student_id: user.userId,
      student_email: user.email,
      content,
      grade: null,
      feedback: null,
      submitted_at: new Date().toISOString(),
    };

    submissionsStore.set(submissionId, submission);
    await saveSubmissions();

    return NextResponse.json({ success: true, data: submission }, { status: 201 });
  } catch (error) {
    console.error('Assignment submit error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit assignment' }, { status: 500 });
  }
}
