import React from 'react';
import { SecondaryButton, PrimaryButton } from '../../buttons';
import './CourseCard.css';

/**
 * CourseCard - A reusable component for displaying course information
 * 
 * Props:
 * - course: Object containing course data (title, status, students, lastUpdated, etc.)
 * - size: 'compact' | 'standard' | 'full' (default: 'standard')
 * - variant: 'default' | 'featured' | 'enrolled' (default: 'default')
 * - showActions: Boolean to show/hide action buttons (default: true)
 * - onEdit: Function called when edit button is clicked
 * - onView: Function called when view button is clicked
 * - onClick: Function called when the card itself is clicked
 */
const CourseCard = ({ 
  course,
  size = 'standard',
  variant = 'default',
  showActions = true,
  onEdit,
  onView,
  onClick
}) => {
  const handleEditCourse = (e) => {
    e.stopPropagation(); // Prevent card click when clicking edit button
    if (onEdit) onEdit(course.id);
  };

  const handleViewCourse = (e) => {
    e.stopPropagation(); // Prevent card click when clicking view button
    if (onView) onView(course.id);
  };

  const handleCardClick = () => {
    if (onClick) onClick(course.id);
  };

  const cardClasses = [
    'course-card',
    `course-card--${size}`,
    `course-card--${variant}`,
    onClick ? 'course-card--clickable' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses} 
      onClick={handleCardClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e);
        }
      } : undefined}
    >
      <div className="course-card__header">
        <h3 className="course-card__title">{course.title}</h3>
      </div>
      
      {size !== 'compact' && (
        <div className="course-card__stats">
          <span className="course-card__students">
            👥 {course.students || 0} students
          </span>
        </div>
      )}
      
      {showActions && size !== 'compact' && (
        <div className="course-card__actions">
          <SecondaryButton 
            size="small" 
            onClick={handleEditCourse}
          >
            Edit
          </SecondaryButton>
          <PrimaryButton 
            size="small" 
            onClick={handleViewCourse}
          >
            View
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
