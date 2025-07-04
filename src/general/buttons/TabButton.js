import React from 'react';
import './TabButton.css';

/**
 * TabButton - Toggle and switch actions
 * 
 * Usage:
 * - Tab navigation (Login/Register tabs)
 * - Toggle between views or modes
 * - Filter buttons with active/inactive states
 * 
 * Props:
 * - children: Button text/content
 * - onClick: Click handler function
 * - active: Boolean - whether this tab is currently active (default: false)
 * - disabled: Boolean (default: false)
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - className: Additional CSS classes
 */
const TabButton = ({ 
  children, 
  onClick,
  active = false,
  disabled = false,
  size = 'medium',
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    'btn-tab',
    `btn-tab--${size}`,
    active && 'btn-tab--active',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      {...props}
    >
      {children}
    </button>
  );
};

export default TabButton;
