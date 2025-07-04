import React from 'react';
import { IconButton, PrimaryButton, SecondaryButton } from '../../../../general/buttons';
import NetworkStats from '../../../../general/network/NetworkStats/NetworkStats';
import ContactCard from '../../../../general/network/ContactCard/ContactCard';
import '../../styles/shared-panel.css';
import './NetworkPanel.css';

/**
 * Network Panel Component (Right Panel)
 * 
 * Features:
 * - Network statistics with interactive filtering (NetworkStats component)
 * - Filtered contact list based on selected filter
 * - Connection actions (Send Connection, Accept, Message)
 * 
 * Uses shared panel styles for consistency with CoursesPanel.
 */
const NetworkPanel = ({ 
  networkStats = {}, 
  filteredContacts = [], 
  contactFilter = 'all',
  onFilterChange,
  loading = false 
}) => {

  const handleInviteContact = () => {
    // TODO: Open invite modal
    console.log('Invite contact');
  };

  const handleConnectRequest = (contact) => {
    // TODO: Send connection request
    console.log('Send connection request to:', contact);
  };

  const handleMessage = (contact) => {
    // TODO: Open message dialog
    console.log('Message contact:', contact);
  };

  const handleFilterChange = (filter) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  const getSectionTitle = () => {
    switch (contactFilter) {
      case 'platform': return 'Recent Platform Contacts';
      case 'manual': return 'Recent Manual Contacts';
      default: return 'Recent Contacts';
    }
  };

  const handleViewAllContacts = () => {
    // TODO: Navigate to full network page
    console.log('View all contacts');
  };

  if (loading) {
    return (
      <div className="panel-base network-panel">
        <div className="panel-header">
          <h2>Network</h2>
        </div>
        <div className="panel-content">
          <div className="panel-loading">Loading network...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-base network-panel">
      <div className="panel-header">
        <h2>My Network</h2>
        <IconButton 
          variant="primary" 
          size="small"
          onClick={handleInviteContact}
          className="panel-header-action"
        >
          + Invite
        </IconButton>
      </div>
      
      <div className="panel-content">
        {/* Network Statistics - Minimal Size for Dashboard */}
        <NetworkStats 
          stats={{
            allContacts: networkStats.totalContacts || 0,
            platformConnections: networkStats.platformConnections || 0,
            manualContacts: networkStats.manualContacts || 0
          }}
          size="minimal"
          interactive={true}
          activeFilter={contactFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Recent Contacts */}
        <div className="network-panel__section">
          <h3>{getSectionTitle()}</h3>
          {filteredContacts.length === 0 ? (
            <div className="panel-empty-state">
              <p>No {contactFilter === 'all' ? 'contacts' : contactFilter + ' contacts'} yet</p>
              <PrimaryButton onClick={handleInviteContact}>
                Invite Your First Contact
              </PrimaryButton>
            </div>
          ) : (
            <div className={`panel-list network-panel__contacts ${loading ? 'panel-list--loading' : ''}`}>
              {filteredContacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  size="compact"
                  onConnect={handleConnectRequest}
                  onMessage={handleMessage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="panel-footer">
        <SecondaryButton 
          size="small" 
          onClick={handleViewAllContacts}
        >
          View All Contacts
        </SecondaryButton>
      </div>
    </div>
  );
};

export default NetworkPanel;
