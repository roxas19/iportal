# Input Component

## Overview
Reusable input component with label, validation, and error handling following Apple-inspired design system.

## File Structure
```
Input/
├── Input.js        # Main component implementation
├── Input.css       # Component-specific styles
└── README.md       # This documentation
```

## Usage

```javascript
import Input from '../../../components/ui/Input/Input.js';

// Basic input with label
<Input
  label="Email"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleInputChange}
  placeholder="Enter your email"
/>

// Input with validation error
<Input
  label="Password"
  name="password"
  type="password"
  value={formData.password}
  onChange={handleInputChange}
  error={errors.password}
  required
/>

// Disabled input
<Input
  label="Username"
  name="username"
  value={username}
  disabled
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label text |
| `id` | `string` | `name` | HTML id attribute (defaults to name) |
| `name` | `string` | - | HTML name attribute |
| `type` | `string` | `'text'` | HTML input type |
| `value` | `string` | - | Controlled input value |
| `onChange` | `function` | - | Change handler |
| `placeholder` | `string` | - | Placeholder text |
| `error` | `string` | - | Error message to display |
| `disabled` | `boolean` | `false` | Whether input is disabled |
| `required` | `boolean` | `false` | Whether input is required (shows *) |
| `className` | `string` | `''` | Additional CSS classes |

## Design System

- **Spacing**: Uses 8px grid system (--space-1, --space-2, --space-3)
- **Colors**: Uses CSS variables for consistent theming
- **Border**: Subtle gray border with blue focus state
- **Typography**: 14px label, 16px input text
- **Error State**: Red border and error message with warning icon

## States

### Normal
- Gray border (#E5E5E7)
- White background
- Dark text (#1A1A1A)

### Focus
- Blue border (--accent)
- Blue shadow ring for accessibility
- Enhanced visual feedback

### Error
- Red border (#FF3B30)
- Red error message below input
- Warning icon in error message

### Disabled
- Gray background (#F2F2F7)
- Muted text color
- Non-interactive cursor

## Accessibility

- Proper label association with `htmlFor`
- Error messages use `role="alert"`
- Focus management with visible focus ring
- Required field indicator (*)
- Supports keyboard navigation
- Screen reader friendly error announcements

## Browser Support

- Removes autofill styling for consistent appearance
- Handles number input spinner arrows
- Responsive design for mobile devices
- Prevents iOS zoom on input focus

## Examples

### Login Form Input
```javascript
<Input
  label="Username or Email"
  name="username_or_email"
  value={formData.username_or_email}
  onChange={handleInputChange}
  error={errors.username_or_email}
  placeholder="Enter your username or email"
/>
```

### Password Input with Validation
```javascript
<Input
  label="Password"
  name="password"
  type="password"
  value={formData.password}
  onChange={handleInputChange}
  error={errors.password}
  placeholder="Choose a secure password (min 8 characters)"
  required
/>
```
