import { serial, text, pgTable, timestamp, boolean, integer, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['administrator', 'student']);
export const lessonContentTypeEnum = pgEnum('lesson_content_type', ['text', 'video', 'file', 'test']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  role: userRoleEnum('role').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Courses table
export const coursesTable = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'), // Nullable
  is_published: boolean('is_published').notNull().default(false),
  is_private: boolean('is_private').notNull().default(false),
  owner_id: integer('owner_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Lessons table
export const lessonsTable = pgTable('lessons', {
  id: serial('id').primaryKey(),
  course_id: integer('course_id').notNull().references(() => coursesTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content_type: lessonContentTypeEnum('content_type').notNull(),
  content_data: text('content_data'), // JSON string containing lesson content
  order_index: integer('order_index').notNull(),
  is_published: boolean('is_published').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Course enrollments table
export const courseEnrollmentsTable = pgTable('course_enrollments', {
  id: serial('id').primaryKey(),
  course_id: integer('course_id').notNull().references(() => coursesTable.id, { onDelete: 'cascade' }),
  student_id: integer('student_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  enrolled_at: timestamp('enrolled_at').defaultNow().notNull(),
  is_active: boolean('is_active').notNull().default(true),
});

// Student progress table
export const studentProgressTable = pgTable('student_progress', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  lesson_id: integer('lesson_id').notNull().references(() => lessonsTable.id, { onDelete: 'cascade' }),
  is_completed: boolean('is_completed').notNull().default(false),
  completion_date: timestamp('completion_date'), // Nullable
  score: numeric('score', { precision: 5, scale: 2 }), // Nullable, for test scores
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Assignments table
export const assignmentsTable = pgTable('assignments', {
  id: serial('id').primaryKey(),
  lesson_id: integer('lesson_id').notNull().references(() => lessonsTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'), // Nullable
  due_date: timestamp('due_date'), // Nullable
  max_score: numeric('max_score', { precision: 5, scale: 2 }).notNull(),
  is_auto_graded: boolean('is_auto_graded').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Assignment submissions table
export const assignmentSubmissionsTable = pgTable('assignment_submissions', {
  id: serial('id').primaryKey(),
  assignment_id: integer('assignment_id').notNull().references(() => assignmentsTable.id, { onDelete: 'cascade' }),
  student_id: integer('student_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  content: text('content'), // Text submission or file reference
  submitted_at: timestamp('submitted_at').defaultNow().notNull(),
  score: numeric('score', { precision: 5, scale: 2 }), // Nullable
  feedback: text('feedback'), // Nullable
  is_graded: boolean('is_graded').notNull().default(false),
});

// Educational materials table
export const educationalMaterialsTable = pgTable('educational_materials', {
  id: serial('id').primaryKey(),
  lesson_id: integer('lesson_id').notNull().references(() => lessonsTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  file_path: text('file_path').notNull(),
  file_type: text('file_type').notNull(),
  file_size: integer('file_size').notNull(),
  uploaded_at: timestamp('uploaded_at').defaultNow().notNull(),
});

// Activity logs table
export const activityLogsTable = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  resource_type: text('resource_type'), // Nullable
  resource_id: integer('resource_id'), // Nullable
  details: text('details'), // JSON string for additional context
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  ownedCourses: many(coursesTable),
  enrollments: many(courseEnrollmentsTable),
  progress: many(studentProgressTable),
  submissions: many(assignmentSubmissionsTable),
  activityLogs: many(activityLogsTable),
}));

export const coursesRelations = relations(coursesTable, ({ one, many }) => ({
  owner: one(usersTable, {
    fields: [coursesTable.owner_id],
    references: [usersTable.id],
  }),
  lessons: many(lessonsTable),
  enrollments: many(courseEnrollmentsTable),
}));

export const lessonsRelations = relations(lessonsTable, ({ one, many }) => ({
  course: one(coursesTable, {
    fields: [lessonsTable.course_id],
    references: [coursesTable.id],
  }),
  progress: many(studentProgressTable),
  assignments: many(assignmentsTable),
  materials: many(educationalMaterialsTable),
}));

export const courseEnrollmentsRelations = relations(courseEnrollmentsTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [courseEnrollmentsTable.course_id],
    references: [coursesTable.id],
  }),
  student: one(usersTable, {
    fields: [courseEnrollmentsTable.student_id],
    references: [usersTable.id],
  }),
}));

export const studentProgressRelations = relations(studentProgressTable, ({ one }) => ({
  student: one(usersTable, {
    fields: [studentProgressTable.student_id],
    references: [usersTable.id],
  }),
  lesson: one(lessonsTable, {
    fields: [studentProgressTable.lesson_id],
    references: [lessonsTable.id],
  }),
}));

export const assignmentsRelations = relations(assignmentsTable, ({ one, many }) => ({
  lesson: one(lessonsTable, {
    fields: [assignmentsTable.lesson_id],
    references: [lessonsTable.id],
  }),
  submissions: many(assignmentSubmissionsTable),
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissionsTable, ({ one }) => ({
  assignment: one(assignmentsTable, {
    fields: [assignmentSubmissionsTable.assignment_id],
    references: [assignmentsTable.id],
  }),
  student: one(usersTable, {
    fields: [assignmentSubmissionsTable.student_id],
    references: [usersTable.id],
  }),
}));

export const educationalMaterialsRelations = relations(educationalMaterialsTable, ({ one }) => ({
  lesson: one(lessonsTable, {
    fields: [educationalMaterialsTable.lesson_id],
    references: [lessonsTable.id],
  }),
}));

export const activityLogsRelations = relations(activityLogsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [activityLogsTable.user_id],
    references: [usersTable.id],
  }),
}));

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  courses: coursesTable,
  lessons: lessonsTable,
  courseEnrollments: courseEnrollmentsTable,
  studentProgress: studentProgressTable,
  assignments: assignmentsTable,
  assignmentSubmissions: assignmentSubmissionsTable,
  educationalMaterials: educationalMaterialsTable,
  activityLogs: activityLogsTable,
};