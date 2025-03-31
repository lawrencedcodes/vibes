import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import ThemeConfig from './theme/ThemeConfig';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import CareerPathsPage from './pages/CareerPathsPage';
import LearningPlanPage from './pages/LearningPlanPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <ThemeConfig>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/careers" element={<CareerPathsPage />} />
              <Route path="/learning" element={<LearningPlanPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeConfig>
  );
}

export default App;
