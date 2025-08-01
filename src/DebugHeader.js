// Debug Header Component
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const DebugHeader = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  console.log('=== DEBUG HEADER ===');
  console.log('Current path:', location.pathname);
  console.log('User object:', user);
  console.log('User exists:', !!user);
  
  return (
    <div style={{ 
      background: 'red', 
      padding: '20px', 
      color: 'white',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999
    }}>
      <div>DEBUG HEADER</div>
      <div>Path: {location.pathname}</div>
      <div>User: {user ? JSON.stringify(user) : 'NULL'}</div>
      <div>Auth Status: {user ? 'LOGGED IN' : 'NOT LOGGED IN'}</div>
    </div>
  );
};

export default DebugHeader;
