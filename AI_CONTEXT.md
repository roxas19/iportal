# AI Agent Context Guide

## 🤖 How to Work with This Project

This guide helps AI agents understand the project structure, make informed decisions, and maintain consistency.

## 📁 Project Structure

```
frontend/src/
├── pages/              # 🎯 MAIN NAVIGATION - Start here for features
│   ├── AuthPage/       # Login/Register functionality
│   ├── Dashboard/      # User dashboard
│   └── [feature]/     # Future pages (Profile, Courses, etc.)
│
├── components/         # Shared building blocks
│   ├── ui/            # Basic components (Button, Input, Card)
│   ├── layout/        # Layout components (Header, Sidebar)
│   └── common/        # Utility components (Loading, Error)
│
├── contexts/          # React Context for state
├── services/          # API calls and external services
├── hooks/             # Custom React hooks
├── utils/             # Helper functions
└── constants/         # App-wide constants
```

## 🎯 Navigation Strategy

**Always start with `pages/` when adding features:**
1. Each page is self-contained with its own folder
2. Page folder contains: `index.js`, `[Page].css`, `README.md`, `components/`
3. Page-specific components live in the page's `components/` folder
4. Shared components go in the main `components/` folder

## 🏗️ Component Architecture

### **Page Components** (`pages/[Feature]/index.js`)
- Main entry point for a feature
- Imports from `./components/` for page-specific UI
- Imports from `../../components/` for shared UI
- Handles routing and main business logic

### **Shared Components** (`components/`)
- Reusable across multiple pages
- Well-documented with README.md
- Follows consistent naming: `ComponentName/index.js`

### **UI Components** (`components/ui/`)
- Basic building blocks (Button, Input, Card, Modal)
- Consistent styling following design system
- Minimal props, maximum reusability

## 🎨 Styling Guidelines

### **CSS Organization**
- One CSS file per component
- CSS files named `[ComponentName].css`
- Use CSS variables for design system consistency

### **Design System Values**
```css
/* Colors */
--bg-primary: #F8F9FA;
--bg-secondary: #FFFFFF;
--text-primary: #1A1A1A;
--text-secondary: #6C757D;
--accent: #007AFF;

/* Spacing (8px grid) */
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;

/* Border radius */
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
```

## 🔄 State Management

**Use React Context API:**
- `AuthContext` for authentication state
- Keep contexts focused and small
- Avoid prop drilling with contexts
- Use local state when possible

## 🌐 API Integration

**Use services pattern:**
```javascript
// services/api.js - Main axios instance
// services/authService.js - Auth-specific calls
// services/[feature]Service.js - Feature-specific calls
```

## 📝 Form Handling

**Current approach:**
- Controlled components with useState
- Manual validation with error states
- **Enhancement target**: React Hook Form + validation schemas

## 🚨 Error Handling

**Current level**: Basic error states
**Target**: Comprehensive error boundaries and user feedback

## 📚 Documentation Requirements

**Every major addition should include:**
1. README.md in the relevant folder
2. Inline comments for complex logic
3. Update this AI_CONTEXT.md if patterns change

## ✅ Code Quality Rules

1. **Consistent naming**: PascalCase for components, camelCase for functions
2. **File organization**: Group related files in folders
3. **Import order**: React first, then libraries, then local imports
4. **Comment complex logic**: Help future AI agents understand decisions

## 🎯 Current Development Priorities

1. **Page restructuring** - Move to page-centric architecture
2. **Form enhancement** - Better validation and UX
3. **Component extraction** - Build reusable UI library
4. **Error handling** - Improve user feedback

## 🤝 Working with This Project

**When making changes:**
1. Read the relevant README.md files first
2. Follow the established patterns
3. Update documentation if adding new patterns
4. Test incrementally
5. Maintain the Apple-inspired design consistency

**When unsure:**
- Check VISION.md for project philosophy
- Look at existing similar components for patterns
- Maintain consistency over innovation
- Ask specific questions about trade-offs

---
*This guide ensures all AI agents maintain project consistency and understand the architectural decisions.*
