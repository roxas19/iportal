# CourseCard Component

A flexible, reusable component for displaying course information throughout the application.

## Usage

```jsx
import CourseCard from '../../general/courses/CourseCard/CourseCard';

// Basic usage
<CourseCard course={courseData} />

// Compact version for dashboards
<CourseCard 
  course={courseData} 
  size="compact" 
  showActions={false}
  onClick={handleCourseClick}
/>

// Featured course card
<CourseCard 
  course={courseData} 
  variant="featured" 
  onEdit={handleEdit}
  onView={handleView}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `course` | Object | Required | Course data object |
| `size` | String | `'standard'` | Card size: `'compact'`, `'standard'`, `'full'` |
| `variant` | String | `'default'` | Card style: `'default'`, `'featured'`, `'enrolled'` |
| `showActions` | Boolean | `true` | Whether to show Edit/View buttons |
| `onEdit` | Function | - | Callback when Edit button is clicked |
| `onView` | Function | - | Callback when View button is clicked |
| `onClick` | Function | - | Callback when card is clicked (makes card clickable) |

## Course Data Structure

The `course` prop should be an object with the following structure:

```javascript
{
  id: 'course-123',
  title: 'Introduction to React',
  status: 'live', // 'live', 'draft', or 'archived'
  students: 45,
  lastUpdated: '2023-12-01T10:30:00Z'
}
```

## Size Variants

- **`compact`**: Minimal information, no stats or actions. Perfect for dashboard panels.
- **`standard`**: Default size with stats and actions. Good for course lists.
- **`full`**: Larger size with more spacing. Ideal for featured course displays.

## Style Variants

- **`default`**: Standard appearance
- **`featured`**: Blue border with gradient background for highlighting
- **`enrolled`**: Green accent for courses the user is enrolled in

## Examples

### Dashboard Panel (Compact)
```jsx
<CourseCard 
  course={course} 
  size="compact" 
  showActions={false}
  onClick={navigateToCourse}
/>
```

### Course Management Page (Standard)
```jsx
<CourseCard 
  course={course} 
  onEdit={handleEditCourse}
  onView={handleViewCourse}
/>
```

### Featured Course (Full)
```jsx
<CourseCard 
  course={course} 
  size="full"
  variant="featured"
  onEdit={handleEditCourse}
  onView={handleViewCourse}
/>
```
