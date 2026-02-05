import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ThemeConfig from './theme/ThemeConfig';
import { Box } from '@mui/material';

// Import pages (to be created)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import CareerRecommendations from './pages/CareerRecommendations';
import LearningPlan from './pages/LearningPlan';
import Resources from './pages/Resources';
import Community from './pages/Community';
import Profile from './pages/Profile';

// Import components (to be created)
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeConfig>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="assessment" element={
                <ProtectedRoute>
                  <Assessment />
                </ProtectedRoute>
              } />
              <Route path="career-recommendations" element={
                <ProtectedRoute>
                  <CareerRecommendations />
                </ProtectedRoute>
              } />
              <Route path="learning-plan/:id?" element={
                <ProtectedRoute>
                  <LearningPlan />
                </ProtectedRoute>
              } />
              <Route path="resources" element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              } />
              <Route path="community" element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Redirect to home for any unmatched routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Box>
      </Router>
    </ThemeConfig>
  );
}

export default App;
