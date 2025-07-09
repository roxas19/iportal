import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

/**
 * Instructor Dashboard Hook
 * 
 * Manages state and data for instructor-specific dashboard:
 * - Fetches instructor courses from /api/courses/instructor/courses/
 * - Fetches instructor contacts from /api/network/contacts/
 * - Handles UI state like tabs, filters, and loading states
 * - Provides optimized data transformations and actions
 */
export const useInstructorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state
  const [courses, setCourses] = useState([]);
  const [network, setNetwork] = useState({ contacts: [], pendingInvites: [] });
  const [analytics, setAnalytics] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [quickStats, setQuickStats] = useState({});
  const [recentActions, setRecentActions] = useState([]);
  
  // Network filtering state (centralized)
  const [contactFilter, setContactFilter] = useState('all');

  // Memoized network calculations (avoid re-calculations on every render)
  const networkStats = useMemo(() => ({
    totalContacts: network.contacts.length,
    platformConnections: network.contacts.filter(c => c.is_platform_user).length,
    manualContacts: network.contacts.filter(c => !c.is_platform_user).length,
    pendingInvites: network.pendingInvites.length
  }), [network.contacts, network.pendingInvites]);

  // Centralized filtering logic (moved from NetworkPanel)
  const getFilteredContacts = useCallback((contacts, filter) => {
    // Sort all contacts by created_at (most recent first)
    const sortedContacts = [...contacts].sort((a, b) => 
      new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0)
    );

    switch (filter) {
      case 'platform':
        return sortedContacts.filter(c => c.is_platform_user).slice(0, 3);
      case 'manual':
        return sortedContacts.filter(c => !c.is_platform_user).slice(0, 3);
      case 'all':
      default:
        return sortedContacts.slice(0, 3);
    }
  }, []);

  const filteredContacts = useMemo(() => {
    return getFilteredContacts(network.contacts, contactFilter);
  }, [network.contacts, contactFilter, getFilteredContacts]);

  // Derived data for UI components (cleaned up)
  const networkSummary = useMemo(() => ({
    ...networkStats,
    // Remove redundant recentConnections since we now have filteredContacts
  }), [networkStats]);

  const quickActions = [
    { id: 'new-course', label: 'Create Course', icon: 'plus' },
    { id: 'invite-instructor', label: 'Invite Instructor', icon: 'user-plus' },
    { id: 'view-analytics', label: 'View Analytics', icon: 'chart' }
  ];

  // Load dashboard data (using real backend endpoints)
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the real backend endpoints as specified by backend team
      const [coursesRes, contactsRes] = await Promise.all([
        api.get('/api/courses/instructor/courses/'),  // Backend endpoint for instructor courses
        api.get('/api/network/contacts/')             // Backend endpoint for user contacts
      ]);

      // Set courses data (already sorted by updated_at descending from backend)
      setCourses(coursesRes.data || []);
      
      // Set network data (contacts already filtered by user from backend)
      setNetwork({ 
        contacts: contactsRes.data || [], 
        pendingInvites: [] // No pending invites endpoint for MVP
      });
      
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
  }, []); // No dependencies needed - static logic

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

  return {
    // UI State
    activeTab,
    setActiveTab,
    loading,
    error,
    
    // Data
    courses,
    network,
    analytics,
    notifications,
    activityFeed,
    quickStats,
    recentActions,
    
    // Network-specific data (centralized)
    networkStats,
    networkSummary,
    filteredContacts,
    contactFilter,
    
    // Actions
    quickActions,
    handleQuickAction,
    handleContactFilterChange,
    refreshData,
    loadDashboardData,
    handleCourseCreated
  };
};
