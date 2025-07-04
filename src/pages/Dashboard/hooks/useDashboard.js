import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

/**
 * Custom hook for Dashboard state management
 * 
 * Manages all dashboard-related data in a centralized, lean way:
 * - Courses data (first 3 for sidebar, all for main panel)
 * - Network/contacts summary
 * - Activity feed and analytics
 * - UI state (active tab, modals, etc.)
 * 
 * This follows our lean context approach - no heavy context providers,
 * just a simple hook that components can use.
 */
export const useDashboard = () => {
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

  // Load dashboard data (memoized to prevent infinite re-renders)
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API calls when backend endpoints are ready
      const [coursesRes, networkRes, analyticsRes, notificationsRes] = await Promise.all([
        // api.get('/courses/'),
        // api.get('/network/contacts/'),
        // api.get('/analytics/dashboard/'),
        // api.get('/notifications/')
        
        // Mock data for now
        Promise.resolve({ data: mockCourses }),
        Promise.resolve({ data: mockNetwork }),
        Promise.resolve({ data: mockAnalytics }),
        Promise.resolve({ data: mockNotifications })
      ]);

      setCourses(coursesRes.data);
      setNetwork(networkRes.data);
      setAnalytics(analyticsRes.data);
      setNotifications(notificationsRes.data);
      
      // Mock activity feed and stats
      setActivityFeed(mockActivityFeed);
      setQuickStats(mockQuickStats);
      setRecentActions(mockRecentActions);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since this doesn't depend on any props/state

  // Load data on mount and when user changes
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

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
    loadDashboardData
  };
};

// Mock data - TODO: Remove when backend APIs are implemented
const mockCourses = [
  {
    id: 1,
    title: 'React Advanced Patterns',
    status: 'live',
    students: 245,
    lastUpdated: '2024-01-15T10:30:00Z',
    thumbnail: null
  },
  {
    id: 2,
    title: 'Django REST Framework',
    status: 'draft',
    students: 0,
    lastUpdated: '2024-01-10T14:20:00Z',
    thumbnail: null
  },
  {
    id: 3,
    title: 'Full Stack Development',
    status: 'live',
    students: 189,
    lastUpdated: '2024-01-08T09:15:00Z',
    thumbnail: null
  }
];

const mockNetwork = {
  contacts: [
    // Platform Users
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com',
      is_platform_user: true,
      platform_user: {
        id: 123,
        name: 'John Doe',
        email: 'john@example.com',
        profile_photo: null
      },
      connection_status: 'connected',
      created_at: '2024-01-15T10:30:00Z'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@company.com',
      is_platform_user: true,
      platform_user: {
        id: 456,
        name: 'Jane Smith',
        email: 'jane@company.com',
        profile_photo: null
      },
      connection_status: 'pending_sent',
      created_at: '2024-01-14T09:15:00Z'
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      email: 'sarah@tech.com',
      is_platform_user: true,
      platform_user: {
        id: 789,
        name: 'Sarah Wilson',
        email: 'sarah@tech.com',
        profile_photo: null
      },
      connection_status: 'pending_received',
      created_at: '2024-01-13T16:45:00Z'
    },
    { 
      id: 5, 
      name: 'David Chen', 
      email: 'david@startup.io',
      is_platform_user: true,
      platform_user: {
        id: 321,
        name: 'David Chen',
        email: 'david@startup.io',
        profile_photo: null
      },
      connection_status: 'connected',
      created_at: '2024-01-12T11:20:00Z'
    },
    // Manual Contacts
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike@personal.gmail.com',
      phone_number: '+1234567890',
      is_platform_user: false,
      platform_user: null,
      connection_status: 'not_connected',
      created_at: '2024-01-16T14:30:00Z'
    },
    { 
      id: 6, 
      name: 'Lisa Anderson', 
      email: 'lisa.anderson@corporate.com',
      phone_number: '+1555123456',
      is_platform_user: false,
      platform_user: null,
      connection_status: 'not_connected',
      created_at: '2024-01-11T08:00:00Z'
    },
    { 
      id: 7, 
      name: 'Robert Martinez', 
      email: 'robert.m@freelance.net',
      phone_number: '+1777888999',
      is_platform_user: false,
      platform_user: null,
      connection_status: 'not_connected',
      created_at: '2024-01-10T13:15:00Z'
    }
  ],
  pendingInvites: [
    { id: 1, email: 'alice@example.com', sentAt: '2024-01-14T12:00:00Z' }
  ]
};

const mockAnalytics = {
  totalStudents: 434,
  totalRevenue: 8920,
  coursesCompleted: 156,
  avgRating: 4.7
};

const mockNotifications = [
  { id: 1, type: 'info', message: 'New student enrolled in React course', time: '5 min ago' },
  { id: 2, type: 'success', message: 'Course "Django REST" was published', time: '1 hour ago' }
];

const mockActivityFeed = [
  { id: 1, action: 'Course updated', details: 'React Advanced Patterns', time: '2 hours ago' },
  { id: 2, action: 'New enrollment', details: 'Full Stack Development', time: '3 hours ago' }
];

const mockQuickStats = {
  todayRevenue: 245,
  weeklyGrowth: 12.5,
  activeStudents: 89
};

const mockRecentActions = [
  { id: 1, action: 'Edit Course', target: 'React Advanced Patterns' },
  { id: 2, action: 'View Analytics', target: 'All Courses' }
];
