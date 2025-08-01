import React, { useState } from 'react';
import FormModal from '../../../../general/FormModal/FormModal';
import { getResourceTypeOptions, getFileAccept, isFileUpload, isExternalLink } from '../../../../general/constants';

/**
 * MaterialCreateModal Component - Create new course material
 * 
 * Features:
 * - Material title input
 * - Resource type selection (PDF, video, link, etc.)
 * - File upload or external link
 * - Form validation and error handling
 * - Simplified fields aligned with backend model
 * 
 * Following our FormModal pattern and design system
 */
const MaterialCreateModal = ({ 
  isOpen, 
  onClose, 
  onMaterialCreated, 
  courseId, 
  initialData = null, 
  isEditing = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [resourceType, setResourceType] = useState(initialData?.resource_type || 'document');

  // Resource type options from shared constants
  const resourceTypeOptions = getResourceTypeOptions();

  // Determine if we need file upload or link input using shared utilities
  const needsFileUpload = isFileUpload(resourceType);
  const needsLink = isExternalLink(resourceType);

  // Form field configuration
  const fields = [
    {
      name: 'title',
      label: 'Material Title',
      type: 'text',
      placeholder: 'e.g., Course Syllabus PDF',
      required: true,
      validation: {
        required: true,
        maxLength: 200,
        maxLengthMessage: 'Title must be less than 200 characters'
      }
    },
    {
      name: 'resource_type',
      label: 'Material Type',
      type: 'select',
      placeholder: 'Select material type',
      required: true,
      options: resourceTypeOptions,
      value: resourceType,
      onChange: (value) => setResourceType(value),
      validation: {
        required: true,
        requiredMessage: 'Please select a material type'
      }
    },
    // Conditional field for file upload
    ...(needsFileUpload ? [{
      name: 'file',
      label: 'Upload File',
      type: 'file',
      accept: getFileAccept(resourceType),
      required: true,
      help: `Upload your ${resourceType} file`
    }] : []),
    // Conditional field for external link
    ...(needsLink ? [{
      name: 'link',
      label: 'External Link',
      type: 'url',
      placeholder: 'https://example.com/resource',
      required: true,
      help: 'Provide the full URL to the external resource'
    }] : [])
  ];

  // Remove the getFileAccept function as it's now imported from constants

  // Form actions
  const actions = [
    {
      type: 'submit',
      variant: 'primary',
      label: loading ? 'Creating Material...' : 'Create Material',
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
      // Prepare form data for submission
      const submitData = new FormData();
      
      submitData.append('title', formData.title);
      submitData.append('resource_type', formData.resource_type);
      
      if (formData.file && needsFileUpload) {
        submitData.append('file', formData.file);
      }
      
      if (formData.link && needsLink) {
        submitData.append('link', formData.link);
      }

      await onMaterialCreated(submitData);
      
      // Success - modal will be closed by parent component
    } catch (error) {
      console.error('Material creation error:', error);
      
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
      title={isEditing ? "Edit Course Material" : "Add Course Material"}
      subtitle={isEditing ? "Update course resource information" : "Upload files or add links to course resources"}
      fields={fields}
      actions={actions}
      onSubmit={handleSubmit}
      loading={loading}
      errors={errors}
      generalError={generalError}
      showCloseButton={true}
      className="material-create-modal"
      initialValues={initialData ? {
        title: initialData.title,
        resource_type: initialData.resource_type,
        description: initialData.description || '',
        link: initialData.link || ''
      } : {}}
    />
  );
};

export default MaterialCreateModal;
