-- Supabase / Postgres initialization SQL
-- Run this in the Supabase SQL editor for your project: https://app.supabase.com

-- Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table for authentication (used by the app's custom JWT flow)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Other application tables
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  teacher_id UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  max_points INT DEFAULT 100,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id),
  student_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT,
  grade INT,
  feedback TEXT,
  submitted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id),
  title TEXT NOT NULL,
  questions JSONB,
  time_limit_minutes INT DEFAULT 60,
  due_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id),
  student_id UUID NOT NULL REFERENCES public.users(id),
  answers JSONB,
  score INT,
  started_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  finished_at TIMESTAMP WITHOUT TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON public.courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON public.assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON public.quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student_id ON public.quiz_attempts(student_id);

-- Optional: a simple role for demo/test use (run only if you understand security implications)
-- INSERT INTO public.users (email, password_hash, name, role) VALUES ('student@example.com', '<bcrypt-hash>', 'Demo Student', 'student');
