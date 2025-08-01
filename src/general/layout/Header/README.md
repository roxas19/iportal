# Header Component

## Overview
Global navigation header with Apple-inspired design and simple responsive behavior.

## Features
- **Apple-inspired design** - Clean, premium, minimal aesthetic
- **Simple responsive design** - Naturally adapts to mobile like our other pages
- **Active page highlighting** - Clear visual feedback
- **User profile dropdown** - Account settings and logout
- **Smooth animations** - 60fps transitions and micro-interactions
- **Accessibility** - Keyboard navigation and screen reader support

## Usage
```javascript
import Header from './general/layout/Header';

// Header automatically handles:
// - Current page detection
// - User authentication state
// - Simple responsive behavior
// - Route navigation
```

## Design Philosophy
Following our vision-first approach:
- **Gorgeous UI** - Premium feel that hooks users
- **Performance-focused** - Smooth, fast interactions
- **Simple responsive** - No complex mobile logic, just clean CSS
- **Minimal MVP** - Essential features only
- **Consistent** - Same responsive patterns as rest of our pages

## Components
- **Header.js** - Main header component (simplified)
- **Navigation.js** - Desktop navigation links
- **UserProfile.js** - User profile section with dropdown

## Styling
- **Header.css** - Apple-inspired styling with simple responsive design
- **Design system** - Uses existing CSS variables
- **Responsive** - Simple media queries, no mobile-specific components
- **Animations** - Smooth transitions and micro-interactions

## Integration
- **AuthContext** - User authentication state
- **React Router** - Navigation and active page detection
- **Simple responsive** - Clean CSS adaptation for all devices

## Performance
- **Minimal components** - No complex mobile logic
- **Smooth animations** - 60fps transitions
- **Fast loading** - Minimal CSS and optimized design
- **Backdrop blur** - Modern glass effect (iOS Safari style)
