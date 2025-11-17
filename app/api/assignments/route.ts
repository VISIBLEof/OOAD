import { getCurrentUser } from '@/lib/auth';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { assignmentsStore, coursesStore, incrementAssignmentId, initializeStorage, saveAssignments } from '@/lib/storage';

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
          SELECT a.id, a.course_id, a.title, a.description, a.due_date, a.max_points, a.created_at 
          FROM assignments a
          WHERE a.course_id = ${courseId}
          ORDER BY a.due_date ASC
        `;
        return NextResponse.json({ success: true, data: result.rows });
      }

      const result = await sql`
        SELECT a.id, a.course_id, a.title, a.description, a.due_date, a.max_points, a.created_at 
        FROM assignments a
        ORDER BY a.due_date ASC
      `;
      return NextResponse.json({ success: true, data: result.rows });
    } catch (dbError) {
      // Database not available, return in-memory assignments
      const assignments = Array.from(assignmentsStore.values());
      if (courseId) {
        return NextResponse.json({ success: true, data: assignments.filter(a => a.course_id === courseId) });
      }
      return NextResponse.json({ success: true, data: assignments });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ success: false, error: 'Only teachers can create assignments' }, { status: 403 });
    }

    const { courseId, title, description, dueDate, maxPoints = 100 } = await request.json();

    // Verify course exists (in memory or database)
    let courseExists = coursesStore.has(courseId);
    
    if (!courseExists) {
      try {
        const courseCheck = await sql`
          SELECT id FROM courses WHERE id = ${courseId} AND teacher_id = ${user.userId}
        `;
        courseExists = courseCheck.rows.length > 0;
      } catch {
        // Database not available
      }
    } else {
      // Check teacher owns the course
      const course = coursesStore.get(courseId);
      if (course?.teacher_id !== user.userId) {
        return NextResponse.json({ success: false, error: 'Course not found or not authorized' }, { status: 403 });
      }
    }

    if (!courseExists) {
      return NextResponse.json({ success: false, error: 'Course not found or not authorized' }, { status: 403 });
    }

    // Try database first, fall back to in-memory storage
    try {
      const result = await sql`
        INSERT INTO assignments (course_id, title, description, due_date, max_points)
        VALUES (${courseId}, ${title}, ${description || null}, ${dueDate}, ${maxPoints})
        RETURNING id, course_id, title, description, due_date, max_points, created_at
      `;

      return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
    } catch (dbError) {
      console.log('Database error, using in-memory storage for assignment');
      
      // Use in-memory storage instead
      const assignmentId = `assignment_${incrementAssignmentId()}`;
      const assignment = {
        id: assignmentId,
        course_id: courseId,
        title,
        description: description || null,
        due_date: dueDate,
        max_points: maxPoints || 100,
        created_at: new Date().toISOString(),
      };
      assignmentsStore.set(assignmentId, assignment);
      saveAssignments();
      console.log('Assignment created in memory:', assignmentId);

      return NextResponse.json({ success: true, data: assignment }, { status: 201 });
    }
  } catch (error) {
    console.error('Assignment POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create assignment' }, { status: 500 });
  }
}
