import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Schema imports
import {
  createUserInputSchema,
  updateUserInputSchema,
  createCourseInputSchema,
  updateCourseInputSchema,
  createLessonInputSchema,
  updateLessonInputSchema,
  createEnrollmentInputSchema,
  updateProgressInputSchema,
  createAssignmentInputSchema,
  submitAssignmentInputSchema,
  gradeAssignmentInputSchema,
  uploadMaterialInputSchema,
  loginInputSchema
} from './schema';

// Handler imports
// User management
import { createUser } from './handlers/create_user';
import { getUsers } from './handlers/get_users';
import { getUserById } from './handlers/get_user_by_id';
import { updateUser } from './handlers/update_user';
import { authenticateUser } from './handlers/authenticate_user';

// Course management
import { createCourse } from './handlers/create_course';
import { getCourses } from './handlers/get_courses';
import { getCourseById } from './handlers/get_course_by_id';
import { updateCourse } from './handlers/update_course';
import { deleteCourse } from './handlers/delete_course';

// Lesson management
import { createLesson } from './handlers/create_lesson';
import { getLessons } from './handlers/get_lessons';
import { getLessonById } from './handlers/get_lesson_by_id';
import { updateLesson } from './handlers/update_lesson';
import { deleteLesson } from './handlers/delete_lesson';

// Enrollment management
import { createEnrollment } from './handlers/create_enrollment';
import { getEnrollments } from './handlers/get_enrollments';
import { deactivateEnrollment } from './handlers/deactivate_enrollment';

// Progress tracking
import { updateProgress } from './handlers/update_progress';
import { getStudentProgress } from './handlers/get_student_progress';
import { getCourseProgress } from './handlers/get_course_progress';

// Assignment management
import { createAssignment } from './handlers/create_assignment';
import { getAssignments } from './handlers/get_assignments';
import { submitAssignment } from './handlers/submit_assignment';
import { gradeAssignment } from './handlers/grade_assignment';
import { getSubmissions } from './handlers/get_submissions';

// Educational materials
import { uploadMaterial } from './handlers/upload_material';
import { getMaterials } from './handlers/get_materials';
import { deleteMaterial } from './handlers/delete_material';

// Dashboard and analytics
import { getDashboardStats } from './handlers/get_dashboard_stats';
import { logActivity } from './handlers/log_activity';
import { getActivityLogs } from './handlers/get_activity_logs';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => authenticateUser(input)),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),

  getUsers: publicProcedure
    .query(() => getUsers()),

  getUserById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getUserById(input.id)),

  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),

  // Course management
  createCourse: publicProcedure
    .input(createCourseInputSchema)
    .mutation(({ input }) => createCourse(input, 1)), // TODO: Replace with actual user ID from context

  getCourses: publicProcedure
    .input(z.object({ userId: z.number().optional() }))
    .query(({ input }) => getCourses(input.userId)),

  getCourseById: publicProcedure
    .input(z.object({ id: z.number(), userId: z.number().optional() }))
    .query(({ input }) => getCourseById(input.id, input.userId)),

  updateCourse: publicProcedure
    .input(updateCourseInputSchema)
    .mutation(({ input }) => updateCourse(input, 1)), // TODO: Replace with actual user ID from context

  deleteCourse: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteCourse(input.id, 1)), // TODO: Replace with actual user ID from context

  // Lesson management
  createLesson: publicProcedure
    .input(createLessonInputSchema)
    .mutation(({ input }) => createLesson(input, 1)), // TODO: Replace with actual user ID from context

  getLessons: publicProcedure
    .input(z.object({ courseId: z.number(), userId: z.number().optional() }))
    .query(({ input }) => getLessons(input.courseId, input.userId)),

  getLessonById: publicProcedure
    .input(z.object({ id: z.number(), userId: z.number().optional() }))
    .query(({ input }) => getLessonById(input.id, input.userId)),

  updateLesson: publicProcedure
    .input(updateLessonInputSchema)
    .mutation(({ input }) => updateLesson(input, 1)), // TODO: Replace with actual user ID from context

  deleteLesson: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteLesson(input.id, 1)), // TODO: Replace with actual user ID from context

  // Enrollment management
  createEnrollment: publicProcedure
    .input(createEnrollmentInputSchema)
    .mutation(({ input }) => createEnrollment(input)),

  getEnrollments: publicProcedure
    .input(z.object({ courseId: z.number().optional(), studentId: z.number().optional() }))
    .query(({ input }) => getEnrollments(input.courseId, input.studentId)),

  deactivateEnrollment: publicProcedure
    .input(z.object({ courseId: z.number(), studentId: z.number() }))
    .mutation(({ input }) => deactivateEnrollment(input.courseId, input.studentId)),

  // Progress tracking
  updateProgress: publicProcedure
    .input(updateProgressInputSchema)
    .mutation(({ input }) => updateProgress(input)),

  getStudentProgress: publicProcedure
    .input(z.object({ studentId: z.number(), courseId: z.number().optional() }))
    .query(({ input }) => getStudentProgress(input.studentId, input.courseId)),

  getCourseProgress: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(({ input }) => getCourseProgress(input.courseId, 1)), // TODO: Replace with actual user ID from context

  // Assignment management
  createAssignment: publicProcedure
    .input(createAssignmentInputSchema)
    .mutation(({ input }) => createAssignment(input, 1)), // TODO: Replace with actual user ID from context

  getAssignments: publicProcedure
    .input(z.object({ lessonId: z.number(), userId: z.number().optional() }))
    .query(({ input }) => getAssignments(input.lessonId, input.userId)),

  submitAssignment: publicProcedure
    .input(submitAssignmentInputSchema)
    .mutation(({ input }) => submitAssignment(input, 1)), // TODO: Replace with actual student ID from context

  gradeAssignment: publicProcedure
    .input(gradeAssignmentInputSchema)
    .mutation(({ input }) => gradeAssignment(input, 1)), // TODO: Replace with actual user ID from context

  getSubmissions: publicProcedure
    .input(z.object({ assignmentId: z.number() }))
    .query(({ input }) => getSubmissions(input.assignmentId, 1)), // TODO: Replace with actual user ID from context

  // Educational materials
  uploadMaterial: publicProcedure
    .input(uploadMaterialInputSchema)
    .mutation(({ input }) => uploadMaterial(input, 1)), // TODO: Replace with actual user ID from context

  getMaterials: publicProcedure
    .input(z.object({ lessonId: z.number(), userId: z.number().optional() }))
    .query(({ input }) => getMaterials(input.lessonId, input.userId)),

  deleteMaterial: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteMaterial(input.id, 1)), // TODO: Replace with actual user ID from context

  // Dashboard and analytics
  getDashboardStats: publicProcedure
    .query(() => getDashboardStats(1)), // TODO: Replace with actual user ID from context

  logActivity: publicProcedure
    .input(z.object({
      action: z.string(),
      resourceType: z.string().optional(),
      resourceId: z.number().optional(),
      details: z.string().optional()
    }))
    .mutation(({ input }) => logActivity(
      1, // TODO: Replace with actual user ID from context
      input.action,
      input.resourceType,
      input.resourceId,
      input.details
    )),

  getActivityLogs: publicProcedure
    .input(z.object({ userId: z.number().optional(), limit: z.number().optional() }))
    .query(({ input }) => getActivityLogs(input.userId, input.limit)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();