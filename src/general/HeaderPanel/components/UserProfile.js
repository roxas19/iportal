import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * UserProfile Component - User profile section with dropdown
 * 
 * Features:
 * - User avatar with initials
 * - Profile dropdown menu
 * - Logout functionality
 * - Click outside to close
 * - Smooth animations
 */
const UserProfile = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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

  if (!user) return null;

  return (
    <div className="header-user" ref={dropdownRef}>
      <button
        className="header-user-button"
        onClick={toggleDropdown}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className="header-user-avatar">
          {getUserInitials(user)}
        </div>
        <span className="header-user-name">
          {getUserDisplayName(user)}
        </span>
        <span className="header-user-chevron">▼</span>
      </button>

      <div className={`header-user-dropdown ${isDropdownOpen ? 'open' : ''}`}>
        <button
          className="header-user-dropdown-item"
          onClick={() => {
            setIsDropdownOpen(false);
            // TODO: Navigate to profile/account settings
            console.log('Navigate to profile');
          }}
        >
          <span>Account Settings</span>
        </button>
        <button
          className="header-user-dropdown-item"
          onClick={() => {
            setIsDropdownOpen(false);
            // TODO: Navigate to help/support
            console.log('Navigate to help');
          }}
        >
          <span>Help & Support</span>
        </button>
        <button
          className="header-user-dropdown-item"
          onClick={handleLogout}
        >
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
