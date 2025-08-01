import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

/**
 * useCourses Hook - Courses Page State Management
 * 
 * Handles:
 * - Loading instructor courses
 * - Real-time search filtering
 * - Course creation integration
 * - Loading states and error handling
 * - Smooth search experience with debouncing
 * 
 * Following the same pattern as useInstructorDashboard
 */
export const useCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Debounce search to avoid excessive API calls
  const searchTimeoutRef = useRef(null);
  
  // Load courses from API (no search parameter - pure client-side filtering)
  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use existing API endpoint without search parameter
      const response = await api.get('/api/courses/instructor/courses/');
      
      if (response.data.success) {
        setCourses(response.data.data.courses || []);
      } else {
        setError('Failed to load courses');
      }
      
    } catch (err) {
      console.error('Error loading courses:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initial load on mount
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);
  
  // Handle search input change
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);
  
  // Handle course creation
  const handleCreateCourse = useCallback(() => {
    setShowCreateModal(true);
  }, []);
  
  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);
  
  const handleCourseCreated = useCallback((newCourse) => {
    // Add new course to the beginning of the list
    setCourses(prev => [newCourse, ...prev]);
    setShowCreateModal(false);
    
    // Show success message (optional)
    console.log('Course created successfully:', newCourse.title);
  }, []);
  
  // Handle course actions
  const handleViewCourse = useCallback((courseId) => {
    navigate(`/course/${courseId}`);
  }, [navigate]);
  
  const handleEditCourse = useCallback((courseId) => {
    // TODO: Navigate to course edit page or open edit modal
    console.log('Navigate to course edit:', courseId);
  }, []);
  
  // Filter courses based on search (client-side filtering with prefix matching)
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().startsWith(searchQuery.toLowerCase())
  );
  
  return {
    // Data
    courses: filteredCourses,
    loading,
    searchLoading,
    error,
    searchQuery,
    showCreateModal,
    
    // Actions
    handleSearchChange,
    handleCreateCourse,
    handleCloseCreateModal,
    handleCourseCreated,
    handleViewCourse,
    handleEditCourse,
    
    // Utility
    refetch: () => loadCourses(),
    hasResults: filteredCourses.length > 0,
    isSearching: searchQuery.trim().length > 0
  };
};
