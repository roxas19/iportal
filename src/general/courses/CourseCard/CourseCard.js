import React from 'react';
import { SecondaryButton, ViewButton } from '../../buttons';
import './CourseCard.css';

/**
 * CourseCard - A simple, reusable component for displaying course information
 * 
 * Props:
 * - course: Object containing course data (title, status, students, lastUpdated, etc.)
 * - showActions: Boolean to show/hide action buttons (default: true)
 * - onEdit: Function called when edit button is clicked
 * - onView: Function called when view button is clicked
 * - onClick: Function called when the card itself is clicked
 */
const CourseCard = ({ 
  course,
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
      
      <div className="course-card__stats">
        <span className="course-card__students">
          👥 {course.students || 0} students
        </span>
      </div>
      
      {showActions && (
        <div className="course-card__actions">
          {onEdit && (
            <SecondaryButton 
              size="small" 
              onClick={handleEditCourse}
            >
              Edit
            </SecondaryButton>
          )}
          {onView && (
            <ViewButton 
              variant="secondary"
              size="small" 
              onClick={handleViewCourse}
            >
              View
            </ViewButton>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseCard;
