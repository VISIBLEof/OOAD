import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { initializeStorage, submissionsStore } from '@/lib/storage';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Initialize storage
    await initializeStorage();

    // Get all submissions for this assignment
    const submissions = Array.from(submissionsStore.values()).filter(
      (submission) => submission.assignment_id === id
    );

    return NextResponse.json({ success: true, data: submissions }, { status: 200 });
  } catch (error: any) {
    console.error('Get assignment submissions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
