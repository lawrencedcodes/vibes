import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the ThemeToggle component since it might use context/hooks that need providers
jest.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>
}))

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', { 
      name: /Empowering Your Journey Into Tech/i 
    })
    
    expect(heading).toBeInTheDocument()
  })

  it('renders the "Start Your Journey" button', () => {
    render(<Home />)
    
    const button = screen.getByRole('button', {
      name: /Start Your Journey/i
    })
    
    expect(button).toBeInTheDocument()
  })
})
