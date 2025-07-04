import React from 'react';
import './CreatorToolsPanel.css';

/**
 * Creator Tools Panel Component (Bottom Panel)
 * 
 * Features:
 * - Quick action tools for course creation
 * - Content management shortcuts
 * - Analytics and performance tools
 * - Publishing and marketing tools
 * - Recent actions/activity
 * 
 * This is specific to the Dashboard page.
 */
const CreatorToolsPanel = ({ 
  quickActions = [], 
  onQuickAction, 
  recentActions = [] 
}) => {
  
  // Creator-specific tools
  const creatorTools = [
    {
      id: 'create-course',
      title: 'Create Course',
      description: 'Start a new course from scratch',
      icon: '📚',
      color: 'blue'
    },
    {
      id: 'content-library',
      title: 'Content Library',
      description: 'Manage your course materials',
      icon: '📁',
      color: 'green'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View performance metrics',
      icon: '📊',
      color: 'purple'
    },
    {
      id: 'marketing-tools',
      title: 'Marketing',
      description: 'Promote your courses',
      icon: '📢',
      color: 'orange'
    },
    {
      id: 'student-management',
      title: 'Students',
      description: 'Manage enrolled students',
      icon: '👥',
      color: 'indigo'
    },
    {
      id: 'revenue-tracker',
      title: 'Revenue',
      description: 'Track your earnings',
      icon: '💰',
      color: 'emerald'
    }
  ];

  const handleToolClick = (toolId) => {
    if (onQuickAction) {
      onQuickAction(toolId);
    } else {
      console.log('Creator tool clicked:', toolId);
    }
  };

  const getToolColorClass = (color) => {
    return `tool-${color}`;
  };

  return (
    <div className="creator-tools-panel">
      <div className="panel-header">
        <h2>Creator Tools</h2>
        <span className="panel-subtitle">Quick access to your content creation tools</span>
      </div>
      
      <div className="panel-content">
        {/* Creator Tools Grid */}
        <div className="creator-tools-grid">
          {creatorTools.map(tool => (
            <div 
              key={tool.id} 
              className={`creator-tool-card ${getToolColorClass(tool.color)}`}
              onClick={() => handleToolClick(tool.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToolClick(tool.id);
                }
              }}
            >
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-info">
                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-description">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Actions */}
        {recentActions.length > 0 && (
          <div className="recent-actions">
            <h3>Recent Actions</h3>
            <div className="actions-list">
              {recentActions.slice(0, 4).map(action => (
                <div key={action.id} className="action-item">
                  <span className="action-text">
                    {action.action}: <strong>{action.target}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorToolsPanel;
