import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * MobileMenu Component - Mobile navigation menu
 * 
 * Features:
 * - Full-screen mobile menu
 * - User profile section
 * - Logout functionality
 * - Smooth slide animations
 * - Touch-friendly design
 */
const MobileMenu = ({ isOpen, onClose, currentPath, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/courses', label: 'Courses' },
    { path: '/network', label: 'Network' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    onClose();
  };

  const handleNavClick = () => {
    onClose();
  };

  const getUserInitials = (user) => {
    if (!user) return 'U';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    } else if (firstName) {
      return firstName[0];
    } else if (user.username) {
      return user.username[0];
    }
    
    return 'U';
  };

  const getUserDisplayName = (user) => {
    if (!user) return 'User';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (user.username) {
      return user.username;
    }
    
    return 'User';
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`header-mobile-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      
      {/* Mobile Menu */}
      <div className={`header-mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="header-mobile-menu-content">
          
          {/* Navigation Links */}
          <nav className="header-mobile-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`header-mobile-nav-link ${currentPath === item.path ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Profile Section */}
          {user && (
            <div className="header-mobile-user">
              <div className="header-mobile-user-info">
                <div className="header-user-avatar">
                  {getUserInitials(user)}
                </div>
                <div>
                  <div className="header-user-name">
                    {getUserDisplayName(user)}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="header-mobile-user-actions">
                <button
                  className="header-mobile-user-action"
                  onClick={() => {
                    onClose();
                    // TODO: Navigate to profile/account settings
                    console.log('Navigate to profile');
                  }}
                >
                  <span>Account Settings</span>
                </button>
                <button
                  className="header-mobile-user-action"
                  onClick={() => {
                    onClose();
                    // TODO: Navigate to help/support
                    console.log('Navigate to help');
                  }}
                >
                  <span>Help & Support</span>
                </button>
                <button
                  className="header-mobile-user-action logout"
                  onClick={handleLogout}
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
