import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Navigation Component - Main navigation links
 * 
 * Features:
 * - Active page highlighting
 * - Smooth hover effects
 * - Keyboard navigation support
 * - Clean, minimal design
 */
const Navigation = ({ currentPath }) => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/courses', label: 'Courses' },
    { path: '/network', label: 'Network' },
  ];

  return (
    <nav className="header-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`header-nav-link ${currentPath === item.path ? 'active' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
