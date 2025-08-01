import React from 'react';
import { PrimaryButton, IconButton } from '../../general/buttons';
import CourseCard from '../../general/courses/CourseCard/CourseCard';
import CourseCreateModal from '../../general/courses/CourseCreateModal/CourseCreateModal';
import { useCourses } from './hooks/useCourses';
import './Courses.css';

/**
 * Courses Page - Main course management interface
 * 
 * Features:
 * - Beautiful course grid with responsive design
 * - Real-time search functionality
 * - Course creation integration
 * - Smooth animations and loading states
 * - Mobile-first responsive design
 * 
 * Following our vision-first approach:
 * - Gorgeous UI that hooks users
 * - Fast, smooth performance
 * - Simple, intuitive interface
 * - Perfect for mobile and desktop
 */
const Courses = () => {
  const {
    courses,
    loading,
    searchLoading,
    error,
    searchQuery,
    showCreateModal,
    handleSearchChange,
    handleCreateCourse,
    handleCloseCreateModal,
    handleCourseCreated,
    handleViewCourse,
    handleEditCourse,
    hasResults,
    isSearching
  } = useCourses();

  // Loading state
  if (loading) {
    return (
      <div className="courses-page">
        <div className="courses-header">
          <h1>My Courses</h1>
          <PrimaryButton onClick={handleCreateCourse}>
            Create Course
          </PrimaryButton>
        </div>
        <div className="courses-loading">
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-card">
                <div className="loading-shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="courses-page">
        <div className="courses-header">
          <h1>My Courses</h1>
          <PrimaryButton onClick={handleCreateCourse}>
            Create Course
          </PrimaryButton>
        </div>
        <div className="courses-error">
          <div className="error-message">
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <PrimaryButton onClick={() => window.location.reload()}>
              Try Again
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      {/* Header Section */}
      <div className="courses-header">
        <div className="courses-title">
          <h1>My Courses</h1>
          <span className="courses-count">
            {courses.length} course{courses.length !== 1 ? 's' : ''}
          </span>
        </div>
        <PrimaryButton onClick={handleCreateCourse}>
          Create Course
        </PrimaryButton>
      </div>

      {/* Search Section */}
      <div className="courses-search">
        <div className="search-input-container">
          <IconButton 
            variant="ghost" 
            size="small" 
            className="search-icon"
            disabled
          >
            🔍
          </IconButton>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
          {searchLoading && (
            <div className="search-loading">
              <div className="search-spinner"></div>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="courses-content">
        {/* Empty State - No courses */}
        {!hasResults && !isSearching && (
          <div className="courses-empty">
            <div className="empty-illustration">
              <div className="empty-icon">📚</div>
              <h2>No courses yet</h2>
              <p>Create your first course to get started teaching</p>
              <PrimaryButton onClick={handleCreateCourse}>
                Create Your First Course
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* Empty State - No search results */}
        {!hasResults && isSearching && (
          <div className="courses-empty">
            <div className="empty-illustration">
              <div className="empty-icon">🔍</div>
              <h2>No courses found</h2>
              <p>Try searching with different keywords</p>
              <PrimaryButton 
                variant="secondary" 
                onClick={() => handleSearchChange('')}
              >
                Clear Search
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* Course Grid */}
        {hasResults && (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                showActions={true}
                onView={handleViewCourse}
                onClick={handleViewCourse}
              />
            ))}
          </div>
        )}
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

export default Courses;
