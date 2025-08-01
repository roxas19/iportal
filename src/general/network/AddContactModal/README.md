# AddContactModal Component

A comprehensive modal component for adding contacts to the Django React Platform. Supports both platform user search and manual contact entry with privacy controls.

## Features

- **Dual Contact Types**: Add platform users or manual contacts
- **Live Search**: Search platform users with debounced input
- **Privacy First**: Click-to-add prevents random additions
- **Form Validation**: Comprehensive validation for manual contacts
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support

## Usage

```jsx
import AddContactModal from '../../../general/network/AddContactModal/AddContactModal';

const [showAddModal, setShowAddModal] = useState(false);

const handleContactAdded = (newContact) => {
  // Refresh contacts list
  console.log('Contact added:', newContact);
  // Update your contacts state here
};

<AddContactModal
  isOpen={showAddModal}
  onClose={() => setShowAddModal(false)}
  onContactAdded={handleContactAdded}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | Boolean | `false` | Whether the modal is open |
| `onClose` | Function | - | **Required.** Callback when modal should close |
| `onContactAdded` | Function | - | Callback when a contact is successfully added |

## Tab Structure

### Platform User Tab
- **Search Field**: Live search with 300ms debounce
- **Results List**: Clickable user cards with avatar, name, email
- **Privacy Control**: Users must click to add, prevents random additions
- **Loading States**: Shows search progress and add progress

### Manual Contact Tab  
- **Name Field**: Required text input
- **Email Field**: Optional email input with validation
- **Phone Field**: Optional phone input with formatting help
- **Validation**: Either email or phone is required

## API Integration

### Platform User Search
- **Endpoint**: `/api/network/instructor/users/search/`
- **Method**: GET with query parameter
- **Response**: Array of user objects with id, name, email, profile_photo

### Contact Creation
- **Endpoint**: `/api/network/contacts/`
- **Method**: POST
- **Payload**: 
  ```javascript
  // Platform User
  {
    name: "John Doe",
    email: "john@example.com", 
    platform_user_id: 123
  }
  
  // Manual Contact
  {
    name: "Jane Smith",
    email: "jane@gmail.com",
    phone_number: "+1234567890"
  }
  ```

## Styling

The component uses the existing design system:
- **Colors**: CSS variables for primary colors and theming
- **Typography**: Consistent with platform font hierarchy
- **Spacing**: 8px grid system
- **Borders**: 8px border radius for modern look
- **Focus States**: Clear focus indicators for accessibility

## Error Handling

- **Search Errors**: Network issues, empty results, invalid queries
- **Validation Errors**: Field-level validation with clear messages
- **API Errors**: Server responses with user-friendly messages
- **Network Errors**: Graceful handling of connection issues

## Accessibility Features

- **Keyboard Navigation**: Full tab and enter key support
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Logical focus flow through interface
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences

## Responsive Behavior

- **Desktop**: Side-by-side layout with ample spacing
- **Tablet**: Stacked layout with adjusted proportions
- **Mobile**: Full-width with touch-friendly targets
- **Search Results**: Scrollable list with touch-friendly items

## Integration with Dashboard

The modal integrates seamlessly with:
- **NetworkPanel**: Triggered by "+ Add Contact" button
- **Dashboard Hook**: Refreshes contact list after addition
- **Contact System**: Uses existing contact models and API

## Privacy & Security

- **Search Privacy**: Only returns users who allow being found
- **Click to Add**: Prevents accidental or malicious contact additions
- **Data Validation**: Server-side validation for all inputs
- **Permission Checks**: Authenticated users only

## Future Enhancements

- **Bulk Import**: CSV/Excel file import for multiple contacts
- **Contact Groups**: Organize contacts into custom groups  
- **Contact Sync**: Sync with external contact systems
- **Advanced Search**: Filter by role, location, etc.

## Related Components

- **FormModal**: Base modal component used for structure
- **ContactCard**: Displays individual contacts
- **NetworkPanel**: Dashboard panel that triggers this modal
- **NetworkStats**: Shows contact counts and filtering
