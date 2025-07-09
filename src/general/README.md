# Components Directory

## Overview
Shared React components organized by type and purpose, following a page-centric architecture with extracted UI components.

## 🎯 Philosophy

**Component reusability** means:
- Build once, use everywhere
- Consistent UI patterns across the app
- Easy maintenance and updates
- Clear separation between page-specific and shared components

## 📁 Structure

```
components/
├── ui/              # ✅ Basic building blocks
│   ├── Button/      # ✅ Button component with variants  
│   ├── Input/       # ✅ Input component with validation
│   └── Card/        # ✅ Card container component
├── layout/          # 📋 Layout and navigation components
└── common/          # 📋 Utility components (Loading, Error, etc.)
```

## Component Organization

### **ui/** - Basic Building Blocks
**Purpose**: Fundamental UI components like Button, Input, Card, Modal
**When to use**: When you need basic interactive elements
**Current components**:
- **Button**: Primary, secondary, and link variants with loading states
- **Input**: Form inputs with labels, validation, and error handling  
- **Card**: Flexible containers with consistent styling and spacing

### **layout/** - Page Structure Components  
**Purpose**: Components that define page layout and structure
**When to use**: For headers, sidebars, page containers
**Examples**: `Header/`, `Sidebar/`, `PageContainer/`

### **common/** - Utility Components
**Purpose**: Components for common app functionality
**When to use**: Error handling, loading states, utilities
**Examples**: `Loading/`, `ErrorBoundary/`, `ProtectedRoute/`

## Usage Guidelines

### Import Pattern
```javascript
// Always use explicit file paths
import { PrimaryButton, SecondaryButton } from '../../buttons';
// Form inputs are now integrated directly into components
```

### Component Hierarchy
1. **Page components** use shared components from `components/`
2. **Page-specific components** live in `pages/[Page]/components/`
3. **Shared components** in `components/` should be generic and reusable

### Design System Consistency
- All components use CSS variables defined in `src/index.css`
- Follow 8px grid spacing system (--space-1 through --space-4)
- Use consistent border radius values (--radius-sm, --radius-md, --radius-lg)
- Apple-inspired design with clean, minimal aesthetics

## Development Standards

### Component Structure
Each component follows this structure:
```
ComponentName/
├── ComponentName.js  # Main component implementation
├── ComponentName.css # Component-specific styles
└── README.md         # Documentation and examples
```

### Why This Structure?
- **Fully explicit**: No hidden `index.js` files, everything is named clearly
- **Consistent pattern**: Same name for folder, JS file, and CSS file
- **Crystal clear imports**: `import Button from './Button/Button.js'`
- **Best developer experience**: Zero ambiguity about what each file contains

### Import Pattern
```javascript
// Always use explicit file paths
import { PrimaryButton, SecondaryButton } from '../../buttons';
// Form inputs are now integrated directly into components
```

### Props and API Design
- Use descriptive prop names
- Provide sensible defaults
- Support common patterns (loading, disabled, error states)
- Include TypeScript-style prop documentation in README

### Documentation Requirements
- Usage examples with code snippets
- Complete prop documentation
- Accessibility considerations
- Responsive behavior notes

## Migration Status

### ✅ Completed
- Button component extracted from AuthPage
- Input component extracted from AuthPage
- Card component created for containers
- CSS variables added for design system

### 📋 Next Steps
1. Update AuthPage to use new shared components
2. Extract tab navigation component
3. Create layout components for Dashboard
4. Add common utility components

## Design System

### Colors
- **Primary Background**: #F8F9FA (--bg-primary)
- **Secondary Background**: #FFFFFF (--bg-secondary)  
- **Primary Text**: #1A1A1A (--text-primary)
- **Secondary Text**: #6C757D (--text-secondary)
- **Accent**: #007AFF (--accent)

### Spacing
- **Small**: 8px (--space-1)
- **Medium**: 16px (--space-2)
- **Large**: 24px (--space-3)
- **XLarge**: 32px (--space-4)

### Typography
- **Font Family**: Apple system fonts (--font-family)
- **Font Smoothing**: Antialiased for crisp text
- **Responsive**: 16px minimum on mobile to prevent zoom

---

*This directory serves as the foundation for the entire application's UI, ensuring consistency and maintainability across all pages and features.*

## ✅ Component Quality Checklist

- [ ] Responsive design
- [ ] Consistent styling with design system
- [ ] Proper prop types or TypeScript (future)
- [ ] Accessibility attributes
- [ ] Loading and error states
- [ ] Clear documentation
- [ ] Reusable across different contexts

---
*Well-organized components make the entire app more maintainable and consistent.*
