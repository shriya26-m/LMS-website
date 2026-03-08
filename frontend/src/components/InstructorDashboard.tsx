// src/components/InstructorDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Course, Assignment, Submission } from '../types';
import { Book, Users, FileText, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        setTimeout(() => {
          setCourses([
            {
              course_id: '1',
              title: 'React Fundamentals',
              description: 'Learn React from scratch',
              category: 'Programming',
              instructor_id: user?.user_id || 'inst1',
              instructor_name: user?.name
            },
            {
              course_id: '2',
              title: 'Advanced JavaScript',
              description: 'Master JavaScript concepts',
              category: 'Programming',
              instructor_id: user?.user_id || 'inst1',
              instructor_name: user?.name
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
              title: 'JavaScript Closures',
              due_date: '2024-03-22',
              total_marks: 50,
              course_title: 'Advanced JavaScript'
            }
          ]);

          setSubmissions([
            {
              submission_id: 'sub1',
              assignment_id: 'asst1',
              student_id: 'student1',
              submission_date: '2024-03-18',
              marks_obtained: 85,
              feedback: 'Good work!'
            },
            {
              submission_id: 'sub2',
              assignment_id: 'asst1',
              student_id: 'student2',
              submission_date: '2024-03-19',
              marks_obtained: null,
              feedback: null
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

  const stats = [
    {
      title: 'Total Courses',
      value: courses.length,
      icon: Book,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Students',
      value: 45,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Assignments',
      value: assignments.length,
      icon: FileText,
      color: 'bg-yellow-500'
    },
    {
      title: 'Pending Reviews',
      value: submissions.filter(s => s.marks_obtained === null).length,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const submissionData = [
    { name: 'Week 1', submissions: 12 },
    { name: 'Week 2', submissions: 18 },
    { name: 'Week 3', submissions: 15 },
    { name: 'Week 4', submissions: 22 },
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Instructor Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create New Course</span>
        </button>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Submission Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="submissions" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Submissions</h2>
          <div className="space-y-4">
            {submissions.slice(0, 3).map((submission) => (
              <div key={submission.submission_id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div>
                  <p className="font-medium text-gray-800">Student ID: {submission.student_id}</p>
                  <p className="text-sm text-gray-600">Assignment: {submission.assignment_id}</p>
                  <p className="text-xs text-gray-500">Submitted: {new Date(submission.submission_date).toLocaleDateString()}</p>
                </div>
                {submission.marks_obtained ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Graded: {submission.marks_obtained}
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    Pending Review
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.course_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800">{course.title}</h3>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-blue-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{course.category}</p>
              <p className="text-xs text-gray-500">{course.description}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-500">12 students enrolled</span>
                <button className="text-blue-600 text-sm hover:text-blue-700">Manage</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}