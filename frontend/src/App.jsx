// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Public
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPassword from './pages/ForgetPassword';

// Caregiver + Mother
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import HealthHistory from './pages/HealthHistory';
import ReportViewer from './pages/ReportViewer';

// Babies — available to Caregiver + PregnantMother
import BabyList from './pages/BabyList';
import AddBaby from './pages/AddBaby';
import EditBaby from './pages/EditBaby';
import BabyDetail from './pages/BabyDetail';

// Pregnancy — PregnantMother only
import PregnancyDashboard from './pages/PregnancyDashboard';
import KickCounter from './pages/KickCounter';
import ContractionTimer from './pages/ContractionTimer';
import WeightLogger from './pages/WeightLogger';

// Assessments — both roles
import SymptomCheck from './pages/SymptomCheck';
import SymptomResults from './pages/SymptomResults';
import MilestoneChecklist from './pages/MilestoneChecklist';
import AutismScreener from './pages/AutismScreener';
import MChatResult from './pages/MChatResult';

// Tracking — both roles
import GrowthTracker from './pages/GrowthTracker';
import VaccinationList from './pages/VaccinationList';

// Support — both roles
import SpecialistLocator from './pages/SpecialistLocator';
import SpecialistDetail from './pages/SpecialistDetail';
import ChatbotUI from './pages/ChatbotUI';
import EmergencyAssistance from './pages/EmergencyAssistance';

// Education
import Education from './pages/Education';
import EducationDetail from './pages/EducationDetail';

// Placeholder
import ComingSoon from './pages/ComingSoon';

// Admin
import AdminDashboard from './pages/AdminDashboard';
import ManageSymptoms from './pages/ManageSymptoms';
import ManageMilestones from './pages/ManageMilestones';
import ManageRisks from './pages/ManageRisks';
import ManageSpecialists from './pages/ManageSpecialists';
import ManageEmergency from './pages/ManageEmergency';
import ManageEducation from './pages/ManageEducation';
import AdminUsers from './pages/AdminUsers';
import AdminAssessments from './pages/AdminAssessments';
import AdminSettings from './pages/AdminSettings';

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* ── PUBLIC ──────────────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ── SHARED: Caregiver + PregnantMother ────────── */}
        <Route element={<ProtectedRoute allowed={['Caregiver', 'PregnantMother']} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<HealthHistory />} />
          <Route path="/reports/:type/:babyId" element={<ReportViewer />} />
          {/* Babies */}
          <Route path="/babies" element={<BabyList />} />
          <Route path="/add-baby" element={<AddBaby />} />
          <Route path="/baby/:id" element={<BabyDetail />} />
          <Route path="/edit-baby/:id" element={<EditBaby />} />

          {/* Assessments */}
          <Route path="/symptoms" element={<SymptomCheck />} />
          <Route path="/symptom-results" element={<SymptomResults />} />
          <Route path="/milestones" element={<MilestoneChecklist />} />
          <Route path="/mchat" element={<AutismScreener />} />
          <Route path="/mchat-results" element={<MChatResult />} />

          {/* Tracking */}
          <Route path="/growth" element={<GrowthTracker />} />
          <Route path="/vaccinations" element={<VaccinationList />} />

          {/* Support */}
          <Route path="/specialists" element={<SpecialistLocator />} />
          <Route path="/specialist/:id" element={<SpecialistDetail />} />
          <Route path="/assistant" element={<ChatbotUI />} />
          <Route path="/emergency" element={<EmergencyAssistance />} />

          {/* Education */}
          <Route path="/education" element={<Education />} />
          <Route path="/education/:id" element={<EducationDetail />} />

          {/* Placeholders */}
          <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
          
        </Route>

        {/* ── PREGNANCY: PregnantMother only ───────────── */}
        <Route element={<ProtectedRoute allowed={['PregnantMother']} />}>
          <Route path="/pregnancy" element={<PregnancyDashboard />} />
          <Route path="/kick-counter" element={<KickCounter />} />
          <Route path="/contraction-timer" element={<ContractionTimer />} />
          <Route path="/weight-logger" element={<WeightLogger />} />
        </Route>

        {/* ── ADMIN ONLY ─────────────────────────────────── */}
        <Route element={<ProtectedRoute allowed={['Admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/symptoms" element={<ManageSymptoms />} />
          <Route path="/admin/milestones" element={<ManageMilestones />} />
          <Route path="/admin/risks" element={<ManageRisks />} />
          <Route path="/admin/specialists" element={<ManageSpecialists />} />
          <Route path="/admin/emergency" element={<ManageEmergency />} />
          <Route path="/admin/education" element={<ManageEducation />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/assessments" element={<AdminAssessments />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* ── FALLBACK ───────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}