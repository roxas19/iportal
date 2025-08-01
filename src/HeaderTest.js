// Test file to validate header components
import React from 'react';
import Header from './general/layout/Header/Header';
import Navigation from './general/layout/Header/components/Navigation';
import UserProfile from './general/layout/Header/components/UserProfile';

// This is just a test to see if all components can be imported without issues
console.log('Header:', Header);
console.log('Navigation:', Navigation);
console.log('UserProfile:', UserProfile);

export default function HeaderTest() {
  return (
    <div>
      <h1>Header Component Test</h1>
      <Navigation currentPath="/dashboard" />
      <UserProfile user={{ first_name: 'John', last_name: 'Doe' }} />
    </div>
  );
}
