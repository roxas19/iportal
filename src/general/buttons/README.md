# Button System - Professional Design System

## 🎯 Overview
A professional, industry-standard button system with 5 core button types designed for consistency, accessibility, and AI-agent friendliness.

## 📚 Button Types

### 1. **PrimaryButton** - Main CTAs
```jsx
import { PrimaryButton } from '../components/buttons';

<PrimaryButton loading={isSubmitting} fullWidth>
  Login
</PrimaryButton>
```
**Use for:** Form submissions, main actions, primary CTAs

### 2. **SecondaryButton** - Secondary Actions
```jsx
import { SecondaryButton } from '../components/buttons';

<SecondaryButton size="small">
  View All Courses
</SecondaryButton>
```
**Use for:** Secondary actions, outline buttons, less prominent actions

### 3. **LinkButton** - Text Navigation
```jsx
import { LinkButton } from '../components/buttons';

<LinkButton onClick={handleSwitch}>
  Register
</LinkButton>
```
**Use for:** Inline text links, navigation without button appearance

### 4. **TabButton** - Toggle States
```jsx
import { TabButton } from '../components/buttons';

<TabButton active={activeTab === 'login'} onClick={handleTab}>
  Login
</TabButton>
```
**Use for:** Tab navigation, filters, toggle states

### 5. **IconButton** - Compact Actions
```jsx
import { IconButton } from '../components/buttons';

<IconButton variant="primary" size="small">
  + Course
</IconButton>
```
**Use for:** Header actions, compact spaces, icon buttons

## 🎨 Design Principles

- **Consistent Sizing:** Small (2rem), Medium (2.5rem), Large (3rem)
- **Accessible:** Focus states, ARIA attributes, keyboard navigation
- **Responsive:** Works across all screen sizes
- **Performance:** Minimal CSS, optimized animations
- **Professional:** Apple-inspired, clean design

## 🤖 AI Agent Guidelines

1. **Always use these 5 button types** - Never create custom buttons
2. **Choose based on action hierarchy** - Primary for main actions, Secondary for supporting actions
3. **Include accessibility props** - aria-labels for icon buttons, proper types for forms
4. **Use loading states** - PrimaryButton has built-in loading for async actions
5. **Size appropriately** - Small for headers/cards, Medium for forms, Large for hero actions

## 🔄 Migration from Old Button Component

Replace old Button component imports:
```jsx
// OLD - Remove this
import Button from '../../general/ui/Button/Button';

// NEW - Use specific button types
import { PrimaryButton, SecondaryButton, IconButton } from '../components/buttons';
```

## 📱 Responsive Behavior

All buttons automatically adapt to:
- Touch targets (min 44px on mobile)
- Reduced motion preferences
- High contrast mode
- Screen reader compatibility
