import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const COURSES_FILE = path.join(DATA_DIR, 'courses.json');
const QUIZZES_FILE = path.join(DATA_DIR, 'quizzes.json');
const ASSIGNMENTS_FILE = path.join(DATA_DIR, 'assignments.json');
const ATTEMPTS_FILE = path.join(DATA_DIR, 'attempts.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load data from file or return empty array
function loadFromFile(filePath: string): any[] {
  try {
    ensureDataDir();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
  return [];
}

// Save data to file
function saveToFile(filePath: string, data: any) {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error saving to ${filePath}:`, error);
  }
}

// Courses
export const coursesStore: Map<string, any> = new Map();
function loadCourses() {
  const data = loadFromFile(COURSES_FILE);
  data.forEach((course: any) => coursesStore.set(course.id, course));
}
export function saveCourses() {
  const data = Array.from(coursesStore.values());
  saveToFile(COURSES_FILE, data);
}

// Quizzes
export const quizzesStore: Map<string, any> = new Map();
function loadQuizzes() {
  const data = loadFromFile(QUIZZES_FILE);
  data.forEach((quiz: any) => quizzesStore.set(quiz.id, quiz));
}
export function saveQuizzes() {
  const data = Array.from(quizzesStore.values());
  saveToFile(QUIZZES_FILE, data);
}

// Assignments
export const assignmentsStore: Map<string, any> = new Map();
function loadAssignments() {
  const data = loadFromFile(ASSIGNMENTS_FILE);
  data.forEach((assignment: any) => assignmentsStore.set(assignment.id, assignment));
}
export function saveAssignments() {
  const data = Array.from(assignmentsStore.values());
  saveToFile(ASSIGNMENTS_FILE, data);
}

// Quiz Attempts
export const quizAttemptsStore: Map<string, any> = new Map();
function loadAttempts() {
  const data = loadFromFile(ATTEMPTS_FILE);
  data.forEach((attempt: any) => quizAttemptsStore.set(attempt.id, attempt));
}
export function saveAttempts() {
  const data = Array.from(quizAttemptsStore.values());
  saveToFile(ATTEMPTS_FILE, data);
}

// Assignment Submissions
export const submissionsStore: Map<string, any> = new Map();
function loadSubmissions() {
  const data = loadFromFile(SUBMISSIONS_FILE);
  data.forEach((submission: any) => submissionsStore.set(submission.id, submission));
}
export function saveSubmissions() {
  const data = Array.from(submissionsStore.values());
  saveToFile(SUBMISSIONS_FILE, data);
}

// ID counters
export let courseIdCounter = 1;
export let quizIdCounter = 1;
export let assignmentIdCounter = 1;
export let quizAttemptIdCounter = 1;
export let submissionIdCounter = 1;

// Track if storage has been initialized
let isInitialized = false;

// Initialize all data on startup
export function initializeStorage() {
  if (isInitialized) return; // Skip if already initialized
  isInitialized = true;
  
  loadCourses();
  loadQuizzes();
  loadAssignments();
  loadAttempts();
  loadSubmissions();
  
  // Set counters based on existing data
  if (coursesStore.size > 0) {
    courseIdCounter = Math.max(...Array.from(coursesStore.values()).map((c: any) => {
      const match = c.id.match(/course_(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })) + 1;
  }
  
  if (quizzesStore.size > 0) {
    quizIdCounter = Math.max(...Array.from(quizzesStore.values()).map((q: any) => {
      const match = q.id.match(/quiz_(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })) + 1;
  }
  
  if (assignmentsStore.size > 0) {
    assignmentIdCounter = Math.max(...Array.from(assignmentsStore.values()).map((a: any) => {
      const match = a.id.match(/assignment_(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })) + 1;
  }
  
  if (quizAttemptsStore.size > 0) {
    quizAttemptIdCounter = Math.max(...Array.from(quizAttemptsStore.values()).map((a: any) => {
      const match = a.id.match(/attempt_(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })) + 1;
  }

  if (submissionsStore.size > 0) {
    submissionIdCounter = Math.max(...Array.from(submissionsStore.values()).map((s: any) => {
      const match = s.id.match(/submission_(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })) + 1;
  }
  
  console.log('Storage initialized');
}

export function incrementCourseId() {
  const id = courseIdCounter++;
  saveCourses();
  return id;
}

export function incrementQuizId() {
  const id = quizIdCounter++;
  saveQuizzes();
  return id;
}

export function incrementAssignmentId() {
  const id = assignmentIdCounter++;
  saveAssignments();
  return id;
}

export function incrementQuizAttemptId() {
  const id = quizAttemptIdCounter++;
  saveAttempts();
  return id;
}

export function incrementSubmissionId() {
  const id = submissionIdCounter++;
  saveSubmissions();
  return id;
}
