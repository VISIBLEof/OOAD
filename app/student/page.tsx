 'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  max_points: number;
}

interface Quiz {
  id: string;
  title: string;
  due_date: string;
  time_limit_minutes: number;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const meResponse = await fetch('/api/me', { credentials: 'include' });
        if (!meResponse.ok) {
          // Try a client-side Supabase session fallback before redirecting
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !sessionData?.session) {
            router.push('/login');
            return;
          }

          const user = sessionData.session.user;
          const role = (user.user_metadata as any)?.role || 'student';
          if (role !== 'student') {
            router.push('/login');
            return;
          }

          // attempt to sync the session to server (best-effort)
          try {
            await fetch('/api/auth/sync', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ access_token: (sessionData as any).session.access_token }),
            });
          } catch (syncErr) {
            console.error('session sync error:', syncErr);
          }

          setUser({ id: user.id, name: (user.user_metadata as any)?.name || '', email: user.email, role });
        } else {
          const meData = await meResponse.json();
          if (meData.data.role !== 'student') {
            router.push('/login');
            return;
          }
          setUser(meData.data);
        }

        const [assignmentsRes, quizzesRes] = await Promise.all([
          fetch('/api/assignments', { credentials: 'include' }),
          fetch('/api/quizzes', { credentials: 'include' }),
        ]);

        if (assignmentsRes.ok) {
          const assignmentsData = await assignmentsRes.json();
          setAssignments(assignmentsData.data);
        }

        if (quizzesRes.ok) {
          const quizzesData = await quizzesRes.json();
          setQuizzes(quizzesData.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/');
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Assignments</h2>
            <div className="space-y-4">
              {assignments.length === 0 ? (
                <p className="text-muted-foreground">No assignments yet</p>
              ) : (
                assignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription>
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{assignment.description}</p>
                      <Link href={`/student/assignment/${assignment.id}`}>
                        <Button size="sm">View & Submit</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Quizzes</h2>
            <div className="space-y-4">
              {quizzes.length === 0 ? (
                <p className="text-muted-foreground">No quizzes yet</p>
              ) : (
                quizzes.map((quiz) => (
                  <Card key={quiz.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <CardDescription>
                        Due: {new Date(quiz.due_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">Time limit: {quiz.time_limit_minutes} minutes</p>
                      <Link href={`/student/quiz/${quiz.id}`}>
                        <Button size="sm">Take Quiz</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
