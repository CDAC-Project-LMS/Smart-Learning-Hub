import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ChatWidget from './components/chat/ChatWidget';

import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import LessonPlayer from './pages/LessonPlayer';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import Certificates from './pages/Certificates';
import NotFound from './pages/NotFound';

import StudentDashboard from './pages/student/StudentDashboard';
import MyEnrollments from './pages/student/MyEnrollments';

import InstructorDashboard from './pages/instructor/InstructorDashboard';
import MyCourses from './pages/instructor/MyCourses';
import CourseEditor from './pages/instructor/CourseEditor';
import ManageLessons from './pages/instructor/ManageLessons';
import ManageQuiz from './pages/instructor/ManageQuiz';
import CourseEnrollments from './pages/instructor/CourseEnrollments';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCoursesAdmin from './pages/admin/ManageCoursesAdmin';

export default function App() {
  return (
    <>
      <Navbar />
      <div className="flex-grow-1 d-flex flex-column">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />

          {/* Shared authenticated */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Student */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute roles={['STUDENT']}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/enrollments" element={
            <ProtectedRoute roles={['STUDENT']}><MyEnrollments /></ProtectedRoute>
          } />
          <Route path="/courses/:courseId/learn" element={
            <ProtectedRoute roles={['STUDENT']}><LessonPlayer /></ProtectedRoute>
          } />
          <Route path="/quizzes/:quizId/attempt" element={
            <ProtectedRoute roles={['STUDENT']}><Quiz /></ProtectedRoute>
          } />
          <Route path="/quizzes/:quizId/result" element={
            <ProtectedRoute roles={['STUDENT']}><QuizResult /></ProtectedRoute>
          } />
          <Route path="/payment/:courseId" element={
            <ProtectedRoute roles={['STUDENT']}><Payment /></ProtectedRoute>
          } />
		  
		  <Route path="/payment-success" element={<PaymentSuccess />} />

		  <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="/certificates" element={
            <ProtectedRoute roles={['STUDENT']}><Certificates /></ProtectedRoute>
          } />

          {/* Instructor */}
          <Route path="/instructor/dashboard" element={
            <ProtectedRoute roles={['INSTRUCTOR']}><InstructorDashboard /></ProtectedRoute>
          } />
          <Route path="/instructor/courses" element={
            <ProtectedRoute roles={['INSTRUCTOR']}><MyCourses /></ProtectedRoute>
          } />
          <Route path="/instructor/courses/new" element={
            <ProtectedRoute roles={['INSTRUCTOR']}><CourseEditor /></ProtectedRoute>
          } />
          <Route path="/instructor/courses/:courseId/edit" element={
            <ProtectedRoute roles={['INSTRUCTOR']}><CourseEditor /></ProtectedRoute>
          } />
          <Route path="/instructor/courses/:courseId/lessons" element={
            <ProtectedRoute roles={['INSTRUCTOR']}><ManageLessons /></ProtectedRoute>
          } />
          <Route path="/instructor/courses/:courseId/quiz" element={
            <ProtectedRoute roles={['INSTRUCTOR']}><ManageQuiz /></ProtectedRoute>
          } />
          <Route path="/instructor/courses/:courseId/enrollments" element={
            <ProtectedRoute roles={['INSTRUCTOR']}><CourseEnrollments /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['ADMIN']}><ManageUsers /></ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute roles={['ADMIN']}><ManageCoursesAdmin /></ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <ChatWidget />
    </>
  );
}
