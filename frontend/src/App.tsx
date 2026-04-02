import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth & Setup
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './pages/ProtectedRoute';
import PublicRoute from './pages/PublicRoute';

// Dashboards
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseCourses from './pages/student/BrowseCourses';
import StudentProgress from './pages/student/StudentProgress';
import StudentAssignments from './pages/student/StudentAssignments';
import Certificates from './pages/student/Certificates';
import CertificateView from './pages/student/CertificateView';

import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorCourses from './pages/instructor/InstructorCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import CourseContent from './pages/instructor/CourseContent';
import InstructorSubmissions from './pages/instructor/InstructorSubmissions';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';

import CoursePlayer from './pages/student/CoursePlayer';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px' } }} />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Student */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/courses" element={<ProtectedRoute allowedRoles={['student']}><BrowseCourses /></ProtectedRoute>} />
          <Route path="/student/progress" element={<ProtectedRoute allowedRoles={['student']}><StudentProgress /></ProtectedRoute>} />
          <Route path="/student/assignments" element={<ProtectedRoute allowedRoles={['student']}><StudentAssignments /></ProtectedRoute>} />
          <Route path="/student/certificates" element={<ProtectedRoute allowedRoles={['student']}><Certificates /></ProtectedRoute>} />
          <Route path="/student/certificates/:courseId/view" element={<ProtectedRoute allowedRoles={['student']}><CertificateView /></ProtectedRoute>} />
          <Route path="/course/:id/learn" element={<ProtectedRoute allowedRoles={['student']}><CoursePlayer /></ProtectedRoute>} />

          {/* Instructor */}
          <Route path="/instructor" element={<ProtectedRoute allowedRoles={['instructor']}><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/courses" element={<ProtectedRoute allowedRoles={['instructor']}><InstructorCourses /></ProtectedRoute>} />
          <Route path="/instructor/courses/create" element={<ProtectedRoute allowedRoles={['instructor']}><CreateCourse /></ProtectedRoute>} />
          <Route path="/instructor/courses/:id/content" element={<ProtectedRoute allowedRoles={['instructor']}><CourseContent /></ProtectedRoute>} />
          <Route path="/instructor/submissions" element={<ProtectedRoute allowedRoles={['instructor']}><InstructorSubmissions /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={['admin']}><AdminCourses /></ProtectedRoute>} />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
