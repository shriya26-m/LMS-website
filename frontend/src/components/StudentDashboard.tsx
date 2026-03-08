// src/components/StudentDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Course, Enrollment, Assignment, Submission, Certificate } from '../types';
import { Book, CheckCircle, Clock, Award, TrendingUp, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        setTimeout(() => {
          setEnrollments([
            {
              student_id: user?.user_id || '1',
              course_id: '1',
              enrollment_date: '2024-01-15',
              progress_percentage: 75,
              completion_status: 'in_progress',
              course: {
                course_id: '1',
                title: 'React Fundamentals',
                description: 'Learn React from scratch',
                category: 'Programming',
                instructor_id: 'inst1',
                instructor_name: 'John Doe'
              }
            },
            {
              student_id: user?.user_id || '1',
              course_id: '2',
              enrollment_date: '2024-02-01',
              progress_percentage: 30,
              completion_status: 'in_progress',
              course: {
                course_id: '2',
                title: 'TypeScript Masterclass',
                description: 'Advanced TypeScript concepts',
                category: 'Programming',
                instructor_id: 'inst2',
                instructor_name: 'Jane Smith'
              }
            },
            {
              student_id: user?.user_id || '1',
              course_id: '3',
              enrollment_date: '2024-01-10',
              progress_percentage: 100,
              completion_status: 'completed',
              course: {
                course_id: '3',
                title: 'HTML & CSS Basics',
                description: 'Web development fundamentals',
                category: 'Web Development',
                instructor_id: 'inst1',
                instructor_name: 'John Doe'
              }
            }
          ]);

          setCertificates([
            {
              certificate_id: 'cert1',
              student_id: user?.user_id || '1',
              course_id: '3',
              issue_date: '2024-02-15',
              certificate_url: '#',
              course_title: 'HTML & CSS Basics'
            }
          ]);

          setAssignments([
            {
              assignment_id: 'asst1',
              course_id: '1',
              title: 'React Components Assignment',
              due_date: '2024-03-20',
              total_marks: 100,
              course_title: 'React Fundamentals'
            },
            {
              assignment_id: 'asst2',
              course_id: '2',
              title: 'TypeScript Types Exercise',
              due_date: '2024-03-25',
              total_marks: 50,
              course_title: 'TypeScript Masterclass'
            }
          ]);

          setSubmissions([
            {
              submission_id: 'sub1',
              assignment_id: 'asst1',
              student_id: user?.user_id || '1',
              submission_date: '2024-03-18',
              marks_obtained: 85,
              feedback: 'Good work!'
            }
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const progressData = [
    { month: 'Jan', progress: 20 },
    { month: 'Feb', progress: 45 },
    { month: 'Mar', progress: 65 },
    { month: 'Apr', progress: 80 },
  ];

  const stats = [
    {
      title: 'Enrolled Courses',
      value: enrollments.length,
      icon: Book,
      color: 'bg-blue-500'
    },
    {
      title: 'Completed',
      value: enrollments.filter(e => e.completion_status === 'completed').length,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'In Progress',
      value: enrollments.filter(e => e.completion_status === 'in_progress').length,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Certificates',
      value: certificates.length,
      icon: Award,
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">Track your learning progress and manage your courses</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex items-center space-x-4">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Learning Progress</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Current Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Courses</h2>
          <div className="space-y-4">
            {enrollments.filter(e => e.completion_status === 'in_progress').map((enrollment) => (
              <div key={enrollment.course_id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800">{enrollment.course?.title}</h3>
                    <p className="text-sm text-gray-600">Instructor: {enrollment.course?.instructor_name}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {enrollment.progress_percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${enrollment.progress_percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Assignments</h2>
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const submitted = submissions.some(s => s.assignment_id === assignment.assignment_id);
              return (
                <div key={assignment.assignment_id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-800">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.course_title}</p>
                      <p className="text-xs text-gray-500">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {submitted ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Submitted</span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Pending</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Certificates */}
      {certificates.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div key={cert.certificate_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8 text-yellow-500" />
                  <div>
                    <h3 className="font-medium text-gray-800">{cert.course_title}</h3>
                    <p className="text-sm text-gray-600">Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}