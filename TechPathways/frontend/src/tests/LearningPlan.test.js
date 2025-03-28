import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import LearningPlan from '../pages/LearningPlan';
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

// Mock learning plan data
const mockLearningPlan = {
  id: 1,
  title: '1-Year Frontend Developer Learning Path',
  description: 'A personalized learning plan to help you become a Frontend Developer within one year.',
  careerPath: {
    id: 1,
    title: 'Frontend Developer',
    description: 'Frontend developers build user interfaces for websites and applications.'
  },
  startDate: '2025-03-28T00:00:00.000Z',
  endDate: '2026-03-28T00:00:00.000Z',
  progressPercentage: 25,
  milestones: [
    {
      id: 1,
      title: 'Technology Fundamentals',
      description: 'Learn the core concepts and tools needed for your tech career journey.',
      dueDate: '2025-05-28T00:00:00.000Z',
      completed: true,
      orderIndex: 1,
      tasks: [
        {
          id: 1,
          title: 'Learn programming basics',
          description: 'Understand variables, data types, control structures, and functions.',
          completed: true,
          orderIndex: 1
        },
        {
          id: 2,
          title: 'Set up your development environment',
          description: 'Install necessary software and tools for your learning journey.',
          completed: true,
          orderIndex: 2
        }
      ]
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      description: 'Learn the core technologies of the web: HTML, CSS, and JavaScript.',
      dueDate: '2025-07-28T00:00:00.000Z',
      completed: false,
      orderIndex: 2,
      tasks: [
        {
          id: 3,
          title: 'Learn HTML basics',
          description: 'Understand HTML structure, elements, and semantic markup.',
          completed: true,
          orderIndex: 1
        },
        {
          id: 4,
          title: 'Learn CSS basics',
          description: 'Understand CSS selectors, properties, and layout techniques.',
          completed: false,
          orderIndex: 2
        }
      ]
    }
  ],
  resourceRecommendations: [
    {
      id: 1,
      resource: {
        id: 1,
        title: 'Frontend Masters',
        description: 'Expert-led video courses on frontend development.',
        url: 'https://frontendmasters.com',
        type: 'Video Courses',
        categories: 'HTML,CSS,JavaScript,React'
      }
    },
    {
      id: 2,
      resource: {
        id: 2,
        title: 'MDN Web Docs',
        description: 'Comprehensive documentation for web technologies.',
        url: 'https://developer.mozilla.org',
        type: 'Documentation',
        categories: 'HTML,CSS,JavaScript,Web APIs'
      }
    }
  ]
};

describe('LearningPlan Component', () => {
  beforeEach(() => {
    // Reset mocks
    axios.get.mockReset();
    axios.put.mockReset();
    localStorageMock.getItem.mockReset();
    
    // Mock JWT token
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-jwt-token';
      return null;
    });
    
    // Mock API responses
    axios.get.mockResolvedValue({ data: mockLearningPlan });
    axios.put.mockResolvedValue({ data: { message: 'Task updated successfully' } });
  });

  test('renders learning plan page with loading state', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LearningPlan />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check for loading state
    expect(screen.getByText(/Loading your learning plan/i)).toBeInTheDocument();
  });

  test('displays learning plan details after loading', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LearningPlan />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Wait for learning plan to load
    await waitFor(() => {
      expect(screen.getByText(/1-Year Frontend Developer Learning Path/i)).toBeInTheDocument();
    });

    // Check if plan details are displayed
    expect(screen.getByText(/A personalized learning plan to help you become a Frontend Developer within one year./i)).toBeInTheDocument();
    expect(screen.getByText(/25%/i)).toBeInTheDocument(); // Progress percentage
    
    // Check if milestones are displayed
    expect(screen.getByText(/Technology Fundamentals/i)).toBeInTheDocument();
    expect(screen.getByText(/Web Development Fundamentals/i)).toBeInTheDocument();
    
    // Check if tasks are displayed
    expect(screen.getByText(/Learn programming basics/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn HTML basics/i)).toBeInTheDocument();
    
    // Check if resource recommendations are displayed
    expect(screen.getByText(/Recommended Resources/i)).toBeInTheDocument();
    expect(screen.getByText(/Frontend Masters/i)).toBeInTheDocument();
    expect(screen.getByText(/MDN Web Docs/i)).toBeInTheDocument();
  });

  test('allows user to mark tasks as completed', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LearningPlan />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Wait for learning plan to load
    await waitFor(() => {
      expect(screen.getByText(/1-Year Frontend Developer Learning Path/i)).toBeInTheDocument();
    });

    // Find the uncompleted task checkbox
    const taskCheckboxes = screen.getAllByRole('checkbox');
    const cssTaskCheckbox = taskCheckboxes.find(checkbox => 
      !checkbox.checked && checkbox.closest('div').textContent.includes('Learn CSS basics')
    );
    
    // Click the checkbox to mark task as completed
    fireEvent.click(cssTaskCheckbox);
    
    // Check if API was called with correct data
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      
      // Check if the correct endpoint was called
      expect(axios.put.mock.calls[0][0]).toContain('/api/tasks/4/complete');
    });
    
    // Mock the updated learning plan with the task completed
    const updatedPlan = {
      ...mockLearningPlan,
      progressPercentage: 50, // Updated progress
      milestones: mockLearningPlan.milestones.map(milestone => 
        milestone.id === 2 
          ? {
              ...milestone,
              tasks: milestone.tasks.map(task => 
                task.id === 4 ? { ...task, completed: true } : task
              )
            }
          : milestone
      )
    };
    
    // Mock the API response for the next get call
    axios.get.mockResolvedValue({ data: updatedPlan });
    
    // Wait for the plan to refresh
    await waitFor(() => {
      expect(screen.getByText(/50%/i)).toBeInTheDocument(); // Updated progress percentage
    });
  });

  test('displays milestone completion dates', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LearningPlan />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Wait for learning plan to load
    await waitFor(() => {
      expect(screen.getByText(/1-Year Frontend Developer Learning Path/i)).toBeInTheDocument();
    });

    // Check if milestone due dates are displayed
    expect(screen.getByText(/Due: May 28, 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Due: July 28, 2025/i)).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    // Mock API error
    axios.get.mockRejectedValue(new Error('Network error'));
    
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LearningPlan />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Error loading learning plan/i)).toBeInTheDocument();
    });
  });

  test('displays message when no learning plan is available', async () => {
    // Mock empty learning plan
    axios.get.mockResolvedValue({ data: null });
    
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LearningPlan />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check for no plan message
    await waitFor(() => {
      expect(screen.getByText(/No learning plan available/i)).toBeInTheDocument();
      expect(screen.getByText(/Please create a learning plan from your career recommendations/i)).toBeInTheDocument();
    });
  });
});
