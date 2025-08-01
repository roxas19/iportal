import React, { useState } from 'react';
import FormModal from '../../../../general/FormModal/FormModal';

/**
 * GoalCreateModal Component - Create new course goal
 * 
 * Features:
 * - Goal title and description input
 * - Goal type selection (assignment, quiz, etc.)
 * - Order specification
 * - Form validation and error handling
 * 
 * Following our FormModal pattern and design system
 */
const GoalCreateModal = ({ isOpen, onClose, onGoalCreated, courseId }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Goal type options
  const goalTypeOptions = [
    { value: 'assignment', label: '📝 Assignment' },
    { value: 'exercise', label: '💪 Exercise' },
    { value: 'quiz', label: '❓ Quiz' },
    { value: 'reading', label: '📖 Reading Material' },
    { value: 'video_watch', label: '🎥 Video Watch' },
    { value: 'discussion', label: '💬 Discussion Post' },
    { value: 'project', label: '🚀 Project Work' }
  ];

  // Form field configuration
  const fields = [
    {
      name: 'title',
      label: 'Goal Title',
      type: 'text',
      placeholder: 'e.g., Complete React Basics Quiz',
      required: true,
      validation: {
        required: true,
        maxLength: 255,
        maxLengthMessage: 'Title must be less than 255 characters'
      }
    },
    {
      name: 'description',
      label: 'Goal Description',
      type: 'textarea',
      placeholder: 'Describe what students need to accomplish...',
      rows: 3,
      help: 'Provide clear instructions and expectations for this learning goal'
    },
    {
      name: 'task_type',
      label: 'Goal Type',
      type: 'select',
      placeholder: 'Select goal type',
      required: true,
      options: goalTypeOptions,
      validation: {
        required: true,
        requiredMessage: 'Please select a goal type'
      }
    },
    {
      name: 'order',
      label: 'Goal Order',
      type: 'number',
      placeholder: '1',
      min: 1,
      help: 'The order of this goal within the course (1, 2, 3, etc.)'
    }
  ];

  // Form actions
  const actions = [
    {
      type: 'submit',
      variant: 'primary',
      label: loading ? 'Creating Goal...' : 'Create Goal',
      loading,
      fullWidth: true
    },
    {
      variant: 'secondary',
      label: 'Cancel',
      onClick: onClose,
      fullWidth: true
    }
  ];

  const handleSubmit = async (formData) => {
    setLoading(true);
    setErrors({});
    setGeneralError('');

    try {
      // Prepare submission data
      const submitData = {
        title: formData.title,
        description: formData.description || '',
        task_type: formData.task_type,
        order: formData.order ? parseInt(formData.order) : undefined
      };

      await onGoalCreated(submitData);
      
      // Success - modal will be closed by parent component
    } catch (error) {
      console.error('Goal creation error:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Learning Goal"
      subtitle="Set a clear learning objective for your course"
      fields={fields}
      actions={actions}
      onSubmit={handleSubmit}
      loading={loading}
      errors={errors}
      generalError={generalError}
      showCloseButton={true}
      className="goal-create-modal"
    />
  );
};

export default GoalCreateModal;
