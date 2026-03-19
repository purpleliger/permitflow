import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import UploadDocuments from './pages/UploadDocuments';
import ProjectAnalysis from './pages/ProjectAnalysis';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Protected app routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/project/new" element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
          <Route path="/project/:projectId/upload" element={<ProtectedRoute><UploadDocuments /></ProtectedRoute>} />
          <Route path="/project/:projectId/analysis" element={<ProtectedRoute><ProjectAnalysis /></ProtectedRoute>} />
          <Route path="/project/:projectId" element={<ProtectedRoute><ProjectAnalysis /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
