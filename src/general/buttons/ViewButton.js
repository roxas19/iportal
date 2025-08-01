import React from 'react';
import { PrimaryButton } from './';
import './ViewButton.css';

/**
 * ViewButton Component
 * 
 * A specialized button for "View" actions that inherits from PrimaryButton
 * but provides consistent styling and behavior specifically for viewing items.
 * 
 * Uses the existing button system foundation for consistency.
 * 
 * Props:
 * - size: 'small' | 'medium' | 'large' (default: 'small' for cards)
 * - variant: 'primary' | 'secondary' (default: 'primary')
 * - disabled: boolean (default: false)
 * - loading: boolean (default: false)
 * - children: React node (default: 'View')
 * - onClick: function
 * - className: string
 * - All other PrimaryButton props
 */
const ViewButton = ({
  size = 'small', // Default to small for card usage
  variant = 'primary',
  children = 'View',
  className = '',
  ...props
}) => {
  // Use PrimaryButton as base for primary variant
  if (variant === 'primary') {
    return (
      <PrimaryButton
        size={size}
        className={`view-button view-button--primary ${className}`}
        {...props}
      >
        {children}
      </PrimaryButton>
    );
  }
  
  // For secondary variant, use custom styling that matches SecondaryButton
  const buttonClasses = [
    'view-button',
    'view-button--secondary',
    `view-button--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default ViewButton;
