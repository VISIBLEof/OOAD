import { getCurrentUser } from '@/lib/auth';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { coursesStore, incrementCourseId, initializeStorage, saveCourses } from '@/lib/storage';

// Initialize storage on module load
initializeStorage();

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Try to get from database first, fall back to in-memory
    try {
      if (user.role === 'teacher') {
        const result = await sql`
          SELECT id, code, title, description, teacher_id, created_at 
          FROM courses 
          WHERE teacher_id = ${user.userId}
          ORDER BY created_at DESC
        `;
        return NextResponse.json({ success: true, data: result.rows });
      }

      const result = await sql`
        SELECT id, code, title, description, teacher_id, created_at 
        FROM courses 
        ORDER BY created_at DESC
      `;
      return NextResponse.json({ success: true, data: result.rows });
    } catch (dbError) {
      // Database not available, return in-memory courses
      const courses = Array.from(coursesStore.values());
      if (user.role === 'teacher') {
        return NextResponse.json({ success: true, data: courses.filter(c => c.teacher_id === user.userId) });
      }
      return NextResponse.json({ success: true, data: courses });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    console.log('Course POST - User:', user);

    if (!user) {
      console.log('Course POST - No user');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Allow both teacher and admin to create courses (also allow student during development)
    console.log('Course POST - User role:', user.role);

    const { code, title, description } = await request.json();

    // Try database first, fall back to in-memory storage
    try {
      const result = await sql`
        INSERT INTO courses (code, title, description, teacher_id)
        VALUES (${code}, ${title}, ${description || null}, ${user.userId})
        RETURNING id, code, title, description, teacher_id, created_at
      `;
      return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
    } catch (dbError: any) {
      console.log('Database error, using in-memory storage:', dbError.message);
      
      // Use in-memory storage instead
      const courseId = `course_${incrementCourseId()}`;
      const course = {
        id: courseId,
        code,
        title,
        description: description || null,
        teacher_id: user.userId,
        created_at: new Date().toISOString(),
      };
      coursesStore.set(courseId, course);
      saveCourses();
      console.log('Course created in memory:', courseId);
      
      return NextResponse.json({ success: true, data: course }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Course POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create course' }, { status: 500 });
  }
}
