import React, { useState, useEffect } from 'react';
import FormModal from '../../FormModal/FormModal';
import api from '../../..//services/api';
import './CourseCreateModal.css';

const CourseCreateModal = ({ isOpen, onClose, onCourseCreated }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get('/api/courses/categories/');
        if (response.data.success) {
          setCategories(response.data.data.categories);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        setGeneralError('Failed to load categories. Please try again.');
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  // Get today's date for minimum enrollment deadline
  const today = new Date().toISOString().split('T')[0];

  // Form field configuration
  const fields = [
    {
      name: 'title',
      label: 'Course Title',
      type: 'text',
      placeholder: 'Enter course title',
      required: true,
      validation: {
        required: true,
        maxLength: 200,
        maxLengthMessage: 'Title must be less than 200 characters'
      }
    },
    {
      name: 'description',
      label: 'Course Description',
      type: 'textarea',
      placeholder: 'Describe what students will learn in this course...',
      required: true,
      rows: 4
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'Select a category',
      required: true,
      options: categories.map(cat => ({
        value: cat.name,
        label: cat.name
      })),
      validation: {
        required: true,
        requiredMessage: 'Please select a category'
      }
    },
    {
      name: 'image',
      label: 'Course Image',
      type: 'file',
      accept: 'image/*',
      help: 'Optional: Upload a course thumbnail image (JPG, PNG, GIF)'
    },
    {
      name: 'max_enrollments',
      label: 'Maximum Enrollments',
      type: 'number',
      placeholder: 'e.g., 50',
      min: 1,
      help: 'Optional: Set maximum number of students (leave empty for unlimited)'
    },
    {
      name: 'enrollment_deadline',
      label: 'Enrollment Deadline',
      type: 'date',
      min: today,
      help: 'Optional: Set a deadline for course enrollment'
    }
  ];

  // Form actions
  const actions = [
    {
      type: 'submit',
      variant: 'primary',
      label: loading ? 'Creating Course...' : 'Create Course',
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
      // Prepare form data for API submission
      const submitData = new FormData();
      
      // Add text fields
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      
      // Add optional fields if provided
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      if (formData.max_enrollments && formData.max_enrollments > 0) {
        submitData.append('max_enrollments', formData.max_enrollments);
      }
      if (formData.enrollment_deadline) {
        submitData.append('enrollment_deadline', formData.enrollment_deadline);
      }

      const response = await api.post('/api/courses/instructor/courses/create/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Success! Close modal and notify parent
        onCourseCreated(response.data.data.course);
        onClose();
      } else {
        // Handle API errors
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          setGeneralError(response.data.message || 'Failed to create course');
        }
      }
    } catch (error) {
      console.error('Course creation error:', error);
      
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
      title="Create New Course"
      subtitle="Create a new course for your students"
      fields={fields}
      actions={actions}
      onSubmit={handleSubmit}
      loading={loading}
      errors={errors}
      generalError={generalError}
      showCloseButton={true}
      className="course-create-modal"
    />
  );
};

export default CourseCreateModal;
