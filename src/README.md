# Frontend Source Code

This is the main source directory for the React frontend application.

## 📁 Structure Overview

```
src/
├── 📄 AI_CONTEXT.md           # Guide for AI agents
├── 📄 App.js                  # Main routing and app structure
├── 📄 index.js                # Entry point
│
├── 📁 pages/                  # 🎯 FEATURE PAGES (start here)
│   ├── AuthPage/              # Login & Registration
│   ├── Dashboard/             # User dashboard
│   └── [future features]/
│
├── 📁 components/             # Shared UI components
│   ├── ui/                    # Basic building blocks
│   ├── layout/               # Layout components
│   └── common/               # Utility components
│
├── 📁 contexts/              # React Context providers
├── 📁 services/              # API calls & external services
├── 📁 hooks/                 # Custom React hooks
├── 📁 utils/                 # Helper functions
└── 📁 constants/            # App constants
```

## 🧭 Navigation Guide

### **Adding New Features**
1. **Start in `pages/`** - Create a new folder for your feature
2. **Each page folder contains:**
   - `index.js` - Main component
   - `[PageName].css` - Styles
   - `README.md` - Feature documentation
   - `components/` - Page-specific components

### **Creating Shared Components**
1. **Add to `components/`** if used across multiple pages
2. **Follow folder structure:** `ComponentName/index.js`
3. **Include documentation** and consistent styling

## 🎨 Design System

**Colors:**
- Background: `#F8F9FA`
- Cards: `#FFFFFF`
- Text: `#1A1A1A` / `#6C757D`
- Accent: `#007AFF`

**Spacing:** 8px grid system (8px, 16px, 24px, 32px)
**Typography:** Apple system fonts
**Components:** Apple-inspired, clean, minimal

## 🔧 Current Setup

- **React Router** - Clean URL routing
- **Context API** - Authentication state
- **Axios** - API communication with JWT
- **Custom CSS** - Full styling control

## 🎯 Development Status

**✅ Complete:**
- Authentication system (login/register)
- Clean routing (/login, /register, /dashboard)
- JWT token handling
- Apple-style design foundation

**🔄 In Progress:**
- Page-centric restructuring
- Component library extraction
- Form enhancement
- Error handling improvements

---
*Each subfolder contains its own README.md with specific guidance.*
