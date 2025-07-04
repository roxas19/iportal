# NetworkStats Component

A flexible, reusable component for displaying network statistics in dashboard panels.

## Usage

```jsx
import NetworkStats from '../../general/network/NetworkStats/NetworkStats';

// Basic usage
<NetworkStats stats={networkData} />

// Compact version for dashboards
<NetworkStats 
  stats={networkData} 
  size="compact"
/>

// Featured network stats
<NetworkStats 
  stats={networkData} 
  variant="featured"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `stats` | Object | `{}` | Network statistics data object |
| `size` | String | `'standard'` | Component size: `'compact'`, `'standard'`, `'full'` |
| `variant` | String | `'default'` | Component style: `'default'`, `'featured'` |

## Stats Data Structure

The `stats` prop should be an object with the following structure:

```javascript
{
  allContacts: 25,           // Total number of contacts
  platformConnections: 18,   // Contacts who are platform users
  manualContacts: 7          // Manually added contacts
}
```

## Size Variants

- **`compact`**: Minimal spacing, smaller fonts. Perfect for dashboard panels.
- **`standard`**: Default size with balanced spacing. Good for main content areas.
- **`full`**: Larger size with more spacing. Ideal for dedicated network pages.

## Style Variants

- **`default`**: Standard appearance with light background
- **`featured`**: Blue accent border and gradient background for emphasis

## Examples

### Dashboard Panel (Compact)
```jsx
<NetworkStats 
  stats={{
    allContacts: 25,
    platformConnections: 18,
    manualContacts: 7
  }} 
  size="compact"
/>
```

### Main Network Page (Standard)
```jsx
<NetworkStats 
  stats={networkData}
/>
```

### Featured Stats (Full)
```jsx
<NetworkStats 
  stats={networkData} 
  size="full"
  variant="featured"
/>
```
