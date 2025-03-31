import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../src/theme/ThemeConfig';
import CommunityPage from '../src/pages/CommunityPage';

// Mock components that might be used in CommunityPage
jest.mock('../src/components/layout/Header', () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Header</div>;
  };
});

jest.mock('../src/components/layout/Footer', () => {
  return function MockFooter() {
    return <div data-testid="mock-footer">Footer</div>;
  };
});

describe('CommunityPage Component', () => {
  const renderWithProviders = (ui) => {
    return render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {ui}
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  test('renders the community page title', () => {
    renderWithProviders(<CommunityPage />);
    const titleElement = screen.getByRole('heading', { name: /community & support/i });
    expect(titleElement).toBeInTheDocument();
  });

  test('renders all four tabs', () => {
    renderWithProviders(<CommunityPage />);
    
    // Check for all tabs
    expect(screen.getByRole('tab', { name: /forum/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /expert q&a/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /success stories/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /peer support/i })).toBeInTheDocument();
  });

  test('forum tab is active by default', () => {
    renderWithProviders(<CommunityPage />);
    
    // Check that forum tab is selected by default
    const forumTab = screen.getByRole('tab', { name: /forum/i });
    expect(forumTab).toHaveAttribute('aria-selected', 'true');
    
    // Check that forum content is displayed
    expect(screen.getByText(/discussion categories/i)).toBeInTheDocument();
  });

  test('switching tabs changes displayed content', () => {
    renderWithProviders(<CommunityPage />);
    
    // Click on Expert Q&A tab
    const qaTab = screen.getByRole('tab', { name: /expert q&a/i });
    fireEvent.click(qaTab);
    
    // Check that Q&A content is displayed
    expect(screen.getByText(/upcoming expert q&a sessions/i)).toBeInTheDocument();
    
    // Click on Success Stories tab
    const storiesTab = screen.getByRole('tab', { name: /success stories/i });
    fireEvent.click(storiesTab);
    
    // Check that Success Stories content is displayed
    expect(screen.getByText(/real stories from people/i)).toBeInTheDocument();
    
    // Click on Peer Support tab
    const supportTab = screen.getByRole('tab', { name: /peer support/i });
    fireEvent.click(supportTab);
    
    // Check that Peer Support content is displayed
    expect(screen.getByText(/peer support network/i)).toBeInTheDocument();
  });

  test('forum categories are displayed', () => {
    renderWithProviders(<CommunityPage />);
    
    // Check for forum categories
    expect(screen.getByText(/web development/i)).toBeInTheDocument();
    expect(screen.getByText(/data science/i)).toBeInTheDocument();
  });

  test('clicking on a category shows topics', () => {
    renderWithProviders(<CommunityPage />);
    
    // Click on a category
    const webDevCategory = screen.getByText(/web development/i);
    fireEvent.click(webDevCategory);
    
    // Check that topics are displayed
    expect(screen.getByText(/how to start with react/i)).toBeInTheDocument();
    expect(screen.getByText(/back to categories/i)).toBeInTheDocument();
  });

  test('expert Q&A sessions are displayed', () => {
    renderWithProviders(<CommunityPage />);
    
    // Click on Expert Q&A tab
    const qaTab = screen.getByRole('tab', { name: /expert q&a/i });
    fireEvent.click(qaTab);
    
    // Check for Q&A sessions
    expect(screen.getByText(/breaking into tech as a career changer/i)).toBeInTheDocument();
    expect(screen.getByText(/frontend development best practices/i)).toBeInTheDocument();
  });

  test('success stories are displayed', () => {
    renderWithProviders(<CommunityPage />);
    
    // Click on Success Stories tab
    const storiesTab = screen.getByRole('tab', { name: /success stories/i });
    fireEvent.click(storiesTab);
    
    // Check for success stories
    expect(screen.getByText(/from teacher to software engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/my journey from retail to data analysis/i)).toBeInTheDocument();
  });

  test('peer support options are displayed', () => {
    renderWithProviders(<CommunityPage />);
    
    // Click on Peer Support tab
    const supportTab = screen.getByRole('tab', { name: /peer support/i });
    fireEvent.click(supportTab);
    
    // Check for peer support options
    expect(screen.getByText(/find support/i)).toBeInTheDocument();
    expect(screen.getByText(/offer support/i)).toBeInTheDocument();
    expect(screen.getByText(/peer support guidelines/i)).toBeInTheDocument();
  });

  test('renders in dark mode', () => {
    renderWithProviders(<CommunityPage />);
    
    // Check if the component renders with dark mode styling
    const containerElement = screen.getByRole('main');
    expect(containerElement).toHaveStyle({ backgroundColor: '#121212' });
  });

  test('is responsive and mobile-friendly', () => {
    renderWithProviders(<CommunityPage />);
    
    // Check if the container has responsive styling
    const containerElement = screen.getByRole('main');
    expect(containerElement).toHaveStyle({ maxWidth: '100%' });
  });
});
