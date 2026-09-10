import { Routes, Route } from 'react-router-dom';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EmergencyLogin from './pages/EmergencyLogin';
import ForgetPassword from './pages/ForgetPassword';

// Caregiver pages
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import SymptomCheck from './pages/SymptomCheck';
import SymptomResults from './pages/SymptomResults';
import MilestoneChecklist from './pages/MilestoneChecklist';
import AutismScreener from './pages/AutismScreener';
import GrowthTracker from './pages/GrowthTracker';

// Baby/Pregnancy pages 
import AddBaby from './pages/AddBaby';
import BabyDetail from './pages/BabyDetail';
import EditBaby from './pages/EditBaby';
import KickCounter from './pages/KickCounter';
import ContractionTimer from './pages/ContractionTimer';
import WeightLogger from './pages/WeightLogger';
import SpecialistLocator from './pages/SpecialistLocator';
import SpecialistDetail from './pages/SpecialistDetail';
import ChatbotUI from './pages/ChatbotUI';
import VaccinationList from './pages/VaccinationList';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import ManageSymptoms from './pages/ManageSymptoms';
import ManageMilestones from './pages/ManageMilestones';
import ManageRisks from './pages/ManageRisks';
import ManageSpecialists from './pages/ManageSpecialists';
import ManageEmergency from './pages/ManageEmergency';
import ManageEducation from './pages/ManageEducation';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/emergency" element={<EmergencyLogin />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />

      {/* Caregiver */}
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/symptoms" element={<SymptomCheck />} />
      <Route path="/symptom-results" element={<SymptomResults />} />
      <Route path="/milestones" element={<MilestoneChecklist />} />
      <Route path="/mchat" element={<AutismScreener />} />
      <Route path="/growth" element={<GrowthTracker />} />

      {/* Baby/Pregnancy  */}
      <Route path="/add-baby" element={<AddBaby />} />
      <Route path="/baby/:id" element={<BabyDetail />} />
      <Route path="/edit-baby/:id" element={<EditBaby />} />
      <Route path="/kick-counter" element={<KickCounter />} />
      <Route path="/contraction-timer" element={<ContractionTimer />} />
      <Route path="/weight-logger" element={<WeightLogger />} />
      <Route path="/specialists" element={<SpecialistLocator />} />
      <Route path="/specialist/:id" element={<SpecialistDetail />} />
      <Route path="/chatbot" element={<ChatbotUI />} />
      <Route path="/vaccinations" element={<VaccinationList />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/symptoms" element={<ManageSymptoms />} />
      <Route path="/admin/milestones" element={<ManageMilestones />} />
      <Route path="/admin/risks" element={<ManageRisks />} />
      <Route path="/admin/specialists" element={<ManageSpecialists />} />
      <Route path="/admin/emergency" element={<ManageEmergency />} />
      <Route path="/admin/education" element={<ManageEducation />} />
    </Routes>
  );
}

export default App;