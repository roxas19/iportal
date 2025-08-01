import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

/**
 * Instructor Dashboard Hook - SIMPLIFIED VERSION
 * 
 * Manages state and data for instructor-specific dashboard:
 * - Fetches instructor courses from /api/courses/instructor/courses/
 * - Fetches first 12 contacts from /api/network/contacts/ (dashboard display only)
 * - Handles UI state like tabs, filters, and loading states
 * - Simple, clean implementation focused on dashboard needs
 */
export const useInstructorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);  // Simple contacts array
  const [contactStats, setContactStats] = useState({});  // Stats from backend
  const [courseStats, setCourseStats] = useState({});  // Course stats from backend
  const [analytics, setAnalytics] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [quickStats, setQuickStats] = useState({});
  const [recentActions, setRecentActions] = useState([]);
  
  // Network filtering state (simplified)
  const [contactFilter, setContactFilter] = useState('all');

  // Network stats from backend (no more client-side calculations)
  const networkStats = useMemo(() => ({
    totalContacts: contactStats.total || 0,
    platformConnections: contactStats.platform || 0,
    manualContacts: contactStats.manual || 0,
    pendingInvites: 0  // MVP: No pending invites yet
  }), [contactStats]);

  // Contacts are now filtered on the server-side, so we just use them directly
  const filteredContacts = useMemo(() => {
    return contacts;  // No client-side filtering needed
  }, [contacts]);

  const quickActions = [
    { id: 'new-course', label: 'Create Course', icon: 'plus' },
    { id: 'invite-instructor', label: 'Invite Instructor', icon: 'user-plus' },
    { id: 'view-analytics', label: 'View Analytics', icon: 'chart' }
  ];

  // Load dashboard data (simplified - just 12 contacts for dashboard display)
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build contact API URL with filter_type if needed
      const contactParams = new URLSearchParams({
        sort: 'recent',  // Backend expects 'recent' not 'recency'
        page: '1',
        page_size: '12'
      });
      
      // Add filter_type if not 'all'
      if (contactFilter !== 'all') {
        contactParams.append('filter_type', contactFilter);
      }

      // Load courses and contacts (first 12 only for dashboard)
      const [coursesRes, contactsRes] = await Promise.all([
        api.get('/api/courses/instructor/courses/'),
        api.get(`/api/network/contacts/?${contactParams.toString()}`)
      ]);

      // Set courses data
      setCourses(coursesRes.data?.data?.courses || []);
      
      // Set course stats from backend
      const courseStatsData = coursesRes.data?.data?.stats;
      if (courseStatsData) {
        setCourseStats(courseStatsData);
      } else {
        // Fallback to client calculation if stats not provided
        const allCourses = coursesRes.data?.data?.courses || [];
        setCourseStats({
          total_courses: allCourses.length,
          course_limit: 99,
          remaining_courses: Math.max(0, 99 - allCourses.length)
        });
      }
      
      // Set contact data
      const contactData = contactsRes.data?.data;
      setContacts(contactData?.contacts || []);
      
      // Use stats from backend response (more efficient)
      const backendStats = contactData?.stats;
      if (backendStats) {
        setContactStats(backendStats);
      } else {
        // Fallback to client calculation if stats not provided
        const allContacts = contactData?.contacts || [];
        setContactStats({
          total: contactData?.pagination?.total_contacts || allContacts.length,
          platform: allContacts.filter(c => c.is_platform_user).length,
          manual: allContacts.filter(c => !c.is_platform_user).length
        });
      }
      
      // Placeholder defaults for components not yet integrated
      setAnalytics({});
      setNotifications([]);
      setActivityFeed([]);
      setQuickStats({});
      setRecentActions([]);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [contactFilter]);  // Add contactFilter dependency

  // Load data on mount and when user changes
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  // Centralized action handlers
  const handleQuickAction = useCallback((actionId) => {
    switch (actionId) {
      case 'new-course':
        setActiveTab('courses');
        // TODO: Open create course modal
        break;
      case 'invite-instructor':
        setActiveTab('network');
        // TODO: Open invite modal
        break;
      case 'view-analytics':
        setActiveTab('analytics');
        break;
      default:
        console.warn('Unknown quick action:', actionId);
    }
  }, []);

  const handleContactFilterChange = useCallback((filter) => {
    setContactFilter(filter);
  }, []);

  const refreshData = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Optimistic update: add new course to the top of the list
  const handleCourseCreated = useCallback((newCourse) => {
    setCourses(prev => [newCourse, ...prev]);
  }, []);

  // Optimistic update: add new contact
  const handleContactAdded = useCallback((newContact) => {
    setContacts(prev => [newContact, ...prev]); // Add to beginning (most recent)
    
    // Update stats
    setContactStats(prev => ({
      total: prev.total + 1,
      platform: prev.platform + (newContact.is_platform_user ? 1 : 0),
      manual: prev.manual + (newContact.is_platform_user ? 0 : 1)
    }));
  }, []);

  return {
    // UI State
    activeTab,
    setActiveTab,
    loading,
    error,
    
    // Data
    courses,
    contacts,  // Simple contacts array (12 for dashboard)
    contactStats,  // Stats from backend
    courseStats,  // Course stats from backend
    analytics,
    notifications,
    activityFeed,
    quickStats,
    recentActions,
    
    // Network-specific data (simplified)
    networkStats,
    filteredContacts,
    contactFilter,
    
    // Actions
    quickActions,
    handleQuickAction,
    handleContactFilterChange,
    refreshData,
    loadDashboardData,
    handleCourseCreated,
    handleContactAdded
  };
};
