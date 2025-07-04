// Button System - 5 Professional Button Types
// Import all button components from a single location

export { default as PrimaryButton } from './PrimaryButton';
export { default as SecondaryButton } from './SecondaryButton';
export { default as LinkButton } from './LinkButton';
export { default as TabButton } from './TabButton';
export { default as IconButton } from './IconButton';

/**
 * BUTTON USAGE GUIDE FOR AI AGENTS
 * 
 * 1. PrimaryButton - Main CTAs and form submissions
 *    - Use for: Login, Register, Create Account, Save, Submit
 *    - Features: Loading states, full-width option
 *    - Example: <PrimaryButton loading={isLoading} fullWidth>Login</PrimaryButton>
 * 
 * 2. SecondaryButton - Secondary actions
 *    - Use for: Cancel, Back, View All, secondary actions
 *    - Features: Outline style, less prominent
 *    - Example: <SecondaryButton size="small">View All</SecondaryButton>
 * 
 * 3. LinkButton - Text-based navigation
 *    - Use for: Inline links, text-only actions
 *    - Features: No background, underline on hover
 *    - Example: <LinkButton onClick={switchMode}>Register</LinkButton>
 * 
 * 4. TabButton - Toggle/switch actions
 *    - Use for: Tabs, filters, toggle states
 *    - Features: Active/inactive states, toggle behavior
 *    - Example: <TabButton active={isActive} onClick={handleTab}>Login</TabButton>
 * 
 * 5. IconButton - Compact actions
 *    - Use for: Header buttons, compact spaces, with/without icons
 *    - Features: 3 variants (primary/secondary/ghost), compact design
 *    - Example: <IconButton variant="primary" size="small">+ Course</IconButton>
 */
