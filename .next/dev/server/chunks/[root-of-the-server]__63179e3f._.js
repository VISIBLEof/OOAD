module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/OOAD Project/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAuthCookie",
    ()=>clearAuthCookie,
    "createToken",
    ()=>createToken,
    "getAuthToken",
    ()=>getAuthToken,
    "getCurrentUser",
    ()=>getCurrentUser,
    "setAuthCookie",
    ()=>setAuthCookie,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OOAD Project/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OOAD Project/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OOAD Project/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production');
async function createToken(userId, email, role) {
    const token = await new __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"]({
        userId,
        email,
        role
    }).setProtectedHeader({
        alg: 'HS256'
    }).setExpirationTime('7d').sign(JWT_SECRET);
    return token;
}
async function verifyToken(token) {
    try {
        const verified = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, JWT_SECRET);
        return verified.payload;
    } catch (error) {
        return null;
    }
}
async function setAuthCookie(token) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60
    });
}
async function getAuthToken() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const token = cookieStore.get('auth-token')?.value;
        console.log('getAuthToken - found token:', token ? 'yes' : 'no');
        return token;
    } catch (err) {
        console.log('getAuthToken - cookies() error:', err);
        return null;
    }
}
async function getCurrentUser() {
    try {
        const token = await getAuthToken();
        console.log('getCurrentUser - token from cookie:', token ? 'yes' : 'no');
        if (!token) return null;
        const verified = await verifyToken(token);
        console.log('getCurrentUser - verified:', verified ? 'yes' : 'no');
        return verified;
    } catch (err) {
        console.log('getCurrentUser - error:', err);
        return null;
    }
}
async function clearAuthCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete('auth-token');
}
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/OOAD Project/lib/storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assignmentIdCounter",
    ()=>assignmentIdCounter,
    "assignmentsStore",
    ()=>assignmentsStore,
    "courseIdCounter",
    ()=>courseIdCounter,
    "coursesStore",
    ()=>coursesStore,
    "incrementAssignmentId",
    ()=>incrementAssignmentId,
    "incrementCourseId",
    ()=>incrementCourseId,
    "incrementQuizAttemptId",
    ()=>incrementQuizAttemptId,
    "incrementQuizId",
    ()=>incrementQuizId,
    "incrementSubmissionId",
    ()=>incrementSubmissionId,
    "initializeStorage",
    ()=>initializeStorage,
    "quizAttemptIdCounter",
    ()=>quizAttemptIdCounter,
    "quizAttemptsStore",
    ()=>quizAttemptsStore,
    "quizIdCounter",
    ()=>quizIdCounter,
    "quizzesStore",
    ()=>quizzesStore,
    "saveAssignments",
    ()=>saveAssignments,
    "saveAttempts",
    ()=>saveAttempts,
    "saveCourses",
    ()=>saveCourses,
    "saveQuizzes",
    ()=>saveQuizzes,
    "saveSubmissions",
    ()=>saveSubmissions,
    "submissionIdCounter",
    ()=>submissionIdCounter,
    "submissionsStore",
    ()=>submissionsStore
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '.data');
const COURSES_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'courses.json');
const QUIZZES_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'quizzes.json');
const ASSIGNMENTS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'assignments.json');
const ATTEMPTS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'attempts.json');
const SUBMISSIONS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'submissions.json');
// Ensure data directory exists
function ensureDataDir() {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DATA_DIR)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(DATA_DIR, {
            recursive: true
        });
    }
}
// Load data from file or return empty array
function loadFromFile(filePath) {
    try {
        ensureDataDir();
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(filePath)) {
            const data = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
    return [];
}
// Save data to file
function saveToFile(filePath, data) {
    try {
        ensureDataDir();
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error saving to ${filePath}:`, error);
    }
}
const coursesStore = new Map();
function loadCourses() {
    const data = loadFromFile(COURSES_FILE);
    data.forEach((course)=>coursesStore.set(course.id, course));
}
function saveCourses() {
    const data = Array.from(coursesStore.values());
    saveToFile(COURSES_FILE, data);
}
const quizzesStore = new Map();
function loadQuizzes() {
    const data = loadFromFile(QUIZZES_FILE);
    data.forEach((quiz)=>quizzesStore.set(quiz.id, quiz));
}
function saveQuizzes() {
    const data = Array.from(quizzesStore.values());
    saveToFile(QUIZZES_FILE, data);
}
const assignmentsStore = new Map();
function loadAssignments() {
    const data = loadFromFile(ASSIGNMENTS_FILE);
    data.forEach((assignment)=>assignmentsStore.set(assignment.id, assignment));
}
function saveAssignments() {
    const data = Array.from(assignmentsStore.values());
    saveToFile(ASSIGNMENTS_FILE, data);
}
const quizAttemptsStore = new Map();
function loadAttempts() {
    const data = loadFromFile(ATTEMPTS_FILE);
    data.forEach((attempt)=>quizAttemptsStore.set(attempt.id, attempt));
}
function saveAttempts() {
    const data = Array.from(quizAttemptsStore.values());
    saveToFile(ATTEMPTS_FILE, data);
}
const submissionsStore = new Map();
function loadSubmissions() {
    const data = loadFromFile(SUBMISSIONS_FILE);
    data.forEach((submission)=>submissionsStore.set(submission.id, submission));
}
function saveSubmissions() {
    const data = Array.from(submissionsStore.values());
    saveToFile(SUBMISSIONS_FILE, data);
}
let courseIdCounter = 1;
let quizIdCounter = 1;
let assignmentIdCounter = 1;
let quizAttemptIdCounter = 1;
let submissionIdCounter = 1;
// Track if storage has been initialized
let isInitialized = false;
function initializeStorage() {
    if (isInitialized) return; // Skip if already initialized
    isInitialized = true;
    loadCourses();
    loadQuizzes();
    loadAssignments();
    loadAttempts();
    loadSubmissions();
    // Set counters based on existing data
    if (coursesStore.size > 0) {
        courseIdCounter = Math.max(...Array.from(coursesStore.values()).map((c)=>{
            const match = c.id.match(/course_(\d+)/);
            return match ? parseInt(match[1]) : 0;
        })) + 1;
    }
    if (quizzesStore.size > 0) {
        quizIdCounter = Math.max(...Array.from(quizzesStore.values()).map((q)=>{
            const match = q.id.match(/quiz_(\d+)/);
            return match ? parseInt(match[1]) : 0;
        })) + 1;
    }
    if (assignmentsStore.size > 0) {
        assignmentIdCounter = Math.max(...Array.from(assignmentsStore.values()).map((a)=>{
            const match = a.id.match(/assignment_(\d+)/);
            return match ? parseInt(match[1]) : 0;
        })) + 1;
    }
    if (quizAttemptsStore.size > 0) {
        quizAttemptIdCounter = Math.max(...Array.from(quizAttemptsStore.values()).map((a)=>{
            const match = a.id.match(/attempt_(\d+)/);
            return match ? parseInt(match[1]) : 0;
        })) + 1;
    }
    if (submissionsStore.size > 0) {
        submissionIdCounter = Math.max(...Array.from(submissionsStore.values()).map((s)=>{
            const match = s.id.match(/submission_(\d+)/);
            return match ? parseInt(match[1]) : 0;
        })) + 1;
    }
    console.log('Storage initialized');
}
function incrementCourseId() {
    const id = courseIdCounter++;
    saveCourses();
    return id;
}
function incrementQuizId() {
    const id = quizIdCounter++;
    saveQuizzes();
    return id;
}
function incrementAssignmentId() {
    const id = assignmentIdCounter++;
    saveAssignments();
    return id;
}
function incrementQuizAttemptId() {
    const id = quizAttemptIdCounter++;
    saveAttempts();
    return id;
}
function incrementSubmissionId() {
    const id = submissionIdCounter++;
    saveSubmissions();
    return id;
}
}),
"[project]/OOAD Project/app/api/quizzes/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OOAD Project/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f40$vercel$2f$postgres$2f$dist$2f$index$2d$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OOAD Project/node_modules/@vercel/postgres/dist/index-node.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f40$vercel$2f$postgres$2f$dist$2f$chunk$2d$7IR77QAQ$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OOAD Project/node_modules/@vercel/postgres/dist/chunk-7IR77QAQ.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OOAD Project/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OOAD Project/lib/storage.ts [app-route] (ecmascript)");
;
;
;
;
// Initialize storage on module load
(0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initializeStorage"])();
async function GET(request) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const searchParams = request.nextUrl.searchParams;
        const courseId = searchParams.get('courseId');
        // Try database first, fall back to in-memory
        try {
            if (courseId) {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f40$vercel$2f$postgres$2f$dist$2f$chunk$2d$7IR77QAQ$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["sql"]`
          SELECT id, course_id, title, questions, time_limit_minutes, due_date, created_at 
          FROM quizzes
          WHERE course_id = ${courseId}
          ORDER BY due_date ASC
        `;
                return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    data: result.rows
                });
            }
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f40$vercel$2f$postgres$2f$dist$2f$chunk$2d$7IR77QAQ$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["sql"]`
        SELECT id, course_id, title, questions, time_limit_minutes, due_date, created_at 
        FROM quizzes
        ORDER BY due_date ASC
      `;
            return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: result.rows
            });
        } catch (dbError) {
            // Database not available, return in-memory quizzes
            const quizzes = Array.from(__TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["quizzesStore"].values());
            if (courseId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    data: quizzes.filter((q)=>q.course_id === courseId)
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: quizzes
            });
        }
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch quizzes'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const { courseId, title, questions, timeLimitMinutes = 60, dueDate } = await request.json();
        if (!courseId || !title) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Missing courseId or title'
            }, {
                status: 400
            });
        }
        // Check if course exists in memory first, then try database
        let courseExists = __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coursesStore"].has(courseId);
        if (!courseExists) {
            try {
                const courseCheck = await __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f40$vercel$2f$postgres$2f$dist$2f$chunk$2d$7IR77QAQ$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["sql"]`
          SELECT id FROM courses WHERE id = ${courseId}
        `;
                courseExists = courseCheck.rows.length > 0;
            } catch  {
                // If database fails, allow creation anyway (development mode)
                console.warn('Could not verify course in database, allowing quiz creation');
                courseExists = true;
            }
        }
        if (!courseExists) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Course not found'
            }, {
                status: 404
            });
        }
        // Try database first, fall back to in-memory storage
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f40$vercel$2f$postgres$2f$dist$2f$chunk$2d$7IR77QAQ$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["sql"]`
        INSERT INTO quizzes (course_id, title, questions, time_limit_minutes, due_date)
        VALUES (${courseId}, ${title}, ${JSON.stringify(questions)}, ${timeLimitMinutes}, ${dueDate})
        RETURNING id, course_id, title, questions, time_limit_minutes, due_date, created_at
      `;
            return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: result.rows[0]
            }, {
                status: 201
            });
        } catch (dbError) {
            console.log('Database error, using in-memory storage:', dbError.message);
            // Use in-memory storage instead
            const quizId = `quiz_${(0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["incrementQuizId"])()}`;
            const quiz = {
                id: quizId,
                course_id: courseId,
                title,
                questions: Array.isArray(questions) ? questions : [
                    questions
                ],
                time_limit_minutes: timeLimitMinutes,
                due_date: dueDate,
                created_at: new Date().toISOString()
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["quizzesStore"].set(quizId, quiz);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveQuizzes"])();
            console.log('Quiz created in memory:', quizId);
            return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: quiz
            }, {
                status: 201
            });
        }
    } catch (error) {
        console.error('Quiz POST error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to create quiz'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__63179e3f._.js.map