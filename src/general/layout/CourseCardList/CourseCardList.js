import React from 'react';
import CourseCard from '../../courses/CourseCard/CourseCard';
import './CourseCardList.css';

/**
 * CourseCardList - Layout container for course cards in list format
 * 
 * Provides horizontal/vertical list layout for course cards.
 * Separates layout concerns from CourseCard component itself.
 * 
 * Used in: Dashboard panels, sidebar lists, condensed views
 */
const CourseCardList = ({ 
  courses = [], 
  variant = 'horizontal', // 'horizontal' | 'vertical'
  size = 'standard',
  showActions = true,
  onView,
  onEdit,
  onClick,
  className = '',
  ...props 
}) => {
  const containerClass = [
    'course-card-list',
    `course-card-list--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass} {...props}>
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          size={size}
          showActions={showActions}
          onView={onView}
          onEdit={onEdit}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export default CourseCardList;
