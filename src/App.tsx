import { Suspense, lazy } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Utils
import Loading from "@/components/Loading";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/ProtectedAdminRoute";

const queryClient = new QueryClient();

// Lazy Imports
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"));

const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));

// User Pages
const Dashboard = lazy(() => import("./pages/user/Dashboard"));
const MyCourses = lazy(() => import("./pages/user/MyCourses"));
const PaidCourses = lazy(() => import("./pages/user/PaidCourses"));
const FreeCourses = lazy(() => import("./pages/user/FreeCourses"));
const StudentExams = lazy(() => import("./pages/user/Exams"));
const ExamQuestionsStudents = lazy(() => import("./pages/user/ExamQuestions"));
const CourseLectures = lazy(() => import("./pages/user/CourseLectures"));
const LectureView = lazy(() => import("./pages/user/LectureView"));
const CourseDetails = lazy(() => import("./pages/user/CourseDetails"));
const Profile = lazy(() => import("./pages/user/Profile"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Courses = lazy(() => import("./pages/admin/Courses/Courses"));
const CoursesDetails = lazy(() => import("./pages/admin/Courses/CourseDetails"));
const AdminCourseLectures = lazy(() => import("./pages/admin/Courses/CourseLectures"));
const AdminCourseLecturesView = lazy(() => import("./pages/admin/Courses/LectureView"));
const AddCourse = lazy(() => import("./pages/admin/Courses/AddCourse"));
const EditCourse = lazy(() => import("./pages/admin/Courses/EditCourse"));
const AddLecture = lazy(() => import("./pages/admin/Courses/AddLecture"));
const EditLecture = lazy(() => import("./pages/admin/Courses/EditLecture"));
const PurchaseOrders = lazy(() => import("./pages/admin/Purchases/PurchaseOrders"));
const Users = lazy(() => import("./pages/admin/Users/Users"));
const Admins = lazy(() => import("./pages/admin/Admins/Admins"));
const AddAdmin = lazy(() => import("./pages/admin/Admins/AddAdmin"));
const EditAdmin = lazy(() => import("./pages/admin/Admins/EditAdmin"));
const Exams = lazy(() => import("./pages/admin/Exams/Exams"));
const AddExam = lazy(() => import("./pages/admin/Exams/AddExam"));
const EditExam = lazy(() => import("./pages/admin/Exams/EditExam"));
const ExamQuestions = lazy(() => import("./pages/admin/Exams/ExamQuestions"));
const AddQuestion = lazy(() => import("./pages/admin/Exams/AddQuestion"));
const EditQuestion = lazy(() => import("./pages/admin/Exams/EditQuestion"));
const ExamDetails = lazy(() => import("./pages/admin/Exams/ExamDetails"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-right" richColors closeButton expand duration={4000} theme="light" />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<Index />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* User Protected Routes */}
            <Route element={<ProtectedRoute allowedRole="User" />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/paid-courses" element={<PaidCourses />} />
                <Route path="/free-courses" element={<FreeCourses />} />
                <Route path="/exam" element={<StudentExams />} />
                <Route path="/exam/:examId/questions" element={<ExamQuestionsStudents />} />
                <Route path="/course/:courseId/lectures" element={<CourseLectures />} />
                <Route path="/course/:courseId/lecture/:lectureId" element={<LectureView />} />
                <Route path="/course/:courseId" element={<CourseDetails />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id/course-details" element={<CoursesDetails />} />
                <Route path="/courses/add-course" element={<AddCourse />} />
                <Route path="/courses/:courseId/edit-course" element={<EditCourse />} />
                <Route path="/courses/:courseId/lectures" element={<AdminCourseLectures />} />
                <Route path="/courses/:courseId/lectures/:lectureId/lecture-view" element={<AdminCourseLecturesView />} />
                <Route path="/courses/lectures/:courseId/edit-lecture/:lectureId" element={<EditLecture />} />
                <Route path="/courses/add-lecture" element={<AddLecture />} />
                <Route path="/purchase-orders" element={<PurchaseOrders />} />
                <Route path="/users" element={<Users />} />
                <Route path="/admins" element={<Admins />} />
                <Route path="/admins/add-admin" element={<AddAdmin />} />
                <Route path="/admins/:adminId/edit-admin" element={<EditAdmin />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/exams/:examId/exam-details" element={<ExamDetails />} />
                <Route path="/exams/add-exam" element={<AddExam />} />
                <Route path="/exams/:examId/edit-exam" element={<EditExam />} />
                <Route path="/exams/:examId/questions" element={<ExamQuestions />} />
                <Route path="/exams/:examId/questions/add-question" element={<AddQuestion />} />
                <Route path="/exams/:examId/questions/:id/edit-question" element={<EditQuestion />} />
              </Route>
            </Route>

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
