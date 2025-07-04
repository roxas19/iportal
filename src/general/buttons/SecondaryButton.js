import React from 'react';
import './SecondaryButton.css';

/**
 * SecondaryButton - Secondary actions and outline buttons
 * 
 * Usage:
 * - Secondary actions (View All, Cancel, Back)
 * - Less prominent actions next to primary buttons
 * - Footer actions in panels
 * 
 * Props:
 * - children: Button text/content
 * - onClick: Click handler function
 * - type: 'button' | 'submit' | 'reset' (default: 'button')
 * - disabled: Boolean (default: false)
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - className: Additional CSS classes
 */
const SecondaryButton = ({ 
  children, 
  onClick,
  type = 'button',
  disabled = false,
  size = 'medium',
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    'btn-secondary',
    `btn-secondary--${size}`,
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

export default SecondaryButton;
