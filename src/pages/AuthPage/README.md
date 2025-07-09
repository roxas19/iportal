# AuthPage - Authentication Feature

## 🎯 Purpose

Handles user authentication flows including login and registration with a clean, Apple-inspired design. Now uses extracted shared UI components for consistency.

## 🌐 URLs

- `/login` - User login form
- `/register` - User registration form  
- `/` - Redirects to login

## 🏗️ Architecture

### **Component Structure**
```
AuthPage/
├── AuthPage.js       # ✅ Main page component (explicit naming)
├── AuthPage.css      # ✅ Page-specific styles (streamlined)
├── README.md         # ✅ This documentation
└── components/       # 📋 Future page-specific components
```

### **Shared Components Used**
- Direct styling integration for form container and inputs
- New button components - Primary submit buttons and link-style nav buttons

**Import paths:**
```javascript
import { PrimaryButton, LinkButton } from '../../general/buttons';
// Form inputs are now integrated directly into the component
```

## ✨ Features

### **Login Flow**
- Email or username input (using shared `Input` component)
- Password input with validation
- "Remember me" functionality via JWT tokens
- Error handling with field-specific messages
- Loading states during API calls (using shared `Button` component)

### **Registration Flow**
- Username, email, full name inputs (using shared `Input` components)
- Password with 8-character minimum
- Role selection (Student, Instructor, or both)
- Form validation with real-time feedback
- Account creation with automatic login

### **User Experience**
- Clean tab switching between login/register
- Responsive design (mobile-friendly)
- Apple-style premium design
- Smooth transitions and interactions
- Proper error messaging

## 🏗️ Component Structure

```
AuthPage/
├── index.js              # Main page component
├── AuthPage.css          # Page-specific styles
├── README.md            # This documentation
└── components/          # Page-specific components
    ├── LoginForm.js     # Login form component
    ├── RegisterForm.js  # Registration form component
    └── AuthTabs.js      # Tab switching component
```

## 🔗 API Integration

**Endpoints Used:**
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration

**Token Handling:**
- JWT access/refresh tokens stored in localStorage
- Automatic token refresh via API interceptors
- Redirect to `/dashboard` on successful auth

## 🎨 Design System

**Colors:**
- Background: `#FFFFFF`
- Card: `#F5F7FA` 
- Text: `#1A1A1A`
- Accent: `#007AFF`
- Error: `#DC3545`

**Layout:**
- Centered card design (400-500px width)
- 12px border radius for premium feel
- Generous spacing (24px+ between elements)
- Mobile-responsive with proper breakpoints

## 🔄 State Management

Uses local useState for:
- Form data (username, email, password, etc.)
- Loading states
- Error messages
- Active tab (login/register)

Uses AuthContext for:
- User authentication status
- Login/logout functions
- User data storage

## ✅ Current Status

**✅ Completed:**
- Clean URL routing
- Form validation
- Error handling
- Mobile responsive
- JWT token management
- Apple-style design

**🔄 Next Enhancements:**
- React Hook Form integration
- Better validation schemas
- Loading skeleton states
- Password strength indicator
- "Forgot password" flow

## 🧪 Testing Notes

**Manual Testing:**
- Test both login and register flows
- Verify error handling with invalid data
- Check mobile responsiveness
- Test tab switching functionality
- Verify token storage and redirects

---
*This page represents the foundation of our authentication system with room for systematic enhancement.*
