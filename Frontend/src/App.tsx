import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/layout';
import { Home } from './pages/Home';
import { SignupPage } from './pages/SignUp';
import { SigninPage } from './pages/SignIn';
import { Chat } from './pages/dashboard/chat';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignupPage />} />
          <Route path="/SignIn" element={<SigninPage />} />

          {/* ✅ Parent Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />}>
            {/* ✅ Index route so /dashboard works */}
            <Route index element={<Chat />} />
            {/* ✅ Explicit /dashboard/chat route */}
            <Route path="chat" element={<Chat />} />
          </Route>

          {/* Optional: catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;