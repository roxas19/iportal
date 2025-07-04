import React from 'react';
import { PrimaryButton, SecondaryButton } from '../../buttons';
import './ContactCard.css';

/**
 * ContactCard Component
 * 
 * A reusable card component for displaying contact information
 * Supports both platform users and manual contacts with visual distinction
 * 
 * Props:
 * @param {Object} contact - Contact data object
 * @param {string} contact.id - Contact ID
 * @param {string} contact.name - Contact name
 * @param {string} contact.email - Contact email
 * @param {string} contact.phone_number - Contact phone (for manual contacts)
 * @param {boolean} contact.is_platform_user - Whether contact is a platform user
 * @param {Object} contact.platform_user - Platform user data (if is_platform_user is true)
 * @param {string} contact.connection_status - Connection status for platform users
 * @param {string} size - Card size: 'compact' | 'full' (default: 'full')
 * @param {Function} onConnect - Callback when connect/send connection button is clicked (platform users only)
 * @param {Function} onMessage - Callback when message button is clicked (platform users only)
 * @param {boolean} showActions - Whether to show action buttons (default: true)
 */
const ContactCard = ({
  contact,
  size = 'full',
  onConnect,
  onMessage,
  showActions = true
}) => {
  if (!contact) {
    return null;
  }

  const {
    id,
    name,
    email,
    phone_number,
    is_platform_user,
    platform_user,
    connection_status = 'not_connected'
  } = contact;

  // Determine display information
  const displayName = name || email || phone_number || 'Unknown Contact';
  const displayEmail = email;
  const displayPhone = phone_number;
  const isPlatformUser = is_platform_user;
  const platformUserData = platform_user;

  // For platform users, use platform_user data if available
  const finalDisplayName = isPlatformUser && platformUserData?.name 
    ? platformUserData.name 
    : displayName;
  const finalDisplayEmail = isPlatformUser && platformUserData?.email 
    ? platformUserData.email 
    : displayEmail;

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get connection status display
  const getConnectionStatusDisplay = () => {
    if (!isPlatformUser) return null;
    
    switch (connection_status) {
      case 'connected':
        return { text: 'Connected', className: 'status-connected' };
      case 'pending_sent':
        return { text: 'Request Sent', className: 'status-pending-sent' };
      case 'pending_received':
        return { text: 'Request Received', className: 'status-pending-received' };
      case 'not_connected':
        return { text: 'Not Connected', className: 'status-not-connected' };
      default:
        return null;
    }
  };

  const connectionStatus = getConnectionStatusDisplay();

  const handleConnect = () => {
    if (onConnect && isPlatformUser) {
      onConnect(contact);
    }
  };

  const handleMessage = () => {
    if (onMessage && isPlatformUser && connection_status === 'connected') {
      onMessage(contact);
    }
  };

  return (
    <div className={`contact-card ${size} ${isPlatformUser ? 'platform-user' : 'manual-contact'}`}>
      {/* Avatar */}
      <div className="contact-avatar">
        {platformUserData?.profile_photo ? (
          <img 
            src={platformUserData.profile_photo} 
            alt={finalDisplayName}
            className="avatar-image"
          />
        ) : (
          <div className="avatar-placeholder">
            {getInitials(finalDisplayName)}
          </div>
        )}
        {/* Platform user indicator */}
        {isPlatformUser && (
          <div className="platform-indicator" title="Platform User">
            <span className="platform-badge">P</span>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="contact-info">
        <div className="contact-name" title={finalDisplayName}>
          {finalDisplayName}
        </div>
        
        {size === 'full' && (
          <div className="contact-details">
            {finalDisplayEmail && (
              <div className="contact-email" title={finalDisplayEmail}>
                {finalDisplayEmail}
              </div>
            )}
            {!isPlatformUser && displayPhone && (
              <div className="contact-phone" title={displayPhone}>
                {displayPhone}
              </div>
            )}
          </div>
        )}

        {/* Connection Status for Platform Users */}
        {isPlatformUser && connectionStatus && (
          <div className={`connection-status ${connectionStatus.className}`}>
            {connectionStatus.text}
          </div>
        )}

        {/* Contact Type Indicator for compact size */}
        {size === 'compact' && (
          <div className="contact-type">
            {isPlatformUser ? 'Platform User' : 'Manual Contact'}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && isPlatformUser && (
        <div className="contact-actions">
          {/* Send Connection Request */}
          {connection_status === 'not_connected' && (
            <PrimaryButton
              size={size === 'compact' ? 'small' : 'medium'}
              onClick={handleConnect}
              className="connect-btn"
            >
              Send Connection
            </PrimaryButton>
          )}
          
          {/* Accept Connection Request */}
          {connection_status === 'pending_received' && (
            <PrimaryButton
              size={size === 'compact' ? 'small' : 'medium'}
              onClick={handleConnect}
              className="accept-btn"
            >
              Accept
            </PrimaryButton>
          )}

          {/* Message Action (only for connected users) */}
          {connection_status === 'connected' && (
            <SecondaryButton
              size={size === 'compact' ? 'small' : 'medium'}
              onClick={handleMessage}
              className="message-btn"
            >
              Message
            </SecondaryButton>
          )}

          {/* No actions for pending_sent - just show status */}
        </div>
      )}
    </div>
  );
};

export default ContactCard;
