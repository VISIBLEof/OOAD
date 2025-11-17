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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

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
    ()=>saveQuizzes
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
let courseIdCounter = 1;
let quizIdCounter = 1;
let assignmentIdCounter = 1;
let quizAttemptIdCounter = 1;
// Track if storage has been initialized
let isInitialized = false;
function initializeStorage() {
    if (isInitialized) return; // Skip if already initialized
    isInitialized = true;
    loadCourses();
    loadQuizzes();
    loadAssignments();
    loadAttempts();
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
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get('auth-token')?.value;
}
async function getCurrentUser() {
    const token = await getAuthToken();
    if (!token) return null;
    return verifyToken(token);
}
async function clearAuthCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete('auth-token');
}
}),
"[project]/OOAD Project/app/api/quizzes/submissions/[id]/grade/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OOAD Project/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OOAD Project/lib/storage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OOAD Project/lib/auth.ts [app-route] (ecmascript)");
;
;
;
async function POST(request, { params }) {
    try {
        // Verify user is authenticated and is a teacher
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const { score } = await request.json();
        // Validate score
        if (typeof score !== 'number' || score < 0 || score > 100) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Score must be a number between 0 and 100'
            }, {
                status: 400
            });
        }
        // Initialize storage
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initializeStorage"])();
        // Find and update the attempt
        const attempt = __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["quizAttemptsStore"].get(params.id);
        if (!attempt) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Submission not found'
            }, {
                status: 404
            });
        }
        // Update the score
        attempt.score = score;
        attempt.graded_at = new Date().toISOString();
        attempt.graded_by = user.email;
        __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["quizAttemptsStore"].set(params.id, attempt);
        // Save to file
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveAttempts"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(attempt);
    } catch (error) {
        console.error('Error grading submission:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$OOAD__Project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to grade submission'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fa9fc5de._.js.map