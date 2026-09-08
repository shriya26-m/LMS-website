// User types
export type UserRole = 'admin' | 'instructor' | 'student';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  bio?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

// Course types
export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructorId: User | string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  isPublished: boolean;
  enrolledStudents: string[];
  totalLessons: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Lesson types
export interface Lesson {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  pdfUrl?: string;
  duration?: number;
  order: number;
  isFree: boolean;
  createdAt: string;
}

// Assignment types
export interface Assignment {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string;
  maxScore: number;
  createdAt: string;
}

// Submission types
export interface Submission {
  _id: string;
  assignmentId: Assignment | string;
  studentId: User | string;
  fileUrl?: string;
  textContent?: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded';
  submittedAt: string;
  gradedAt?: string;
}

// Progress types
export interface Progress {
  _id: string;
  studentId: string;
  courseId: Course | string;
  completedLessons: string[];
  progressPercent: number;
  isCompleted: boolean;
  completedAt?: string;
  updatedAt: string;
}

// Certificate types
export interface Certificate {
  _id: string;
  studentId: User | string;
  courseId: Course | string;
  issueDate: string;
  certificateCode: string;
  certificateUrl?: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}