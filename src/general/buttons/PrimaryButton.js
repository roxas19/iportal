import React from 'react';
import './PrimaryButton.css';

/**
 * PrimaryButton - Main call-to-action button
 * 
 * Usage:
 * - Form submissions (Login, Register, Create)
 * - Primary actions (Save, Submit, Create Account)
 * - Main CTAs in empty states
 * 
 * Props:
 * - children: Button text/content
 * - onClick: Click handler function
 * - type: 'button' | 'submit' | 'reset' (default: 'button')
 * - disabled: Boolean (default: false)
 * - loading: Boolean - shows loading state (default: false)
 * - fullWidth: Boolean - spans full container width (default: false)
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - className: Additional CSS classes
 */
const PrimaryButton = ({ 
  children, 
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'medium',
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    'btn-primary',
    `btn-primary--${size}`,
    fullWidth && 'btn-primary--full-width',
    loading && 'btn-primary--loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="btn-primary__loading">
          <span className="btn-primary__spinner"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default PrimaryButton;
