'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  max_points: number;
}

export default function AssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        const response = await fetch(`/api/assignments?assignmentId=${params.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.data.length > 0) {
            setAssignment(data.data[0]);
          }
        }
      } catch (error) {
        console.error('Error loading assignment:', error);
      }
    };

    loadAssignment();
  }, [params.id]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/assignments/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setSubmitted(true);
        setContent('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assignment) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{assignment.title}</CardTitle>
            <CardDescription>
              Due: {new Date(assignment.due_date).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{assignment.description}</p>
            </div>

            {submitted ? (
              <div className="p-4 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 rounded">
                Assignment submitted successfully!
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive text-sm rounded">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium block mb-2">Your Submission</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your assignment content here..."
                    rows={10}
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !content.trim()}
                  className="w-full"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
