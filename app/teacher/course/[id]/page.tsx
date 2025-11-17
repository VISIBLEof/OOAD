'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
}

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
  questions: string;
  time_limit_minutes: number;
  due_date: string;
}

export default function CourseManagePage() {
  const router = useRouter();
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateQuizForm, setShowCreateQuizForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100,
  });
  const [quizFormData, setQuizFormData] = useState({
    title: '',
    questionsJson: '',
    timeLimitMinutes: 60,
    dueDate: '',
  });

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const coursesRes = await fetch('/api/courses');
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          const foundCourse = coursesData.data.find(
            (c: Course) => c.id === params.id
          );
          if (foundCourse) setCourse(foundCourse);
        }

        const assignmentsRes = await fetch(
          `/api/assignments?courseId=${params.id}`
        );
        if (assignmentsRes.ok) {
          const assignmentsData = await assignmentsRes.json();
          setAssignments(assignmentsData.data);
        }

        const quizzesRes = await fetch(
          `/api/quizzes?courseId=${params.id}`
        );
        if (quizzesRes.ok) {
          const quizzesData = await quizzesRes.json();
          setQuizzes(quizzesData.data);
        }
      } catch (error) {
        console.error('Error loading course:', error);
      }
    };

    loadCourse();
  }, [params.id]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: params.id,
          ...formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAssignments([...assignments, data.data]);
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          maxPoints: 100,
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let questions;
      
      // Try to parse as JSON first
      try {
        questions = JSON.parse(quizFormData.questionsJson);
      } catch {
        // If not valid JSON, treat as a single question string
        if (!quizFormData.questionsJson.trim()) {
          alert('Please enter at least one question');
          return;
        }
        
        // Create a simple question from the text
        questions = [{
          id: 1,
          question: quizFormData.questionsJson.trim(),
          type: 'short_answer'
        }];
      }

      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: params.id,
          title: quizFormData.title,
          questions,
          timeLimitMinutes: quizFormData.timeLimitMinutes,
          dueDate: quizFormData.dueDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuizzes([...quizzes, data.data]);
        setQuizFormData({
          title: '',
          questionsJson: '',
          timeLimitMinutes: 60,
          dueDate: '',
        });
        setShowCreateQuizForm(false);
        alert('Quiz created successfully!');
      } else {
        const error = await response.json();
        alert('Error creating quiz: ' + error.error);
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz. Please try again.');
    }
  };

  if (!course) return <div className="p-4">Loading...</div>;

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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>{course.code}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{course.description}</p>
          </CardContent>
        </Card>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Assignments</h2>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'Cancel' : '+ Create Assignment'}
            </Button>
          </div>

          {showCreateForm && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <form onSubmit={handleCreateAssignment} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Due Date</label>
                      <Input
                        type="datetime-local"
                        value={formData.dueDate}
                        onChange={(e) =>
                          setFormData({ ...formData, dueDate: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Max Points</label>
                      <Input
                        type="number"
                        value={formData.maxPoints}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxPoints: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Create Assignment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription>
                    Due: {new Date(assignment.due_date).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {assignment.description}
                  </p>
                  <Link
                    href={`/teacher/assignment/${assignment.id}/submissions`}
                  >
                    <Button size="sm">View Submissions</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quizzes</h2>
            <Button onClick={() => setShowCreateQuizForm(!showCreateQuizForm)}>
              {showCreateQuizForm ? 'Cancel' : '+ Create Quiz'}
            </Button>
          </div>

          {showCreateQuizForm && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <form onSubmit={handleCreateQuiz} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Quiz Title</label>
                    <Input
                      value={quizFormData.title}
                      onChange={(e) =>
                        setQuizFormData({ ...quizFormData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Questions</label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Enter a simple question, or enter JSON array for multiple questions
                    </p>
                    <Textarea
                      value={quizFormData.questionsJson}
                      onChange={(e) =>
                        setQuizFormData({ ...quizFormData, questionsJson: e.target.value })
                      }
                      placeholder={`Simple: What is 2+2?

Or JSON format:
[
  { "id": 1, "question": "What is 2+2?", "type": "multiple_choice", "options": ["3", "4", "5"], "correctAnswer": "4" },
  { "id": 2, "question": "True or False?", "type": "true_false", "correctAnswer": true }
]`}
                      required
                      rows={8}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Time Limit (minutes)</label>
                      <Input
                        type="number"
                        value={quizFormData.timeLimitMinutes}
                        onChange={(e) =>
                          setQuizFormData({
                            ...quizFormData,
                            timeLimitMinutes: parseInt(e.target.value),
                          })
                        }
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Due Date</label>
                      <Input
                        type="datetime-local"
                        value={quizFormData.dueDate}
                        onChange={(e) =>
                          setQuizFormData({ ...quizFormData, dueDate: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Create Quiz
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <CardDescription>
                    Time Limit: {quiz.time_limit_minutes} minutes | Due: {new Date(quiz.due_date).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Questions: {Array.isArray(quiz.questions) ? quiz.questions.length : 0}
                  </p>
                  <Button 
                    onClick={() => router.push(`/teacher/quiz/${quiz.id}/submissions`)}
                    variant="outline"
                    className="w-full"
                  >
                    View Submissions
                  </Button>
                </CardContent>
              </Card>
            ))}
            {quizzes.length === 0 && !showCreateQuizForm && (
              <p className="text-sm text-muted-foreground">No quizzes yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
