import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';

/**
 * Simple endpoint to promote a user to teacher role.
 * Usage: POST /api/admin/promote-teacher
 * Body: { "email": "yommongkol12@gmail.com" }
 * 
 * This endpoint uses the admin client to update user_metadata.role to 'teacher'.
 * If service role is not configured, it will fail with a clear error message.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'email is required' },
        { status: 400 }
      );
    }

    // Check if admin client is initialized
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase admin client not initialized. Please set SUPABASE_SERVICE_ROLE_KEY in .env.local',
        },
        { status: 500 }
      );
    }

    // List users and find by email
    const { data: listRes, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (listErr) {
      console.error('listUsers error:', listErr);
      return NextResponse.json(
        { success: false, error: 'Failed to list users' },
        { status: 500 }
      );
    }

    const user = (listRes?.users || []).find((u) => u.email === email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: `User with email ${email} not found` },
        { status: 404 }
      );
    }

    // Update user metadata to set role = 'teacher'
    const { data: updateRes, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...(user.user_metadata || {}),
          role: 'teacher',
        },
      }
    );

    if (updateErr) {
      console.error('updateUserById error:', updateErr);
      return NextResponse.json(
        { success: false, error: 'Failed to update user role' },
        { status: 500 }
      );
    }

    console.log(`Promoted user ${email} to teacher`);
    return NextResponse.json({
      success: true,
      data: {
        userId: updateRes?.user?.id,
        email: updateRes?.user?.email,
        role: updateRes?.user?.user_metadata?.role,
      },
    });
  } catch (err: any) {
    console.error('promote-teacher error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
