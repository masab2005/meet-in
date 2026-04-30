import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import MeetINLandingPage from '../app/landing/page'

// Mock next/link to avoid errors about routing in tests
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Landing Page', () => {
  it('renders the main heading', () => {
    render(<MeetINLandingPage />)
    
    // Check if the main heading exists
    const heading = screen.getByRole('heading', { name: /MeetIN/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders login and join links', () => {
    render(<MeetINLandingPage />)
    
    // Check if the links are present
    const joinLink = screen.getByText(/Join Now/i)
    const loginLink = screen.getByText(/Log In/i)
    
    expect(joinLink).toBeInTheDocument()
    expect(loginLink).toBeInTheDocument()
  })
})
