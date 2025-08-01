# Frontend Architecture Guide

> **AI Agent Context**: Core patterns and philosophy for the Django React Platform frontend

## 🎯 Project Context

**Type**: React SPA with Django REST API  
**Philosophy**: Page-centric, Apple-inspired, AI-friendly structure  
**State**: React Context + custom hooks  
**Styling**: Custom CSS with design variables  

## 🏗️ Architecture Patterns

### Core Structure
```
src/
├── pages/           # 🎯 Features (each feature = own folder)
├── general/         # 🔧 Shared UI components  
├── contexts/        # 📡 Global state (AuthContext)
├── services/        # 🌐 API calls (axios)
└── App.js          # 🚦 Routes
```;p[']

### Key Principles
1. **Page-centric**: Each feature lives in `pages/FeatureName/`
2. **Shared UI**: Reusable components in `general/`
3. **Clear patterns**: Consistent file/folder naming
4. **Clean URLs**: `/login`, `/dashboard` (no hashes)
5. **AI-friendly**: Predictable structure, well-documented

## 📱 Development Patterns

### Page Structure Template
```
pages/FeaturePage/
├── FeaturePage.js    # Main component
├── FeaturePage.css   # Page styles  
├── README.md         # Feature docs
└── components/       # Page-specific components
```

### Component Patterns
- **Import style**: `import { Button } from '../../general/buttons'`
- **CSS naming**: `.component-name`, `.component-name--variant`
- **Props**: Explicit prop names, always include `className`
- **Documentation**: README.md for each component folder

### State Management
- **Global**: `AuthContext` for user/auth state
- **Local**: `useState` for component state  
- **Data fetching**: Custom hooks (e.g., `useInstructorDashboard`)

## 🎨 Design System Approach

### CSS Variables (index.css)
```css
:root {
  --bg-primary: #F8F9FA;    /* Backgrounds */
  --text-primary: #1A1A1A;   /* Text colors */
  --accent: #007AFF;         /* Apple blue */
  --space-1: 8px;            /* 8px grid spacing */
  --radius-md: 8px;          /* Border radius */
}
```

### Styling Philosophy
- **Apple-inspired**: Clean, minimal, premium feel
- **Consistent spacing**: 8px grid system
- **Component CSS**: Co-located with components
- **Responsive**: Mobile-first approach

## 🔌 API Integration

### Backend Communication
```javascript
// services/api.js
const api = axios.create({
  baseURL: 'http://localhost:8000',
  // JWT auto-attach + refresh interceptors
});

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login/', credentials),
  // ... other endpoints
};
```

### Response Pattern
```javascript
// Standardized backend responses
{
  "success": true,
  "message": "Description",
  "data": { /* actual data */ }
}
```

## 🚀 Quick Development Guide

### Adding New Feature
1. **Create**: `pages/NewFeature/` folder
2. **Component**: `NewFeature.js` + `NewFeature.css`
3. **Route**: Add to `App.js` routes
4. **API**: Add endpoints to `services/api.js` if needed

### Using Existing Components
- **Buttons**: 5 types in `general/buttons/` (Primary, Secondary, Link, Tab, Icon)
- **Forms**: `FormModal` for all form interfaces
- **Cards**: Course cards, contact cards in `general/`

### Common File Locations
| Need | Look Here |
|------|-----------|
| Authentication | `contexts/AuthContext.js` |
| API calls | `services/api.js` |
| Shared buttons | `general/buttons/` |
| Form handling | `general/FormModal/` |
| Route protection | `general/PrivateRoute.js` |
| Design variables | `index.css` |

## 🎯 Context for AI Agents

### What Makes This Different
1. **Page-centric**: Features are organized by page, not by component type
2. **Shared UI**: Common components extracted to `/general/`
3. **Apple design**: Premium, clean aesthetic with design system
4. **Real backend**: Connected to Django REST API with JWT auth
5. **AI-friendly**: Predictable patterns, clear documentation

### When Working Here
- **Start with pages**: Most changes happen in `pages/` directory
- **Reuse first**: Check `general/` before creating new components  
- **Follow patterns**: Use existing component and naming conventions
- **Document**: Add README.md for new components/pages
- **Test auth**: Most features require authentication context

### Current State
- ✅ **Auth system**: Login/register with JWT tokens
- ✅ **Dashboard**: 3-panel instructor interface
- ✅ **Component system**: Professional button + form system  
- ✅ **Backend integration**: Real API endpoints
- 🔄 **Growing**: More features being added regularly

**The key is understanding the page-centric philosophy - each major feature gets its own page folder with everything related to that feature contained within it.**
