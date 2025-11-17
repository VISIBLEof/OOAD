import { getCurrentUser } from '@/lib/auth';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { quizzesStore, coursesStore, incrementQuizId, initializeStorage, saveQuizzes } from '@/lib/storage';

// Initialize storage on module load
initializeStorage();

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');

    // Try database first, fall back to in-memory
    try {
      if (courseId) {
        const result = await sql`
          SELECT id, course_id, title, questions, time_limit_minutes, due_date, created_at 
          FROM quizzes
          WHERE course_id = ${courseId}
          ORDER BY due_date ASC
        `;
        return NextResponse.json({ success: true, data: result.rows });
      }

      const result = await sql`
        SELECT id, course_id, title, questions, time_limit_minutes, due_date, created_at 
        FROM quizzes
        ORDER BY due_date ASC
      `;
      return NextResponse.json({ success: true, data: result.rows });
    } catch (dbError) {
      // Database not available, return in-memory quizzes
      const quizzes = Array.from(quizzesStore.values());
      if (courseId) {
        return NextResponse.json({ success: true, data: quizzes.filter(q => q.course_id === courseId) });
      }
      return NextResponse.json({ success: true, data: quizzes });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, title, questions, timeLimitMinutes = 60, dueDate } = await request.json();

    if (!courseId || !title) {
      return NextResponse.json({ success: false, error: 'Missing courseId or title' }, { status: 400 });
    }

    // Check if course exists in memory first, then try database
    let courseExists = coursesStore.has(courseId);
    
    if (!courseExists) {
      try {
        const courseCheck = await sql`
          SELECT id FROM courses WHERE id = ${courseId}
        `;
        courseExists = courseCheck.rows.length > 0;
      } catch {
        // If database fails, allow creation anyway (development mode)
        console.warn('Could not verify course in database, allowing quiz creation');
        courseExists = true;
      }
    }

    if (!courseExists) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Try database first, fall back to in-memory storage
    try {
      const result = await sql`
        INSERT INTO quizzes (course_id, title, questions, time_limit_minutes, due_date)
        VALUES (${courseId}, ${title}, ${JSON.stringify(questions)}, ${timeLimitMinutes}, ${dueDate})
        RETURNING id, course_id, title, questions, time_limit_minutes, due_date, created_at
      `;
      return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
    } catch (dbError: any) {
      console.log('Database error, using in-memory storage:', dbError.message);
      
      // Use in-memory storage instead
      const quizId = `quiz_${incrementQuizId()}`;
      const quiz = {
        id: quizId,
        course_id: courseId,
        title,
        questions: Array.isArray(questions) ? questions : [questions],
        time_limit_minutes: timeLimitMinutes,
        due_date: dueDate,
        created_at: new Date().toISOString(),
      };
      quizzesStore.set(quizId, quiz);
      saveQuizzes();
      console.log('Quiz created in memory:', quizId);
      
      return NextResponse.json({ success: true, data: quiz }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Quiz POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create quiz' }, { status: 500 });
  }
}
