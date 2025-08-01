import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SecondaryButton, PrimaryButton, IconButton } from '../../general/buttons';
import { useCourseDetail } from './hooks/useCourseDetail';
import CourseHeader from './components/CourseHeader/CourseHeader';
import UnitsSection from './components/UnitsSection/UnitsSection';
import CourseGoalsSection from './components/CourseGoalsSection/CourseGoalsSection';
import CourseMaterialsSection from './components/CourseMaterialsSection/CourseMaterialsSection';
import './CourseDetail.css';

/**
 * CourseDetail Page - Individual course management interface
 * 
 * Features:
 * - Course overview with key stats and information
 * - Units management with create/edit/reorder functionality
 * - Course goals management with completion tracking
 * - Course materials management with file uploads
 * - Beautiful responsive design following Apple-inspired UI
 * - Empty states with engaging call-to-actions
 * 
 * Following our vision-first approach:
 * - Gorgeous UI that hooks users
 * - Fast, smooth performance
 * - Simple, intuitive interface
 * - Perfect for mobile and desktop
 * - Page-centric architecture
 */
const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const {
    course,
    units,
    courseGoals,
    courseMaterials,
    loading,
    error,
    // Course actions
    handleCourseUpdate,
    // Units actions
    handleCreateUnit,
    handleUpdateUnit,
    handleDeleteUnit,
    // Goals actions
    handleCreateGoal,
    handleUpdateGoal,
    handleDeleteGoal,
    handleToggleGoalComplete,
    // Materials actions
    handleCreateMaterial,
    handleUpdateMaterial,
    handleDeleteMaterial,
    // UI state
    showCreateUnitModal,
    showCreateGoalModal,
    showCreateMaterialModal,
    setShowCreateUnitModal,
    setShowCreateGoalModal,
    setShowCreateMaterialModal
  } = useCourseDetail(courseId);

  // Handle back navigation
  const handleBack = () => {
    navigate('/courses');
  };

  // Loading state
  if (loading) {
    return (
      <div className="course-detail-page">
        <div className="course-detail-header">
          <SecondaryButton onClick={handleBack} size="small">
            ← Back to Courses
          </SecondaryButton>
        </div>
        <div className="course-detail-loading">
          <div className="loading-shimmer course-header-shimmer"></div>
          <div className="loading-sections">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="loading-section">
                <div className="loading-shimmer section-shimmer"></div>
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
      <div className="course-detail-page">
        <div className="course-detail-header">
          <SecondaryButton onClick={handleBack} size="small">
            ← Back to Courses
          </SecondaryButton>
        </div>
        <div className="course-detail-error">
          <div className="error-message">
            <h3>Failed to load course</h3>
            <p>{error}</p>
            <div className="error-actions">
              <PrimaryButton onClick={() => window.location.reload()}>
                Try Again
              </PrimaryButton>
              <SecondaryButton onClick={handleBack}>
                Back to Courses
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="course-detail-page">
        <div className="course-detail-header">
          <SecondaryButton onClick={handleBack} size="small">
            ← Back to Courses
          </SecondaryButton>
        </div>
        <div className="course-detail-error">
          <div className="error-message">
            <h3>Course not found</h3>
            <p>The course you're looking for doesn't exist or you don't have access to it.</p>
            <SecondaryButton onClick={handleBack}>
              Back to Courses
            </SecondaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      {/* Header with navigation */}
      <div className="course-detail-header">
        <SecondaryButton onClick={handleBack} size="small">
          ← Back to Courses
        </SecondaryButton>
        <div className="course-detail-actions">
          <IconButton variant="secondary" size="small">
            ⚙️ Settings
          </IconButton>
        </div>
      </div>

      {/* Course Header Section */}
      <CourseHeader 
        course={course}
        onUpdate={handleCourseUpdate}
      />

      {/* Main Content Sections */}
      <div className="course-detail-content">
        
      {/* Units Section */}
      <UnitsSection
        units={units}
        courseId={courseId}
        onCreateUnit={handleCreateUnit}
        onUpdateUnit={handleUpdateUnit}
        onDeleteUnit={handleDeleteUnit}
        showCreateModal={showCreateUnitModal}
        setShowCreateModal={setShowCreateUnitModal}
      />

      {/* Course Materials Section */}
      <CourseMaterialsSection
        materials={courseMaterials}
        courseId={courseId}
        onCreateMaterial={handleCreateMaterial}
        onUpdateMaterial={handleUpdateMaterial}
        onDeleteMaterial={handleDeleteMaterial}
        showCreateModal={showCreateMaterialModal}
        setShowCreateModal={setShowCreateMaterialModal}
      />

      {/* Course Goals Section */}
      <CourseGoalsSection
        goals={courseGoals}
        courseId={courseId}
        onCreateGoal={handleCreateGoal}
        onUpdateGoal={handleUpdateGoal}
        onDeleteGoal={handleDeleteGoal}
        onToggleComplete={handleToggleGoalComplete}
        showCreateModal={showCreateGoalModal}
        setShowCreateModal={setShowCreateGoalModal}
      />

      </div>
    </div>
  );
};

export default CourseDetail;
