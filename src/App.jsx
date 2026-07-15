import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import SiteBackground from './components/SiteBackground';
import Spinner from './components/Spinner';

// Route-level code splitting: each page's code is fetched only when the user
// navigates to it, instead of all being bundled into one large initial file.
const Home = lazy(() => import('./pages/Home'));
const Jobs = lazy(() => import('./pages/Jobs'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MyJobs = lazy(() => import('./pages/MyJobs'));
const ApplicantsForJob = lazy(() => import('./pages/ApplicantsForJob'));
const AllApplicants = lazy(() => import('./pages/AllApplicants'));
const MyApplications = lazy(() => import('./pages/MyApplications'));
const SavedJobs = lazy(() => import('./pages/SavedJobs'));
const ShareTestimonial = lazy(() => import('./pages/ShareTestimonial'));
const CompanyProfileEdit = lazy(() => import('./pages/CompanyProfileEdit'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <SiteBackground />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/my-jobs"
              element={
                <ProtectedRoute role="employer">
                  <MyJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/my-jobs/:jobId/applicants"
              element={
                <ProtectedRoute role="employer">
                  <ApplicantsForJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/applicants"
              element={
                <ProtectedRoute role="employer">
                  <AllApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/applications"
              element={
                <ProtectedRoute role="jobseeker">
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/saved-jobs"
              element={
                <ProtectedRoute role="jobseeker">
                  <SavedJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/testimonial"
              element={
                <ProtectedRoute>
                  <ShareTestimonial />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/company-profile"
              element={
                <ProtectedRoute role="employer">
                  <CompanyProfileEdit />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
