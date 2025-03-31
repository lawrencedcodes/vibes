import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../src/theme/ThemeConfig';
import AssessmentPage from '../src/pages/AssessmentPage';

// Mock components that might be used in AssessmentPage
jest.mock('../src/components/assessment/InterestExplorationQuestionnaire', () => {
  return function MockInterestExploration() {
    return <div data-testid="mock-interest-exploration">Interest Exploration</div>;
  };
});

jest.mock('../src/components/assessment/SkillAssessmentTool', () => {
  return function MockSkillAssessment() {
    return <div data-testid="mock-skill-assessment">Skill Assessment</div>;
  };
});

jest.mock('../src/components/assessment/WorkStylePreferencesAssessment', () => {
  return function MockWorkStylePreferences() {
    return <div data-testid="mock-work-style">Work Style Preferences</div>;
  };
});

jest.mock('../src/components/assessment/JobRoleInterestSelection', () => {
  return function MockJobRoleInterest() {
    return <div data-testid="mock-job-role">Job Role Interest</div>;
  };
});

jest.mock('../src/components/assessment/TechnologicalAccessAssessment', () => {
  return function MockTechAccess() {
    return <div data-testid="mock-tech-access">Technological Access</div>;
  };
});

describe('AssessmentPage Component', () => {
  const renderWithProviders = (ui) => {
    return render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {ui}
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  test('renders the assessment page title', () => {
    renderWithProviders(<AssessmentPage />);
    const titleElement = screen.getByRole('heading', { name: /assessment/i });
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the stepper component', () => {
    renderWithProviders(<AssessmentPage />);
    const stepperElement = screen.getByRole('progressbar');
    expect(stepperElement).toBeInTheDocument();
  });

  test('renders the first assessment step by default', () => {
    renderWithProviders(<AssessmentPage />);
    const interestExploration = screen.getByTestId('mock-interest-exploration');
    expect(interestExploration).toBeInTheDocument();
  });

  test('navigates through assessment steps when clicking next button', async () => {
    renderWithProviders(<AssessmentPage />);
    
    // First step should be visible
    expect(screen.getByTestId('mock-interest-exploration')).toBeInTheDocument();
    
    // Click next button
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Second step should now be visible
    await waitFor(() => {
      expect(screen.getByTestId('mock-skill-assessment')).toBeInTheDocument();
    });
    
    // Click next again
    fireEvent.click(nextButton);
    
    // Third step should now be visible
    await waitFor(() => {
      expect(screen.getByTestId('mock-work-style')).toBeInTheDocument();
    });
  });

  test('previous button returns to earlier steps', async () => {
    renderWithProviders(<AssessmentPage />);
    
    // Navigate to second step
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-skill-assessment')).toBeInTheDocument();
    });
    
    // Click previous button
    const prevButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(prevButton);
    
    // Should be back at first step
    await waitFor(() => {
      expect(screen.getByTestId('mock-interest-exploration')).toBeInTheDocument();
    });
  });

  test('submit button appears on final step', async () => {
    renderWithProviders(<AssessmentPage />);
    
    // Navigate to last step (this would be the 5th step in our assessment)
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Click through all steps
    for (let i = 0; i < 4; i++) {
      fireEvent.click(nextButton);
      await waitFor(() => {
        // Just wait for any rendering to complete
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
    }
    
    // On the last step, we should see a Submit button instead of Next
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('renders in dark mode', () => {
    renderWithProviders(<AssessmentPage />);
    
    // Check if the component renders with dark mode styling
    const containerElement = screen.getByTestId('assessment-container');
    expect(containerElement).toHaveStyle({ backgroundColor: '#121212' });
  });

  test('is responsive and mobile-friendly', () => {
    renderWithProviders(<AssessmentPage />);
    
    // Check if the container has responsive styling
    const containerElement = screen.getByTestId('assessment-container');
    expect(containerElement).toHaveStyle({ maxWidth: '100%' });
  });
});
