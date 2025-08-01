import React from 'react';
import './NetworkStats.css';

/**
 * NetworkStats - A reusable component for displaying network statistics
 * 
 * Props:
 * - stats: Object containing network statistics with STANDARDIZED keys:
 *   - total: Total contacts count
 *   - platform: Platform connections count  
 *   - manual: Manual contacts count
 * - size: 'compact' | 'standard' | 'full' | 'dashboard' | 'minimal' (default: 'standard')
 * - variant: 'default' | 'featured' (default: 'default')
 * - interactive: boolean - Makes stat cards clickable (default: false)
 * - activeFilter: 'all' | 'platform' | 'manual' - Active filter state
 * - onFilterChange: function - Callback when filter is clicked
 */
const NetworkStats = React.memo(({ 
  stats = {},
  size = 'standard',
  variant = 'default',
  interactive = false,
  activeFilter = 'all',
  onFilterChange
}) => {
  // STANDARDIZED prop interface - always expect these keys
  const {
    total = 0,
    platform = 0,
    manual = 0,
    // Legacy support for different prop names (to be phased out)
    allContacts = total,
    platformConnections = platform,
    manualContacts = manual,
    totalContacts = total
  } = stats;

  // Use standardized values, falling back to legacy names
  const finalCounts = {
    all: total || allContacts || totalContacts || 0,
    platform: platform || platformConnections || 0,
    manual: manual || manualContacts || 0
  };

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
          <span className="stat-number">{finalCounts.all}</span>
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
          <span className="stat-number">{finalCounts.platform}</span>
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
          <span className="stat-number">{finalCounts.manual}</span>
          <span className="stat-label">Manual Contacts</span>
        </div>
      </div>
    </div>
  );
});

// Add display name for debugging
NetworkStats.displayName = 'NetworkStats';

export default NetworkStats;
