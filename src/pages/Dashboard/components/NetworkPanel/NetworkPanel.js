import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, PrimaryButton, SecondaryButton } from '../../../../general/buttons';
import NetworkStats from '../../../../general/network/NetworkStats/NetworkStats';
import ContactCard from '../../../../general/network/ContactCard/ContactCard';
import AddContactModal from '../../../../general/network/AddContactModal/AddContactModal';
import '../../styles/shared-panel.css';
import './NetworkPanel.css';

/**
 * Network Panel Component (Right Panel) - SIMPLIFIED VERSION
 * 
 * Features:
 * - Network statistics with interactive filtering (NetworkStats component)
 * - Displays up to 12 filtered contacts based on selected filter
 * - Simple "Show More" button that will navigate to full contacts page (future)
 * - Connection actions (Send Connection, Accept, Message)
 * 
 * Uses shared panel styles for consistency with CoursesPanel.
 */
const NetworkPanel = ({ 
  networkStats = {}, 
  filteredContacts = [], 
  contactFilter = 'all',
  onFilterChange,
  onContactAdded,
  loading = false 
}) => {
  const navigate = useNavigate();
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const handleAddContact = () => {
    setShowAddContactModal(true);
  };

  const handleContactAdded = (newContact) => {
    // Close modal and notify parent
    setShowAddContactModal(false);
    if (onContactAdded) {
      onContactAdded(newContact);
    }
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

  const handleViewAllContacts = () => {
    navigate('/network');
  };

  const getSectionTitle = () => {
    switch (contactFilter) {
      case 'platform': return 'Recent Platform Contacts';
      case 'manual': return 'Recent Manual Contacts';
      default: return 'Recent Contacts';
    }
  };

  const getEmptyStateMessage = () => {
    switch (contactFilter) {
      case 'platform': return 'No platform contacts yet';
      case 'manual': return 'No manual contacts yet';
      default: return 'No contacts yet';
    }
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
          onClick={handleAddContact}
          className="panel-header-action"
        >
          + Add Contact
        </IconButton>
      </div>
      
      <div className="panel-content">
        {/* Network Statistics - Minimal Size for Dashboard */}
        <NetworkStats 
          stats={networkStats}  // Pass stats directly - now uses standardized interface
          size="minimal"
          interactive={true}
          activeFilter={contactFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Contacts List */}
        <div className="network-panel__section">
          <h3>{getSectionTitle()}</h3>
          {filteredContacts.length === 0 ? (
            <div className="panel-empty-state">
              <p>{getEmptyStateMessage()}</p>
              <PrimaryButton onClick={handleAddContact}>
                Add Your First Contact
              </PrimaryButton>
            </div>
          ) : (
            <>
              <div className={`panel-list network-panel__contacts ${loading ? 'panel-list--loading' : ''}`}>
                {filteredContacts.map(contact => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onConnect={handleConnectRequest}
                    onMessage={handleMessage}
                  />
                ))}
              </div>
              
              {/* Show More Information */}
              {filteredContacts.length >= 12 && (
                <div className="network-panel__show-more">
                  <p className="show-more-hint">
                    Showing first 12 contacts. 
                  </p>
                </div>
              )}
            </>
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

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
        onContactAdded={handleContactAdded}
      />
    </div>
  );
};

export default NetworkPanel;
