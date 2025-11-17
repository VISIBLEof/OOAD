'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Submission {
  id: string;
  student_name: string;
  student_email: string;
  content: string;
  grade: number | null;
  feedback: string | null;
  submitted_at: string;
}

export default function SubmissionsPage() {
  const router = useRouter();
  const params = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [gradingSubmissionId, setGradingSubmissionId] = useState('');
  const [gradeFormData, setGradeFormData] = useState({
    grade: '',
    feedback: '',
  });

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const response = await fetch(
          `/api/assignments/${params.id}/submissions`
        );
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data.data);
        }
      } catch (error) {
        console.error('Error loading submissions:', error);
      }
    };

    loadSubmissions();
  }, [params.id]);

  const handleGradeSubmission = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/grade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: parseInt(gradeFormData.grade),
          feedback: gradeFormData.feedback,
        }),
      });

      if (response.ok) {
        const updatedSubmissions = submissions.map((sub) =>
          sub.id === submissionId
            ? {
                ...sub,
                grade: parseInt(gradeFormData.grade),
                feedback: gradeFormData.feedback,
              }
            : sub
        );
        setSubmissions(updatedSubmissions);
        setGradingSubmissionId('');
        setGradeFormData({ grade: '', feedback: '' });
      }
    } catch (error) {
      console.error('Error grading submission:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Assignment Submissions</h1>

        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <CardTitle className="text-lg">{submission.student_name}</CardTitle>
                <CardDescription>{submission.student_email}</CardDescription>
                <CardDescription>
                  Submitted: {new Date(submission.submitted_at).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Submission:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {submission.content}
                  </p>
                </div>

                {submission.grade !== null && (
                  <div>
                    <h4 className="font-semibold mb-2">Grade: {submission.grade}</h4>
                    <p className="text-sm text-muted-foreground">
                      {submission.feedback}
                    </p>
                  </div>
                )}

                {gradingSubmissionId === submission.id ? (
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium">Grade</label>
                      <Input
                        type="number"
                        value={gradeFormData.grade}
                        onChange={(e) =>
                          setGradeFormData({
                            ...gradeFormData,
                            grade: e.target.value,
                          })
                        }
                        max="100"
                        placeholder="0-100"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Feedback</label>
                      <Textarea
                        value={gradeFormData.feedback}
                        onChange={(e) =>
                          setGradeFormData({
                            ...gradeFormData,
                            feedback: e.target.value,
                          })
                        }
                        placeholder="Provide feedback..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleGradeSubmission(submission.id)}
                        className="flex-1"
                      >
                        Save Grade
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setGradingSubmissionId('')}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setGradingSubmissionId(submission.id)}
                    variant="outline"
                  >
                    {submission.grade !== null ? 'Edit Grade' : 'Add Grade'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
