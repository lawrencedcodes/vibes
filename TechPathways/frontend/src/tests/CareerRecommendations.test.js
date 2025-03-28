import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CareerRecommendations from '../pages/CareerRecommendations';
import theme from '../theme/ThemeConfig';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock local storage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock career recommendations data
const mockRecommendations = [
  {
    id: 1,
    careerPath: {
      id: 1,
      title: 'Frontend Developer',
      description: 'Frontend developers build user interfaces for websites and applications.',
      requiredSkills: 'HTML,CSS,JavaScript,React,UI/UX',
      averageSalary: '$75,000 - $120,000',
      jobGrowth: 'High',
      entryRequirements: 'Portfolio of projects, knowledge of modern frameworks'
    },
    matchPercentage: 92.5,
    assessment: {
      id: 1,
      title: 'Career Assessment'
    }
  },
  {
    id: 2,
    careerPath: {
      id: 2,
      title: 'UX Designer',
      description: 'UX designers create user-friendly interfaces and experiences.',
      requiredSkills: 'UI Design,User Research,Wireframing,Prototyping,Figma',
      averageSalary: '$70,000 - $110,000',
      jobGrowth: 'High',
      entryRequirements: 'Portfolio of designs, understanding of user psychology'
    },
    matchPercentage: 85.0,
    assessment: {
      id: 1,
      title: 'Career Assessment'
    }
  },
  {
    id: 3,
    careerPath: {
      id: 3,
      title: 'Data Scientist',
      description: 'Data scientists analyze and interpret complex data.',
      requiredSkills: 'Python,R,Statistics,Machine Learning,SQL',
      averageSalary: '$90,000 - $140,000',
      jobGrowth: 'Very High',
      entryRequirements: 'Strong math background, programming skills, analytical thinking'
    },
    matchPercentage: 68.0,
    assessment: {
      id: 1,
      title: 'Career Assessment'
    }
  }
];

describe('CareerRecommendations Component', () => {
  beforeEach(() => {
    // Reset mocks
    axios.get.mockReset();
    localStorageMock.getItem.mockReset();
    
    // Mock JWT token
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-jwt-token';
      return null;
    });
    
    // Mock API responses
    axios.get.mockResolvedValue({ data: mockRecommendations });
  });

  test('renders career recommendations page with loading state', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CareerRecommendations />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check for loading state
    expect(screen.getByText(/Loading your career recommendations/i)).toBeInTheDocument();
  });

  test('displays career recommendations after loading', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CareerRecommendations />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Wait for recommendations to load
    await waitFor(() => {
      expect(screen.getByText(/Your Career Recommendations/i)).toBeInTheDocument();
    });

    // Check if recommendations are displayed
    expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/UX Designer/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Scientist/i)).toBeInTheDocument();
    
    // Check if match percentages are displayed
    expect(screen.getByText(/92.5%/i)).toBeInTheDocument();
    expect(screen.getByText(/85.0%/i)).toBeInTheDocument();
    expect(screen.getByText(/68.0%/i)).toBeInTheDocument();
  });

  test('displays career details when a career is selected', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CareerRecommendations />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Wait for recommendations to load
    await waitFor(() => {
      expect(screen.getByText(/Your Career Recommendations/i)).toBeInTheDocument();
    });

    // Click on a career recommendation
    fireEvent.click(screen.getByText(/Frontend Developer/i));
    
    // Check if career details are displayed
    await waitFor(() => {
      expect(screen.getByText(/Required Skills/i)).toBeInTheDocument();
      expect(screen.getByText(/HTML, CSS, JavaScript, React, UI\/UX/i)).toBeInTheDocument();
      expect(screen.getByText(/Average Salary/i)).toBeInTheDocument();
      expect(screen.getByText(/\$75,000 - \$120,000/i)).toBeInTheDocument();
      expect(screen.getByText(/Job Growth/i)).toBeInTheDocument();
      expect(screen.getByText(/Entry Requirements/i)).toBeInTheDocument();
    });
  });

  test('allows user to create a learning plan', async () => {
    // Mock additional API call for creating learning plan
    axios.post.mockResolvedValue({ 
      data: { 
        id: 1, 
        title: '1-Year Frontend Developer Learning Path',
        careerPath: mockRecommendations[0].careerPath
      } 
    });
    
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CareerRecommendations />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Wait for recommendations to load
    await waitFor(() => {
      expect(screen.getByText(/Your Career Recommendations/i)).toBeInTheDocument();
    });

    // Click on a career recommendation
    fireEvent.click(screen.getByText(/Frontend Developer/i));
    
    // Click on "Create Learning Plan" button
    await waitFor(() => {
      expect(screen.getByText(/Create Learning Plan/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText(/Create Learning Plan/i));
    
    // Check if API was called with correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      
      // Check if the correct endpoint was called
      expect(axios.post.mock.calls[0][0]).toContain('/api/learning-plans/create');
      
      // Check if the correct data was sent
      const sentData = axios.post.mock.calls[0][1];
      expect(sentData.careerRecommendationId).toBe(1);
    });
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/Learning plan created successfully/i)).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock API error
    axios.get.mockRejectedValue(new Error('Network error'));
    
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CareerRecommendations />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Error loading career recommendations/i)).toBeInTheDocument();
    });
  });

  test('displays message when no recommendations are available', async () => {
    // Mock empty recommendations
    axios.get.mockResolvedValue({ data: [] });
    
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CareerRecommendations />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check for no recommendations message
    await waitFor(() => {
      expect(screen.getByText(/No career recommendations available/i)).toBeInTheDocument();
      expect(screen.getByText(/Please complete an assessment first/i)).toBeInTheDocument();
    });
  });
});
