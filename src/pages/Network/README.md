# Network Page

A dedicated page for managing contacts and professional connections in the Django React Platform.

## Overview

The Network page provides a comprehensive interface for viewing, searching, and managing all user contacts. It supports both platform users (registered users) and manual contacts with advanced filtering and search capabilities.

## Features

### 📊 Network Statistics
- **Interactive Stats**: Click stats to filter contact list by type
- **Real-time Updates**: Stats update when contacts are added/removed
- **Connection Tracking**: Shows platform user connection statuses

### 👥 Contact Management
- **Full Contact Display**: Uses ContactCard with `size="full"` for detailed view
- **Contact Types**: Supports both platform users and manual contacts
- **Grid Layout**: Responsive grid for optimal viewing on all devices

### 🔍 Search & Filtering
- **Real-time Search**: Search across names, emails, and phone numbers
- **Type Filtering**: Filter by all contacts, platform users, or manual contacts
- **Future**: Alphabet filtering (A-Z navigation)

### ♾️ Performance
- **Infinite Scroll**: Load more contacts as user scrolls (currently "Load More" button)
- **Pagination**: Efficient backend pagination with 20 contacts per page
- **Optimized Loading**: Smart loading states and error handling

### 🔗 Connection Management
- **Platform Users**: Full connection workflow (Send Request → Accept/Decline → Message)
- **Manual Contacts**: Directory-style display with contact information
- **Status Tracking**: Real-time connection status updates

## Technical Implementation

### Component Architecture
```
Network.js                 # Main page component
├── NetworkStats           # Interactive statistics (size="full")
├── Search Input           # Real-time contact search
├── ContactCard Grid       # Full-size contact cards
└── AddContactModal        # Unified contact creation
```

### State Management
- **Contacts**: Array of contact objects with pagination
- **Stats**: Contact statistics for NetworkStats component
- **Filters**: Search query and type filters
- **Loading States**: Loading, loadingMore for UX

### API Integration
- **GET /api/network/contacts/**: List contacts with alphabetical sorting
- **Search**: Client-side filtering (server-side search planned)
- **Pagination**: Backend pagination with hasNext tracking

## Usage Examples

### Basic Contact Display
```jsx
<ContactCard
  contact={contact}
  size="full"
  onConnect={handleConnectionRequest}
  onMessage={handleMessage}
/>
```

### Interactive Statistics
```jsx
<NetworkStats 
  stats={stats}
  size="full"
  interactive={true}
  activeFilter={filters.type}
  onFilterChange={handleStatsFilter}
/>
```

### Real-time Search
```jsx
<input
  type="text"
  placeholder="Search contacts..."
  value={filters.search}
  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
  className="search-input"
/>
```

## Responsive Design

### Desktop (1200px+)
- Multi-column contact grid
- Full feature set
- Large contact cards

### Tablet (768px - 1200px)
- Responsive grid columns
- Maintained functionality
- Optimized touch targets

### Mobile (< 768px)
- Single column layout
- Stacked header elements
- Mobile-optimized search

## Future Enhancements

### Phase 2 Features
- [ ] Alphabet filter navigation (A-Z)
- [ ] True infinite scroll with Intersection Observer
- [ ] Advanced search with filters dropdown
- [ ] Contact export functionality

### Phase 3 Features
- [ ] Contact groups/categories
- [ ] Bulk contact operations
- [ ] Contact import from CSV
- [ ] Advanced connection analytics

## Integration

### Navigation
- Accessible via "View All Contacts" button in Dashboard NetworkPanel
- Direct URL: `/network`
- Protected route requiring authentication

### Dashboard Integration
The NetworkPanel in the dashboard shows a summary view (12 contacts max) and provides a link to this full Network page for comprehensive contact management.

## Performance Considerations

- **Pagination**: 20 contacts per page for optimal performance
- **Client-side Filtering**: Search and type filters for responsive UX
- **Lazy Loading**: Images and content loaded efficiently
- **Memory Management**: Proper cleanup of event listeners and states
