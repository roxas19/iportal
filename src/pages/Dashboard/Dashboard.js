import React from 'react';
import { useInstructorDashboard } from './hooks/useInstructorDashboard';
import CoursesPanel from './components/CoursesPanel/CoursesPanel';
import NetworkPanel from './components/NetworkPanel/NetworkPanel';
import CreatorToolsPanel from './components/CreatorToolsPanel/CreatorToolsPanel';
import './Dashboard.css';

/**
 * Dashboard Page with 3-Zone Layout
 * 
 * Zones:
 * 1. Left Panel - Courses section
 * 2. Right Panel - Network section  
 * 3. Bottom Panel - Creator tools
 * 
 * Header is handled by general layout components in /src/general/
 * 
 * This follows our page-centric architecture where:
 * - Page-specific components are in ./components/
 * - Shared/reusable components are in /src/general/
 * - State management is handled through useInstructorDashboard hook
 */
const Dashboard = () => {
  const dashboardData = useInstructorDashboard();

  return (
    <div className="dashboard">
      <div className="dashboard-main">
        {/* Left Panel - Courses */}
        <CoursesPanel 
          courses={dashboardData.courses}
          loading={dashboardData.loading}
          onCourseCreated={dashboardData.handleCourseCreated}
        />
        
        {/* Right Panel - Network */}
        <NetworkPanel 
          networkStats={dashboardData.networkStats}
          filteredContacts={dashboardData.filteredContacts}
          contactFilter={dashboardData.contactFilter}
          onFilterChange={dashboardData.handleContactFilterChange}
          loading={dashboardData.loading}
        />
      </div>
      
      {/* Bottom Panel - Creator Tools */}
      <CreatorToolsPanel 
        quickActions={dashboardData.quickActions}
        onQuickAction={dashboardData.handleQuickAction}
        recentActions={dashboardData.recentActions}
        onCourseCreated={dashboardData.handleCourseCreated}
      />
    </div>
  );
};

export default Dashboard;
