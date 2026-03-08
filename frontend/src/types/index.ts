// src/types/index.ts
export interface User {
  user_id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  created_at: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Course {
  course_id: string;
  title: string;
  description: string;
  category: string;
  instructor_id: string;
  instructor_name?: string;
}

export interface Enrollment {
  student_id: string;
  course_id: string;
  enrollment_date: string;
  progress_percentage: number;
  completion_status: 'not_started' | 'in_progress' | 'completed';
  course?: Course;
}

export interface Assignment {
  assignment_id: string;
  course_id: string;
  title: string;
  due_date: string;
  total_marks: number;
  course_title?: string;
}

export interface Submission {
  submission_id: string;
  assignment_id: string;
  student_id: string;
  submission_date: string;
  marks_obtained: number | null;
  feedback: string | null;
  assignment?: Assignment;
}

export interface Certificate {
  certificate_id: string;
  student_id: string;
  course_id: string;
  issue_date: string;
  certificate_url: string;
  course_title?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  name: string;
  role: 'student' | 'instructor';
}

export interface AuthResponse {
  token: string;
  user: User;
}