/**
 * Resource Type Constants
 * 
 * Shared constants for resource types across the application
 * to eliminate duplication and ensure consistency
 */

export const RESOURCE_TYPE_CONFIG = {
  pdf: {
    label: 'PDF Document',
    icon: '📄',
    accept: '.pdf'
  },
  document: {
    label: 'Document',
    icon: '📄',
    accept: '.pdf,.doc,.docx,.txt'
  },
  video_file: {
    label: 'Video File',
    icon: '🎬',
    accept: '.mp4,.avi,.mov,.wmv'
  },
  video_link: {
    label: 'Video Link',
    icon: '🎥',
    accept: null
  },
  audio: {
    label: 'Audio File',
    icon: '🎵',
    accept: '.mp3,.wav,.ogg'
  },
  image: {
    label: 'Image',
    icon: '🖼️',
    accept: '.jpg,.jpeg,.png,.gif,.bmp'
  },
  link: {
    label: 'External Link',
    icon: '🔗',
    accept: null
  },
  code: {
    label: 'Code Sample',
    icon: '💻',
    accept: '.txt,.js,.py,.html,.css,.json'
  },
  slide: {
    label: 'Presentation',
    icon: '📊',
    accept: '.ppt,.pptx,.pdf'
  }
};

/**
 * Get resource type icon
 * @param {string} resourceType 
 * @returns {string} Icon emoji
 */
export const getResourceTypeIcon = (resourceType) => {
  return RESOURCE_TYPE_CONFIG[resourceType]?.icon || '📄';
};

/**
 * Get resource type label
 * @param {string} resourceType 
 * @returns {string} Human-readable label
 */
export const getResourceTypeLabel = (resourceType) => {
  return RESOURCE_TYPE_CONFIG[resourceType]?.label || 'Document';
};

/**
 * Get file accept attribute for input
 * @param {string} resourceType 
 * @returns {string|null} Accept attribute value
 */
export const getFileAccept = (resourceType) => {
  return RESOURCE_TYPE_CONFIG[resourceType]?.accept || '*/*';
};

/**
 * Get all resource type options for select inputs
 * @returns {Array} Array of {value, label, icon} objects
 */
export const getResourceTypeOptions = () => {
  return Object.entries(RESOURCE_TYPE_CONFIG).map(([value, config]) => ({
    value,
    label: `${config.icon} ${config.label}`,
    icon: config.icon
  }));
};

/**
 * Check if resource type requires file upload
 * @param {string} resourceType 
 * @returns {boolean}
 */
export const isFileUpload = (resourceType) => {
  return !['video_link', 'link'].includes(resourceType);
};

/**
 * Check if resource type requires external link
 * @param {string} resourceType 
 * @returns {boolean}
 */
export const isExternalLink = (resourceType) => {
  return ['video_link', 'link'].includes(resourceType);
};
