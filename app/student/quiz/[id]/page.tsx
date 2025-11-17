'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Question {
  id: string;
  type: 'single' | 'multi' | 'text';
  question: string;
  options?: string[];
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [attemptId, setAttemptId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [existingAttempt, setExistingAttempt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        // Load quiz details
        const quizResponse = await fetch(`/api/quizzes?quizId=${params.id}`);
        if (quizResponse.ok) {
          const data = await quizResponse.json();
          if (data.data.length > 0) {
            const q = data.data[0];
            setQuiz(q);
            
            // Handle questions whether they're an array or a JSON string
            let parsedQuestions = [];
            if (Array.isArray(q.questions)) {
              parsedQuestions = q.questions;
            } else if (typeof q.questions === 'string') {
              try {
                parsedQuestions = JSON.parse(q.questions);
              } catch {
                parsedQuestions = [];
              }
            }
            
            setQuestions(parsedQuestions);
            setAnswers(new Array(parsedQuestions.length).fill(null));
          }
        }

        // Check if student already has a submission for this quiz
        const submissionsResponse = await fetch(`/api/quizzes/submissions?quizId=${params.id}`);
        if (submissionsResponse.ok) {
          const submissionsData = await submissionsResponse.json();
          if (submissionsData.data && submissionsData.data.length > 0) {
            const attempt = submissionsData.data[0];
            setHasAttempted(true);
            setExistingAttempt(attempt);
            setSubmitted(true);
            setScore(attempt.score);
          }
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [params.id]);

  const handleStartQuiz = async () => {
    // Prevent starting if already attempted
    if (hasAttempted) {
      alert('You have already submitted this quiz. You can only submit once.');
      return;
    }

    try {
      const response = await fetch(`/api/quizzes/${params.id}/start`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setAttemptId(data.data.attemptId);
        setTimeLeft(data.data.timeLimitMinutes * 60);
        setIsStarted(true);
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  };

  useEffect(() => {
    if (!isStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/quizzes/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, answers }),
      });

      if (response.ok) {
        const data = await response.json();
        setScore(data.data.score);
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz) return <div className="p-4">Loading quiz...</div>;
  if (isLoading) return <div className="p-4">Checking your submission status...</div>;

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
            <CardTitle>{quiz.title}</CardTitle>
            <CardDescription>
              {quiz.time_limit_minutes} minute quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isStarted ? (
              <div className="text-center space-y-4">
                {hasAttempted ? (
                  <>
                    <p className="text-2xl font-bold">Quiz Already Submitted</p>
                    <p className="text-muted-foreground">
                      You have already submitted this quiz. You can only submit once per quiz.
                    </p>
                    {score !== null ? (
                      <>
                        <div className="p-6 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                          <p className="text-4xl font-bold text-primary">{score}%</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-lg font-semibold text-orange-500">
                        Awaiting Teacher Grade
                      </p>
                    )}
                    <Button onClick={() => router.back()}>
                      Back to Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground">
                      This quiz has {questions.length} questions.
                    </p>
                    <Button onClick={handleStartQuiz} size="lg">
                      Start Quiz
                    </Button>
                  </>
                )}
              </div>
            ) : submitted ? (
              <div className="text-center space-y-4">
                <p className="text-2xl font-bold">Quiz Submitted Successfully</p>
                <p className="text-muted-foreground">Your answers have been submitted. Your teacher will grade this quiz and you will see your score soon.</p>
                <Button onClick={() => router.back()}>
                  Back to Dashboard
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center p-4 bg-muted rounded">
                  <span className="font-semibold">Time Remaining:</span>
                  <span className="text-2xl font-mono text-primary">
                    {formatTime(timeLeft)}
                  </span>
                </div>

                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="p-4 border rounded">
                      <p className="font-semibold mb-4">
                        {index + 1}. {question.question}
                      </p>

                      {question.type === 'short_answer' && (
                        <input
                          type="text"
                          placeholder="Enter your answer..."
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          value={answers[index] || ''}
                          onChange={(e) => {
                            const newAnswers = [...answers];
                            newAnswers[index] = e.target.value;
                            setAnswers(newAnswers);
                          }}
                        />
                      )}

                      {question.type === 'text' && (
                        <textarea
                          placeholder="Enter your answer..."
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={4}
                          value={answers[index] || ''}
                          onChange={(e) => {
                            const newAnswers = [...answers];
                            newAnswers[index] = e.target.value;
                            setAnswers(newAnswers);
                          }}
                        />
                      )}

                      {question.type === 'single' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <label key={optIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`question-${index}`}
                                checked={answers[index] === optIndex}
                                onChange={() => {
                                  const newAnswers = [...answers];
                                  newAnswers[index] = optIndex;
                                  setAnswers(newAnswers);
                                }}
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === 'multi' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <label key={optIndex} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={Array.isArray(answers[index]) && answers[index].includes(optIndex)}
                                onChange={(e) => {
                                  const newAnswers = [...answers];
                                  if (!Array.isArray(newAnswers[index])) {
                                    newAnswers[index] = [];
                                  }
                                  if (e.target.checked) {
                                    newAnswers[index].push(optIndex);
                                  } else {
                                    newAnswers[index] = newAnswers[index].filter((i: number) => i !== optIndex);
                                  }
                                  setAnswers(newAnswers);
                                }}
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
