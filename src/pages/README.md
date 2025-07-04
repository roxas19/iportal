# Pages Directory

This is the **main navigation hub** for all application features. Each page represents a distinct user flow or feature set.

## 🎯 Philosophy

**Page-centric architecture** means:
- Each major feature gets its own page folder
- Pages are self-contained with their own components
- Easy to trace features from URL to implementation
- AI agents can understand features at a glance

## 📁 Current Pages

### **AuthPage/** 
- **URL**: `/login`, `/register`
- **Purpose**: User authentication (login & registration)
- **Status**: ✅ Production ready

### **Dashboard/**
- **URL**: `/dashboard` 
- **Purpose**: User dashboard after login
- **Status**: ✅ MVP complete

## 🏗️ Page Structure Template

Each page folder should contain:

```
PageName/
├── index.js           # Main page component
├── PageName.css       # Page-specific styles
├── README.md          # Page documentation
└── components/        # Page-specific components
    ├── Component1.js
    └── Component2.js
```

## 📋 Creating New Pages

1. **Create folder** with descriptive name (e.g., `ProfilePage/`, `CoursePage/`)
2. **Add README.md** describing the page's purpose and features
3. **Create index.js** as the main component
4. **Add CSS file** for page-specific styling
5. **Add route** in main `App.js`
6. **Create components/** subfolder for page-specific UI

## 🔗 Integration with App.js

Pages are connected through React Router:

```javascript
// App.js
<Route path="/feature" element={<FeaturePage />} />
```

## 🎨 Design Consistency

All pages should follow:
- **Apple-inspired design** system
- **Responsive layout** patterns
- **Consistent navigation** and user flows
- **Error handling** and loading states

---
*This structure makes it easy for you and AI agents to find, understand, and modify any feature.*
