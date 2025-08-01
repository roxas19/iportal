import React, { useState } from 'react';
import { SecondaryButton, IconButton } from '../../../../general/buttons';
import './CourseHeader.css';

/**
 * CourseHeader Component - Course overview and basic information
 * 
 * Features:
 * - Course title, description, and key metadata
 * - Student count and enrollment information
 * - Quick stats and course status
 * - Edit course button for instructors
 * - Beautiful Apple-inspired design
 * 
 * Following our design system and responsive patterns
 */
const CourseHeader = ({ course, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: course?.title || '',
    description: course?.description || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update course:', error);
      // TODO: Show error toast
    }
  };

  const handleCancel = () => {
    setEditData({
      title: course?.title || '',
      description: course?.description || ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!course) {
    return null;
  }

  const enrollmentCount = course.enrollment_count || course.students || 0;
  const maxEnrollments = course.max_enrollments;
  const isActive = course.is_active !== false;

  return (
    <div className="course-header">
      <div className="course-header-main">
        <div className="course-header-content">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="course-title-input"
                placeholder="Course title"
              />
              <textarea
                value={editData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="course-description-input"
                placeholder="Course description"
                rows={3}
              />
              <div className="course-edit-actions">
                <SecondaryButton onClick={handleCancel} size="small">
                  Cancel
                </SecondaryButton>
                <SecondaryButton onClick={handleSave} size="small">
                  Save Changes
                </SecondaryButton>
              </div>
            </>
          ) : (
            <>
              <div className="course-title-section">
                <h1 className="course-title">{course.title}</h1>
                <div className="course-status">
                  <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? 'Active' : 'Draft'}
                  </span>
                  {course.category && (
                    <span className="category-badge">
                      {course.category.name || course.category}
                    </span>
                  )}
                </div>
              </div>
              
              {course.description && (
                <p className="course-description">{course.description}</p>
              )}
              
              <div className="course-edit-section">
                <IconButton 
                  variant="secondary" 
                  size="small" 
                  onClick={handleEdit}
                >
                  ✏️ Edit Details
                </IconButton>
              </div>
            </>
          )}
        </div>

        {/* Course image */}
        {course.image && (
          <div className="course-header-image">
            <img src={course.image} alt={course.title} />
          </div>
        )}
      </div>

      {/* Course stats */}
      <div className="course-header-stats">
        <div className="stat-item">
          <span className="stat-value">{enrollmentCount}</span>
          <span className="stat-label">
            {enrollmentCount === 1 ? 'Student' : 'Students'}
            {maxEnrollments && ` / ${maxEnrollments}`}
          </span>
        </div>
        
        <div className="stat-item">
          <span className="stat-value">{course.units?.length || 0}</span>
          <span className="stat-label">Units</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-value">{course.course_goals?.length || 0}</span>
          <span className="stat-label">Goals</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-value">{course.course_materials?.length || 0}</span>
          <span className="stat-label">Materials</span>
        </div>

        {course.created_at && (
          <div className="stat-item">
            <span className="stat-value">
              {new Date(course.created_at).toLocaleDateString()}
            </span>
            <span className="stat-label">Created</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseHeader;
