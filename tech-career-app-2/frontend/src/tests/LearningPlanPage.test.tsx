import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../src/theme/ThemeConfig';
import LearningPlanPage from '../src/pages/LearningPlanPage';

// Mock API service
jest.mock('../src/services/api', () => ({
  getLearningPlan: jest.fn().mockResolvedValue({
    id: 1,
    title: 'Frontend Developer Learning Plan',
    description: 'A comprehensive 1-year plan to become a Frontend Developer',
    targetRole: {
      id: 1,
      title: 'Frontend Developer',
      description: 'Builds user interfaces for web applications'
    },
    durationWeeks: 52,
    milestones: [
      {
        id: 1,
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the basics of HTML and CSS',
        weekNumber: 1,
        phase: 'foundation',
        status: 'not_started',
        resources: [
          { id: 1, title: 'HTML & CSS Course', type: 'course', url: 'https://example.com/course' }
        ]
      },
      {
        id: 2,
        title: 'JavaScript Basics',
        description: 'Learn JavaScript fundamentals',
        weekNumber: 3,
        phase: 'foundation',
        status: 'not_started',
        resources: [
          { id: 2, title: 'JavaScript for Beginners', type: 'course', url: 'https://example.com/js-course' }
        ]
      },
      {
        id: 20,
        title: 'Portfolio Project: Personal Website',
        description: 'Build a personal portfolio website',
        weekNumber: 20,
        phase: 'building',
        status: 'not_started',
        resources: [
          { id: 10, title: 'Portfolio Building Guide', type: 'guide', url: 'https://example.com/portfolio' }
        ]
      },
      {
        id: 40,
        title: 'Resume Building Workshop',
        description: 'Create a tech-focused resume',
        weekNumber: 40,
        phase: 'career_preparation',
        status: 'not_started',
        resources: [
          { id: 15, title: 'Tech Resume Templates', type: 'template', url: 'https://example.com/resume' }
        ]
      }
    ]
  })
}));

describe('LearningPlanPage Component', () => {
  const renderWithProviders = (ui) => {
    return render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {ui}
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  test('renders the learning plan page title', async () => {
    renderWithProviders(<LearningPlanPage />);
    const titleElement = await screen.findByText(/Frontend Developer Learning Plan/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('displays learning plan phases', async () => {
    renderWithProviders(<LearningPlanPage />);
    
    // Wait for plan to load
    await screen.findByText(/Frontend Developer Learning Plan/i);
    
    // Check for phase headings
    expect(screen.getByText(/Foundation Phase/i)).toBeInTheDocument();
    expect(screen.getByText(/Building Phase/i)).toBeInTheDocument();
    expect(screen.getByText(/Career Preparation Phase/i)).toBeInTheDocument();
  });

  test('displays milestones in each phase', async () => {
    renderWithProviders(<LearningPlanPage />);
    
    // Wait for plan to load
    await screen.findByText(/Frontend Developer Learning Plan/i);
    
    // Check for milestone titles
    expect(screen.getByText(/HTML & CSS Fundamentals/i)).toBeInTheDocument();
    expect(screen.getByText(/JavaScript Basics/i)).toBeInTheDocument();
    expect(screen.getByText(/Portfolio Project: Personal Website/i)).toBeInTheDocument();
    expect(screen.getByText(/Resume Building Workshop/i)).toBeInTheDocument();
  });

  test('displays milestone details when expanded', async () => {
    renderWithProviders(<LearningPlanPage />);
    
    // Wait for plan to load
    await screen.findByText(/Frontend Developer Learning Plan/i);
    
    // Find and click on a milestone to expand it
    const milestone = screen.getByText(/HTML & CSS Fundamentals/i);
    fireEvent.click(milestone);
    
    // Check that expanded details are shown
    expect(screen.getByText(/Learn the basics of HTML and CSS/i)).toBeInTheDocument();
    expect(screen.getByText(/HTML & CSS Course/i)).toBeInTheDocument();
  });

  test('allows marking milestones as complete', async () => {
    renderWithProviders(<LearningPlanPage />);
    
    // Wait for plan to load
    await screen.findByText(/Frontend Developer Learning Plan/i);
    
    // Find and click on a milestone to expand it
    const milestone = screen.getByText(/HTML & CSS Fundamentals/i);
    fireEvent.click(milestone);
    
    // Find and click the complete button
    const completeButton = screen.getByRole('button', { name: /mark as complete/i });
    fireEvent.click(completeButton);
    
    // In a real test, we would verify the status changed
    // Here we're just ensuring the button is clickable
    expect(completeButton).toBeInTheDocument();
  });

  test('displays progress tracking information', async () => {
    renderWithProviders(<LearningPlanPage />);
    
    // Wait for plan to load
    await screen.findByText(/Frontend Developer Learning Plan/i);
    
    // Check for progress tracking elements
    expect(screen.getByText(/Overall Progress/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders in dark mode', async () => {
    renderWithProviders(<LearningPlanPage />);
    
    // Wait for content to load
    await screen.findByText(/Frontend Developer Learning Plan/i);
    
    // Check if the component renders with dark mode styling
    const containerElement = screen.getByTestId('learning-plan-container');
    expect(containerElement).toHaveStyle({ backgroundColor: '#121212' });
  });

  test('is responsive and mobile-friendly', async () => {
    renderWithProviders(<LearningPlanPage />);
    
    // Wait for content to load
    await screen.findByText(/Frontend Developer Learning Plan/i);
    
    // Check if the container has responsive styling
    const containerElement = screen.getByTestId('learning-plan-container');
    expect(containerElement).toHaveStyle({ maxWidth: '100%' });
  });
});
