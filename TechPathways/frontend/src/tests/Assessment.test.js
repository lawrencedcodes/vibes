import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Assessment from '../pages/Assessment';
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

// Mock questions data
const mockQuestions = [
  {
    id: 1,
    questionId: 'interest_1',
    text: 'Which of these activities do you enjoy the most?',
    type: 'SINGLE_CHOICE',
    options: [
      'Designing user interfaces and visual elements',
      'Solving complex logical problems',
      'Analyzing data and finding patterns',
      'Building and fixing things',
      'Teaching or explaining concepts to others'
    ],
    category: 'Interest & Passion Exploration'
  },
  {
    id: 2,
    questionId: 'skill_1',
    text: 'How would you rate your problem-solving abilities?',
    type: 'SINGLE_CHOICE',
    options: [
      'Very strong - I enjoy complex problems',
      'Strong - I can usually find solutions',
      'Average - I can solve problems with some guidance',
      'Developing - I find problem-solving challenging',
      'Not sure'
    ],
    category: 'Skill & Strength Assessment'
  },
  {
    id: 3,
    questionId: 'work_1',
    text: 'What type of work environment do you prefer?',
    type: 'SINGLE_CHOICE',
    options: [
      'Office-based with a team',
      'Remote work from home',
      'Hybrid (mix of remote and office)',
      'Flexible co-working spaces',
      'No strong preference'
    ],
    category: 'Work Style & Preferences'
  }
];

describe('Assessment Component', () => {
  beforeEach(() => {
    // Reset mocks
    axios.get.mockReset();
    axios.post.mockReset();
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    
    // Mock JWT token
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-jwt-token';
      return null;
    });
    
    // Mock API responses
    axios.get.mockResolvedValue({ data: mockQuestions });
    axios.post.mockResolvedValue({ data: { id: 1 } });
  });

  test('renders assessment page with questions', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Assessment />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check for loading state
    expect(screen.getByText(/Loading assessment/i)).toBeInTheDocument();

    // Wait for questions to load
    await waitFor(() => {
      expect(screen.getByText(/Tech Career Assessment/i)).toBeInTheDocument();
    });

    // Check if first question is displayed
    expect(screen.getByText(/Which of these activities do you enjoy the most?/i)).toBeInTheDocument();
    
    // Check if category is displayed
    expect(screen.getByText(/Interest & Passion Exploration/i)).toBeInTheDocument();
    
    // Check if options are displayed
    expect(screen.getByText(/Designing user interfaces and visual elements/i)).toBeInTheDocument();
    expect(screen.getByText(/Solving complex logical problems/i)).toBeInTheDocument();
  });

  test('allows user to navigate through questions', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Assessment />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Wait for questions to load
    await waitFor(() => {
      expect(screen.getByText(/Tech Career Assessment/i)).toBeInTheDocument();
    });

    // First question should be visible
    expect(screen.getByText(/Which of these activities do you enjoy the most?/i)).toBeInTheDocument();
    
    // Select an answer
    fireEvent.click(screen.getByText(/Designing user interfaces and visual elements/i));
    
    // Click next button
    fireEvent.click(screen.getByText(/Next/i));
    
    // Second question should now be visible
    await waitFor(() => {
      expect(screen.getByText(/How would you rate your problem-solving abilities?/i)).toBeInTheDocument();
    });
    
    // Select an answer for second question
    fireEvent.click(screen.getByText(/Strong - I can usually find solutions/i));
    
    // Click next button
    fireEvent.click(screen.getByText(/Next/i));
    
    // Third question should now be visible
    await waitFor(() => {
      expect(screen.getByText(/What type of work environment do you prefer?/i)).toBeInTheDocument();
    });
    
    // Previous button should work too
    fireEvent.click(screen.getByText(/Previous/i));
    
    // Second question should be visible again
    await waitFor(() => {
      expect(screen.getByText(/How would you rate your problem-solving abilities?/i)).toBeInTheDocument();
    });
  });

  test('submits assessment answers correctly', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Assessment />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Wait for questions to load
    await waitFor(() => {
      expect(screen.getByText(/Tech Career Assessment/i)).toBeInTheDocument();
    });

    // Answer all questions
    // Question 1
    fireEvent.click(screen.getByText(/Designing user interfaces and visual elements/i));
    fireEvent.click(screen.getByText(/Next/i));
    
    // Question 2
    await waitFor(() => {
      expect(screen.getByText(/How would you rate your problem-solving abilities?/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Strong - I can usually find solutions/i));
    fireEvent.click(screen.getByText(/Next/i));
    
    // Question 3
    await waitFor(() => {
      expect(screen.getByText(/What type of work environment do you prefer?/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Remote work from home/i));
    
    // Submit button should be visible on last question
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    
    // Click submit
    fireEvent.click(screen.getByText(/Submit/i));
    
    // Check if API was called with correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      
      // Check if the correct endpoint was called
      expect(axios.post.mock.calls[0][0]).toContain('/api/assessments/submit');
      
      // Check if the correct data was sent
      const sentData = axios.post.mock.calls[0][1];
      expect(sentData.answers).toHaveLength(3);
      expect(sentData.answers[0].questionId).toBe('interest_1');
      expect(sentData.answers[0].answerValue).toBe('Designing user interfaces and visual elements');
      expect(sentData.answers[1].questionId).toBe('skill_1');
      expect(sentData.answers[1].answerValue).toBe('Strong - I can usually find solutions');
      expect(sentData.answers[2].questionId).toBe('work_1');
      expect(sentData.answers[2].answerValue).toBe('Remote work from home');
    });
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/Assessment submitted successfully/i)).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock API error
    axios.get.mockRejectedValue(new Error('Network error'));
    
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Assessment />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Error loading assessment questions/i)).toBeInTheDocument();
    });
  });
});
