import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, PrimaryButton, SecondaryButton } from '../../../../general/buttons';
import CourseCard from '../../../../general/courses/CourseCard/CourseCard';
import CourseCreateModal from '../../../../general/courses/CourseCreateModal/CourseCreateModal';
import '../../styles/shared-panel.css';
import './CoursesPanel.css';

/**
 * Courses Panel Component (Left Panel)
 * 
 * Features:
 * - Display user's recent courses (first 3)
 * - Course status indicators (Draft, Live, Archived)
 * - Student count and basic stats
 * - Create new course button
 * 
 * Uses shared panel styles for consistency with NetworkPanel.
 */
const CoursesPanel = ({ courses = [], courseStats = {}, loading = false, onCourseCreated }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateCourse = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCourseCreated = (newCourse) => {
    if (onCourseCreated) {
      onCourseCreated(newCourse);
    }
    setShowCreateModal(false);
  };

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleViewAllCourses = () => {
    navigate('/courses');
  };

  if (loading) {
    return (
      <div className="panel-base courses-panel">
        <div className="panel-header">
          <h2>My Courses</h2>
        </div>
        <div className="panel-content">
          <div className="panel-loading">Loading courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-base courses-panel">
      <div className="panel-header">
        <h2>My Courses</h2>
        <IconButton 
          variant="primary" 
          size="small"
          onClick={handleCreateCourse}
          className="panel-header-action"
        >
          + Course
        </IconButton>
      </div>
      
      <div className="panel-content">
        {courses.length === 0 ? (
          <div className="panel-empty-state">
            <p>No courses yet</p>
            <PrimaryButton onClick={handleCreateCourse}>
              Create Your First Course
            </PrimaryButton>
          </div>
        ) : (
          <>
            {/* Recent Courses Section */}
            <div className="courses-panel__section">
              <h3>Recent Courses <span className="course-count">({courseStats?.total_courses || courses.length} total)</span></h3>
              <div className="panel-list">
                {courses.slice(0, 3).map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    showActions={true}
                    onView={handleViewCourse}
                    onClick={handleViewCourse}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="panel-footer">
        <SecondaryButton 
          size="small"
          onClick={handleViewAllCourses}
        >
          View All Courses
        </SecondaryButton>
      </div>

      {/* Course Creation Modal */}
      <CourseCreateModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onCourseCreated={handleCourseCreated}
      />
    </div>
  );
};

export default CoursesPanel;
