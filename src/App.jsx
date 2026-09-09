import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EmergencyLogin from './pages/EmergencyLogin';
import EmergencyAssistance from './pages/EmergencyAssistance';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import ForgetPassword from './pages/ForgetPassword';
import SymptomCheck from './pages/SymptomCheck';
import SymptomResults from './pages/SymptomResults'; // 
import MilestoneChecklist from './pages/MilestoneChecklist';
import AutismScreener from './pages/AutismScreener';
import GrowthTracker from './pages/GrowthTracker';
import ManageSymptoms from './pages/ManageSymptoms';
import ManageMilestones from './pages/ManageMilestones';
import ManageRisks from './pages/ManageRisks';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/emergency" element={<EmergencyLogin />} />
      <Route path="/emergency-assistance" element={<EmergencyAssistance />} /> 
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/symptoms" element={<SymptomCheck />} />
      <Route path="/symptom-results" element={<SymptomResults />} />
      <Route path="/milestones" element={<MilestoneChecklist />} />
      <Route path="/mchat" element={<AutismScreener />} />
      <Route path="/growth" element={<GrowthTracker />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/symptoms" element={<ManageSymptoms />} />
      <Route path="/admin/milestones" element={<ManageMilestones />} />
      <Route path="/admin/risks" element={<ManageRisks />} />
    </Routes>
  );
}

export default App;


