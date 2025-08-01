import React from 'react';
import { PrimaryButton, IconButton } from '../../../../general/buttons';
import GoalCreateModal from '../GoalCreateModal/GoalCreateModal';
import './CourseGoalsSection.css';

/**
 * CourseGoalsSection Component - Course learning goals management
 * 
 * Features:
 * - Display list of course learning goals
 * - Create new goals with modal form
 * - Edit and delete existing goals
 * - Goal completion tracking for students
 * - Beautiful empty state when no goals exist
 * 
 * Following our design system and responsive patterns
 */
const CourseGoalsSection = ({ 
  goals, 
  courseId, 
  onCreateGoal, 
  onUpdateGoal, 
  onDeleteGoal,
  onToggleComplete,
  showCreateModal,
  setShowCreateModal
}) => {

  const handleCreateGoal = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleGoalCreated = async (goalData) => {
    try {
      await onCreateGoal(goalData);
    } catch (error) {
      console.error('Failed to create goal:', error);
      throw error;
    }
  };

  const handleEditGoal = (goalId) => {
    // TODO: Implement goal editing
    console.log('Edit goal:', goalId);
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      try {
        await onDeleteGoal(goalId);
      } catch (error) {
        console.error('Failed to delete goal:', error);
        // TODO: Show error toast
      }
    }
  };

  const handleToggleComplete = async (goalId, completed) => {
    try {
      await onToggleComplete(goalId, completed);
    } catch (error) {
      console.error('Failed to toggle goal completion:', error);
      // TODO: Show error toast
    }
  };

  const getTaskTypeIcon = (taskType) => {
    const iconMap = {
      assignment: '📝',
      exercise: '💪',
      quiz: '❓',
      reading: '📖',
      video_watch: '🎥',
      discussion: '💬',
      project: '🚀'
    };
    return iconMap[taskType] || '📝';
  };

  const getTaskTypeLabel = (taskType) => {
    const labelMap = {
      assignment: 'Assignment',
      exercise: 'Exercise',
      quiz: 'Quiz',
      reading: 'Reading',
      video_watch: 'Video',
      discussion: 'Discussion',
      project: 'Project'
    };
    return labelMap[taskType] || 'Task';
  };

  return (
    <div className="course-section goals-section">
      <div className="section-header">
        <h2 className="section-title">
          Course Goals
          {goals.length > 0 && (
            <span className="section-count">({goals.length})</span>
          )}
        </h2>
        <PrimaryButton size="small" onClick={handleCreateGoal}>
          + Add Goal
        </PrimaryButton>
      </div>

      {goals.length === 0 ? (
        <div className="section-empty">
          <div className="section-empty-icon">🎯</div>
          <h4>No learning goals yet</h4>
          <p>
            Set clear learning objectives for your course. Goals help students 
            understand what they'll achieve by completing your course.
          </p>
          <PrimaryButton onClick={handleCreateGoal}>
            Set Your First Goal
          </PrimaryButton>
        </div>
      ) : (
        <div className="section-list">
          {goals.map((goal, index) => (
            <div key={goal.id} className="section-item goal-item">
              <div className="item-header">
                <div className="item-title-section">
                  <h3 className="item-title">
                    <span className="goal-icon">
                      {getTaskTypeIcon(goal.task_type)}
                    </span>
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="item-description">{goal.description}</p>
                  )}
                </div>
                <div className="item-actions">
                  <IconButton 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleEditGoal(goal.id)}
                  >
                    ✏️
                  </IconButton>
                  <IconButton 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    🗑️
                  </IconButton>
                </div>
              </div>
              
              <div className="item-meta">
                <span className="item-type goal-type">
                  {getTaskTypeLabel(goal.task_type)}
                </span>
                <span className="goal-order">
                  Goal {goal.order || index + 1}
                </span>
                <span className="goal-created">
                  Created {new Date(goal.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Goal Creation Modal */}
      <GoalCreateModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onGoalCreated={handleGoalCreated}
        courseId={courseId}
      />
    </div>
  );
};

export default CourseGoalsSection;
