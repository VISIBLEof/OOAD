'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Question {
  id: string | number;
  question: string;
  type: string;
  options?: string[];
}

interface Submission {
  id: string;
  student_id: string;
  student_email?: string;
  quiz_id: string;
  answers: any[];
  score: number | null;
  started_at: string;
  finished_at: string;
}

export default function SubmissionsPage() {
  const router = useRouter();
  const params = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [gradeInput, setGradeInput] = useState<string>('');
  const [savingGrade, setSavingGrade] = useState(false);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        // Get submissions
        const submissionsRes = await fetch(`/api/quizzes/submissions?quizId=${params.id}`);
        if (submissionsRes.ok) {
          const submissionsData = await submissionsRes.json();
          setSubmissions(submissionsData.data);
        }

        // Get quiz to get questions
        const quizzesRes = await fetch(`/api/quizzes?quizId=${params.id}`);
        if (quizzesRes.ok) {
          const quizzesData = await quizzesRes.json();
          if (quizzesData.data.length > 0) {
            const quiz = quizzesData.data[0];
            let parsedQuestions = [];
            if (Array.isArray(quiz.questions)) {
              parsedQuestions = quiz.questions;
            } else if (typeof quiz.questions === 'string') {
              try {
                parsedQuestions = JSON.parse(quiz.questions);
              } catch {
                parsedQuestions = [];
              }
            }
            setQuestions(parsedQuestions);
          }
        }
      } catch (error) {
        console.error('Error loading submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [params.id]);

  const getAnswerDisplay = (answer: any, question: Question) => {
    if (!answer) return 'No answer';

    if (question.type === 'single' || question.type === 'multi') {
      if (Array.isArray(answer)) {
        return answer.map(idx => question.options?.[idx] || idx).join(', ');
      }
      return question.options?.[answer as number] || answer;
    }

    return String(answer);
  };

  const handleSaveGrade = async () => {
    if (!selectedSubmission || gradeInput === '') {
      alert('Please enter a grade');
      return;
    }

    const grade = parseInt(gradeInput);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      alert('Grade must be between 0 and 100');
      return;
    }

    setSavingGrade(true);
    try {
      const response = await fetch(`/api/quizzes/submissions/${selectedSubmission.id}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: grade }),
      });

      const responseData = await response.json();

      if (response.ok) {
        const updated = { ...selectedSubmission, score: grade };
        setSelectedSubmission(updated);
        setSubmissions(submissions.map(s => s.id === selectedSubmission.id ? updated : s));
        setGradeInput('');
        alert('Grade saved successfully');
      } else {
        console.error('Grade save failed:', responseData);
        alert(`Failed to save grade: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Error saving grade');
    } finally {
      setSavingGrade(false);
    }
  };

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeInput(submission.score?.toString() || '');
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

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
        <div className="grid grid-cols-3 gap-6">
          {/* Submissions List */}
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-4">Student Submissions</h2>
            <div className="space-y-2">
              {submissions.length === 0 ? (
                <p className="text-muted-foreground">No submissions yet</p>
              ) : (
                submissions.map((submission) => (
                  <Card
                    key={submission.id}
                    className={`cursor-pointer transition-colors ${
                      selectedSubmission?.id === submission.id
                        ? 'border-primary'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleSelectSubmission(submission)}
                  >
                    <CardContent className="pt-4">
                      <p className="font-semibold text-sm">{submission.student_email || submission.student_id}</p>
                      <p className="text-sm text-muted-foreground">
                        Score: {submission.score !== null ? `${submission.score}%` : 'Pending'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(submission.finished_at).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Answer Details */}
          <div className="col-span-2">
            {selectedSubmission ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    Student: {selectedSubmission.student_email || selectedSubmission.student_id}
                  </h2>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      {selectedSubmission.score !== null ? `${selectedSubmission.score}%` : 'Pending'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Score
                    </p>
                  </div>
                </div>

                {/* Grade Input Section */}
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">Assign Grade</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade (0-100)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="grade"
                          type="number"
                          min="0"
                          max="100"
                          value={gradeInput}
                          onChange={(e) => setGradeInput(e.target.value)}
                          placeholder="Enter grade"
                          disabled={savingGrade}
                        />
                        <Button
                          onClick={handleSaveGrade}
                          disabled={savingGrade || gradeInput === ''}
                          className="whitespace-nowrap"
                        >
                          {savingGrade ? 'Saving...' : 'Save Grade'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <Card key={question.id}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {index + 1}. {question.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">
                            Student Answer:
                          </p>
                          <p className="text-base p-3 bg-muted rounded">
                            {getAnswerDisplay(selectedSubmission.answers[index], question)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground text-lg">
                  Select a submission to view answers
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
