import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from './components/Navigation';
import UserProfile from './components/UserProfile';
import './HeaderPanel.css';

/**
 * HeaderPanel Component - Global navigation bar
 * 
 * Features:
 * - Apple-inspired clean design
 * - Simple responsive design (no mobile-specific logic)
 * - Active page highlighting
 * - User profile section with dropdown
 * - Smooth animations and transitions
 * 
 * Following our vision-first approach:
 * - Gorgeous UI that hooks users
 * - Fast, smooth performance
 * - Minimal MVP focus
 * - Premium feel with perfect spacing
 * - Simple responsive design like rest of our pages
 */
const HeaderPanel = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Don't show header on auth pages
  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
    return null;
  }

  return (
    <header className="header-panel">
      <div className="header-panel-container">
        
        {/* Brand/Logo Section */}
        <div className="header-brand">
          <h1 className="header-logo">Platform</h1>
        </div>

        {/* Main Navigation */}
        <Navigation currentPath={location.pathname} />

        {/* User Profile Section */}
        <UserProfile user={user} />

      </div>
    </header>
  );
};

export default HeaderPanel;
