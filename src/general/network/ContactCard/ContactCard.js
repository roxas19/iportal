import React from 'react';
import { PrimaryButton, SecondaryButton } from '../../buttons';
import './ContactCard.css';

/**
 * ContactCard - Simple, context-styled component
 * 
 * A reusable card component for displaying contact information
 * Supports both platform users and manual contacts with visual distinction
 * 
 * Props:
 * @param {Object} contact - Contact data object
 * @param {Function} onConnect - Callback when connect/send connection button is clicked (platform users only)
 * @param {Function} onMessage - Callback when message button is clicked (platform users only)
 * @param {boolean} showActions - Whether to show action buttons (default: true)
 */
const ContactCard = ({
  contact,
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
    <div className={`contact-card ${isPlatformUser ? 'platform-user' : 'manual-contact'}`}>
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
        
        {/* Contact Details - always shown */}
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

        {/* Connection Status for Platform Users */}
        {isPlatformUser && connectionStatus && (
          <div className={`connection-status ${connectionStatus.className}`}>
            {connectionStatus.text}
          </div>
        )}
      </div>

      {/* Actions - only for platform users */}
      {showActions && isPlatformUser && (
        <div className="contact-actions">
          {/* Send Connection Request */}
          {connection_status === 'not_connected' && (
            <PrimaryButton
              size="small"
              onClick={handleConnect}
              className="connect-btn"
            >
              Send Connection
            </PrimaryButton>
          )}
          
          {/* Accept Connection Request */}
          {connection_status === 'pending_received' && (
            <PrimaryButton
              size="small"
              onClick={handleConnect}
              className="accept-btn"
            >
              Accept
            </PrimaryButton>
          )}

          {/* Message Action (only for connected users) */}
          {connection_status === 'connected' && (
            <SecondaryButton
              size="small"
              onClick={handleMessage}
              className="message-btn"
            >
              Message
            </SecondaryButton>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactCard;
