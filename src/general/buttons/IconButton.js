import React from 'react';
import './IconButton.css';

/**
 * IconButton - Compact actions with optional icons
 * 
 * Usage:
 * - Header action buttons (+ Course, + Invite)
 * - Compact actions in lists or cards
 * - Actions where space is limited
 * 
 * Props:
 * - children: Button text/content (can include icons)
 * - onClick: Click handler function
 * - type: 'button' | 'submit' | 'reset' (default: 'button')
 * - disabled: Boolean (default: false)
 * - variant: 'primary' | 'secondary' | 'ghost' (default: 'primary')
 * - size: 'small' | 'medium' | 'large' (default: 'small')
 * - className: Additional CSS classes
 */
const IconButton = ({ 
  children, 
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'small',
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    'btn-icon',
    `btn-icon--${variant}`,
    `btn-icon--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
