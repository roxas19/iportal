# ContactCard Component

A simple, reusable card component for displaying contact information in the Django React Platform. The ContactCard handles both platform users (users registered on the platform) and manual contacts (contacts added manually by users) with context-based styling.

## Features

- **Dual Contact Type Support**: Visually distinguishes between platform users and manual contacts
- **Context-Based Sizing**: Automatically adapts size based on parent container (like CourseCard)
- **Connection Status**: Shows connection status for platform users (connected, pending, etc.)
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Supports high contrast mode and reduced motion preferences
- **Action Buttons**: Configurable action buttons for platform users (Send Connection, Accept, Message)
- **Directory-Style**: Manual contacts appear as directory entries without action buttons

## Usage

```jsx
import ContactCard from '../../../general/network/ContactCard/ContactCard';

// Platform User Example
const platformContact = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  is_platform_user: true,
  platform_user: {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    profile_photo: '/path/to/photo.jpg'
  },
  connection_status: 'connected'
};

// Manual Contact Example
const manualContact = {
  id: '2',
  name: 'Jane Smith',
  email: 'jane@gmail.com',
  phone_number: '+1234567890',
  is_platform_user: false,
  platform_user: null,
  connection_status: 'not_connected'
};

// Basic Usage - Size determined by parent container
<ContactCard
  contact={platformContact}
  onConnect={(contact) => console.log('Connect:', contact)}
  onMessage={(contact) => console.log('Message:', contact)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `contact` | Object | - | **Required.** Contact data object |
| `onConnect` | Function | - | Callback when connect/send connection button is clicked |
| `onMessage` | Function | - | Callback when message button is clicked |
| `showActions` | Boolean | `true` | Whether to show action buttons |

## Context-Based Sizing

The ContactCard automatically adapts its size based on the parent container:

### Dashboard Panel (Compact)
```jsx
<div className="panel-list">
  <ContactCard contact={contact} onConnect={handleConnect} />
</div>
```
- 32px avatar, smaller fonts, condensed layout
- Used in NetworkPanel (Dashboard right panel)

### Network Page (Full)
```jsx  
<div className="contacts-grid">
  <ContactCard contact={contact} onConnect={handleConnect} />
</div>
```
- 48px avatar, full details, connection status badges
- Used in main Network page

## Contact Object Structure

```javascript
{
  id: String,                    // Contact ID
  name: String,                  // Contact name
  email: String,                 // Contact email
  phone_number: String,          // Contact phone (for manual contacts)
  is_platform_user: Boolean,     // Whether contact is a platform user
  platform_user: {              // Platform user data (if is_platform_user is true)
    id: String,
    name: String,
    email: String,
    profile_photo: String        // URL to profile photo
  },
  connection_status: String      // 'connected', 'pending_sent', 'pending_received', 'not_connected'
}
```

## Visual Differences

### Platform Users
- Blue left border
- Platform indicator badge (P)
- Connection status display
- Profile photo support
- Send Connection/Accept/Message action buttons based on connection status

### Manual Contacts
- Gray left border
- No platform indicator
- No connection status
- No action buttons (directory entries only)
- Phone number display (if available)

## Size Variants

### Compact
- Smaller avatar (32px)
- Condensed layout
- Smaller buttons
- Shows actual contact details (email/phone) instead of contact type indicator
- Ideal for dashboard panels and lists

### Full
- Larger avatar (48px)
- Full contact details
- Regular-sized buttons
- Complete information display including connection status
- Ideal for contact pages and detailed views

## Connection Status

The component displays different connection statuses for platform users:

- **Connected**: Green badge, Message button available
- **Request Sent**: Yellow badge, no action buttons
- **Request Received**: Blue badge, Accept button available
- **Not Connected**: Gray badge, Connect button available

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion preference support
- Proper ARIA labels and titles

## Responsive Behavior

- On mobile devices, action buttons stack vertically for full size cards
- Compact cards maintain horizontal button layout
- Text truncation prevents layout breaking
- Smaller font sizes on mobile for better readability

## Integration Examples

### In Dashboard NetworkPanel
```jsx
// Show 3 recent contacts in compact mode
{contacts.slice(0, 3).map(contact => (
  <ContactCard
    key={contact.id}
    contact={contact}
    size="compact"
    onView={handleViewContact}
    onConnect={handleConnectRequest}
    onMessage={handleMessage}
  />
))}
```

### In Full Network Page
```jsx
// Show all contacts in full mode with filtering
{filteredContacts.map(contact => (
  <ContactCard
    key={contact.id}
    contact={contact}
    size="full"
    onView={handleViewContact}
    onConnect={handleConnectRequest}
    onMessage={handleMessage}
  />
))}
```

### Read-only Display
```jsx
// Show contact without action buttons
<ContactCard
  contact={contact}
  size="full"
  showActions={false}
/>
```
