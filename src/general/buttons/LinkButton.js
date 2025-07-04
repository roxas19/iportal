import React from 'react';
import './LinkButton.css';

/**
 * LinkButton - Text-based navigation and inline actions
 * 
 * Usage:
 * - Inline text links (Register, Login in switch text)
 * - Navigation actions that don't need button appearance
 * - Secondary text actions
 * 
 * Props:
 * - children: Button text/content
 * - onClick: Click handler function
 * - type: 'button' | 'submit' | 'reset' (default: 'button')
 * - disabled: Boolean (default: false)
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - className: Additional CSS classes
 */
const LinkButton = ({ 
  children, 
  onClick,
  type = 'button',
  disabled = false,
  size = 'medium',
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    'btn-link',
    `btn-link--${size}`,
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

export default LinkButton;
