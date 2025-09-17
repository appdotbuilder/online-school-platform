import { z } from 'zod';

// User role enum
export const userRoleSchema = z.enum(['administrator', 'student']);
export type UserRole = z.infer<typeof userRoleSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password_hash: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  role: userRoleSchema,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Course schema
export const courseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  is_published: z.boolean(),
  is_private: z.boolean(),
  owner_id: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Course = z.infer<typeof courseSchema>;

// Lesson content type enum
export const lessonContentTypeSchema = z.enum(['text', 'video', 'file', 'test']);
export type LessonContentType = z.infer<typeof lessonContentTypeSchema>;

// Lesson schema
export const lessonSchema = z.object({
  id: z.number(),
  course_id: z.number(),
  title: z.string(),
  content_type: lessonContentTypeSchema,
  content_data: z.string().nullable(), // JSON string containing lesson content
  order_index: z.number().int(),
  is_published: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Lesson = z.infer<typeof lessonSchema>;

// Course enrollment schema
export const courseEnrollmentSchema = z.object({
  id: z.number(),
  course_id: z.number(),
  student_id: z.number(),
  enrolled_at: z.coerce.date(),
  is_active: z.boolean()
});

export type CourseEnrollment = z.infer<typeof courseEnrollmentSchema>;

// Student progress schema
export const studentProgressSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  lesson_id: z.number(),
  is_completed: z.boolean(),
  completion_date: z.coerce.date().nullable(),
  score: z.number().nullable(), // For test scores, null for other content types
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type StudentProgress = z.infer<typeof studentProgressSchema>;

// Assignment schema
export const assignmentSchema = z.object({
  id: z.number(),
  lesson_id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  due_date: z.coerce.date().nullable(),
  max_score: z.number(),
  is_auto_graded: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Assignment = z.infer<typeof assignmentSchema>;

// Assignment submission schema
export const assignmentSubmissionSchema = z.object({
  id: z.number(),
  assignment_id: z.number(),
  student_id: z.number(),
  content: z.string().nullable(), // Text submission or file reference
  submitted_at: z.coerce.date(),
  score: z.number().nullable(),
  feedback: z.string().nullable(),
  is_graded: z.boolean()
});

export type AssignmentSubmission = z.infer<typeof assignmentSubmissionSchema>;

// Educational material schema
export const educationalMaterialSchema = z.object({
  id: z.number(),
  lesson_id: z.number(),
  title: z.string(),
  file_path: z.string(),
  file_type: z.string(),
  file_size: z.number(),
  uploaded_at: z.coerce.date()
});

export type EducationalMaterial = z.infer<typeof educationalMaterialSchema>;

// Activity log schema
export const activityLogSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  action: z.string(),
  resource_type: z.string().nullable(),
  resource_id: z.number().nullable(),
  details: z.string().nullable(), // JSON string for additional context
  created_at: z.coerce.date()
});

export type ActivityLog = z.infer<typeof activityLogSchema>;

// Input schemas for creating entities

// Create user input
export const createUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  role: userRoleSchema
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// Update user input
export const updateUserInputSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  is_active: z.boolean().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Create course input
export const createCourseInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  is_published: z.boolean().optional(),
  is_private: z.boolean().optional()
});

export type CreateCourseInput = z.infer<typeof createCourseInputSchema>;

// Update course input
export const updateCourseInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  is_published: z.boolean().optional(),
  is_private: z.boolean().optional()
});

export type UpdateCourseInput = z.infer<typeof updateCourseInputSchema>;

// Create lesson input
export const createLessonInputSchema = z.object({
  course_id: z.number(),
  title: z.string().min(1),
  content_type: lessonContentTypeSchema,
  content_data: z.string().nullable().optional(),
  order_index: z.number().int().nonnegative()
});

export type CreateLessonInput = z.infer<typeof createLessonInputSchema>;

// Update lesson input
export const updateLessonInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  content_type: lessonContentTypeSchema.optional(),
  content_data: z.string().nullable().optional(),
  order_index: z.number().int().nonnegative().optional(),
  is_published: z.boolean().optional()
});

export type UpdateLessonInput = z.infer<typeof updateLessonInputSchema>;

// Create enrollment input
export const createEnrollmentInputSchema = z.object({
  course_id: z.number(),
  student_id: z.number()
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentInputSchema>;

// Update progress input
export const updateProgressInputSchema = z.object({
  student_id: z.number(),
  lesson_id: z.number(),
  is_completed: z.boolean(),
  score: z.number().nullable().optional()
});

export type UpdateProgressInput = z.infer<typeof updateProgressInputSchema>;

// Create assignment input
export const createAssignmentInputSchema = z.object({
  lesson_id: z.number(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  due_date: z.coerce.date().nullable().optional(),
  max_score: z.number().positive(),
  is_auto_graded: z.boolean()
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentInputSchema>;

// Submit assignment input
export const submitAssignmentInputSchema = z.object({
  assignment_id: z.number(),
  content: z.string().nullable().optional()
});

export type SubmitAssignmentInput = z.infer<typeof submitAssignmentInputSchema>;

// Grade assignment input
export const gradeAssignmentInputSchema = z.object({
  submission_id: z.number(),
  score: z.number(),
  feedback: z.string().nullable().optional()
});

export type GradeAssignmentInput = z.infer<typeof gradeAssignmentInputSchema>;

// Upload material input
export const uploadMaterialInputSchema = z.object({
  lesson_id: z.number(),
  title: z.string().min(1),
  file_path: z.string(),
  file_type: z.string(),
  file_size: z.number().positive()
});

export type UploadMaterialInput = z.infer<typeof uploadMaterialInputSchema>;

// Dashboard stats schema
export const dashboardStatsSchema = z.object({
  total_students: z.number(),
  total_courses: z.number(),
  active_enrollments: z.number(),
  new_enrollments_this_month: z.number(),
  total_lessons: z.number(),
  completed_assignments: z.number()
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Authentication schemas
export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string()
});

export type AuthResponse = z.infer<typeof authResponseSchema>;