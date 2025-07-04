import React from 'react';
import './NetworkStats.css';

/**
 * NetworkStats - A reusable component for displaying network statistics
 * 
 * Props:
 * - stats: Object containing network statistics
 * - size: 'compact' | 'standard' | 'full' | 'dashboard' | 'minimal' (default: 'standard')
 * - variant: 'default' | 'featured' (default: 'default')
 * - interactive: boolean - Makes stat cards clickable (default: false)
 * - activeFilter: 'all' | 'platform' | 'manual' - Active filter state
 * - onFilterChange: function - Callback when filter is clicked
 */
const NetworkStats = ({ 
  stats = {},
  size = 'standard',
  variant = 'default',
  interactive = false,
  activeFilter = 'all',
  onFilterChange
}) => {
  const {
    allContacts = 0,
    platformConnections = 0,
    manualContacts = 0
  } = stats;

  const cardClasses = [
    'network-stats',
    `network-stats--${size}`,
    `network-stats--${variant}`,
    interactive ? 'network-stats--interactive' : ''
  ].filter(Boolean).join(' ');

  const handleStatClick = (filterType) => {
    if (interactive && onFilterChange) {
      onFilterChange(filterType);
    }
  };

  const handleKeyDown = (event, filterType) => {
    if (interactive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleStatClick(filterType);
    }
  };

  // Use no padding for minimal size to reduce space
  const containerClasses = [
    'network-stats-container',
    cardClasses,
    size === 'minimal' ? 'network-stats-container--no-padding' : ''
  ].filter(Boolean).join(' ');

  const getStatItemClass = (filterType) => {
    const baseClass = 'stat-item';
    const interactiveClass = interactive ? 'stat-item--interactive' : '';
    const activeClass = interactive && activeFilter === filterType ? 'stat-item--active' : '';
    
    return [baseClass, interactiveClass, activeClass].filter(Boolean).join(' ');
  };

  return (
    <div className={containerClasses}>
      <div className="network-stats__header">
        <h3 className="network-stats__title">Network Overview</h3>
      </div>
      
      <div className="network-stats__grid">
        <div 
          className={getStatItemClass('all')}
          onClick={() => handleStatClick('all')}
          onKeyDown={(e) => handleKeyDown(e, 'all')}
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? 'Filter by all contacts' : undefined}
          aria-pressed={interactive && activeFilter === 'all' ? 'true' : 'false'}
        >
          <span className="stat-number">{allContacts}</span>
          <span className="stat-label">All Contacts</span>
        </div>
        
        <div 
          className={getStatItemClass('platform')}
          onClick={() => handleStatClick('platform')}
          onKeyDown={(e) => handleKeyDown(e, 'platform')}
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? 'Filter by platform connections' : undefined}
          aria-pressed={interactive && activeFilter === 'platform' ? 'true' : 'false'}
        >
          <span className="stat-number">{platformConnections}</span>
          <span className="stat-label">Platform Connections</span>
        </div>
        
        <div 
          className={getStatItemClass('manual')}
          onClick={() => handleStatClick('manual')}
          onKeyDown={(e) => handleKeyDown(e, 'manual')}
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? 'Filter by manual contacts' : undefined}
          aria-pressed={interactive && activeFilter === 'manual' ? 'true' : 'false'}
        >
          <span className="stat-number">{manualContacts}</span>
          <span className="stat-label">Manual Contacts</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkStats;
