import React, { useState } from 'react';
import FormModal from '../../../../general/FormModal/FormModal';

/**
 * UnitCreateModal Component - Create new course unit
 * 
 * Features:
 * - Unit title and description input
 * - Order specification
 * - Main session URL (optional)
 * - Form validation and error handling
 * 
 * Following our FormModal pattern and design system
 */
const UnitCreateModal = ({ isOpen, onClose, onUnitCreated, courseId }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Form field configuration
  const fields = [
    {
      name: 'title',
      label: 'Unit Title',
      type: 'text',
      placeholder: 'e.g., Introduction to React',
      required: true,
      validation: {
        required: true,
        maxLength: 200,
        maxLengthMessage: 'Title must be less than 200 characters'
      }
    },
    {
      name: 'description',
      label: 'Unit Description',
      type: 'textarea',
      placeholder: 'Describe what students will learn in this unit...',
      rows: 3,
      help: 'Explain the learning objectives and what this unit covers'
    },
    {
      name: 'order',
      label: 'Unit Order',
      type: 'number',
      placeholder: '1',
      min: 1,
      help: 'The order of this unit within the course (1, 2, 3, etc.)'
    },
    {
      name: 'main_session_url',
      label: 'Main Session URL',
      type: 'url',
      placeholder: 'https://youtube.com/watch?v=...',
      help: 'Optional: Link to the main video or livestream for this unit'
    }
  ];

  // Form actions
  const actions = [
    {
      type: 'submit',
      variant: 'primary',
      label: loading ? 'Creating Unit...' : 'Create Unit',
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
        order: formData.order ? parseInt(formData.order) : undefined,
        main_session_url: formData.main_session_url || ''
      };

      await onUnitCreated(submitData);
      
      // Success - modal will be closed by parent component
    } catch (error) {
      console.error('Unit creation error:', error);
      
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
      title="Create New Unit"
      subtitle="Add a new learning unit to your course"
      fields={fields}
      actions={actions}
      onSubmit={handleSubmit}
      loading={loading}
      errors={errors}
      generalError={generalError}
      showCloseButton={true}
      className="unit-create-modal"
    />
  );
};

export default UnitCreateModal;
