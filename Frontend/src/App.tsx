import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/layout';
import { Home } from './pages/Home';
import { SignupPage } from './pages/SignUp';
import { SigninPage } from './pages/SignIn';
import { Chat } from './pages/dashboard/chat';
import Dashboard from './pages/dashboard';
import CreatePartnerProfile from './pages/dashboard/CreatePartnerProfile';
import PartnerDashboard from './pages/dashboard/PartnerDashboard'; // Import the new page
import { ProtectedRoute } from './components/pages/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignupPage />} />
          <Route path="/SignIn" element={<SigninPage />} />


          {/* --- Protected Routes --- */}
          {/* All routes inside this ProtectedRoute component now require login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<Chat />} />
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/create-partner-profile" element={<CreatePartnerProfile />} />
            {/* You can add more protected routes here in the future */}
          </Route>

          {/* ✅ Parent Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Chat />} />
            <Route path="chat" element={<Chat />} />
          </Route>

          {/* Optional: catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/partner-dashboard" element={<PartnerDashboard />} />
          <Route path="/create-partner-profile" element={<CreatePartnerProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;