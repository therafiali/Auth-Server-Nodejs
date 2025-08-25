'use client';

import React, { useState, useEffect } from 'react';

const HealthCheck = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      console.log('🔍 Checking backend health...');
      const response = await fetch('http://localhost:3000/health', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      console.log('📡 Health check response:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend is healthy:', data);
        setStatus('connected');
        setMessage('Backend server is running and healthy!');
      } else {
        setStatus('error');
        setMessage(`Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('🚨 Health check failed:', error);
      setStatus('error');
      setMessage('Cannot connect to backend server. Please make sure it is running on port 3000.');
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="font-semibold mb-2">Backend Status</h3>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          status === 'checking' ? 'bg-yellow-500' :
          status === 'connected' ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className="text-sm">
          {status === 'checking' ? 'Checking...' :
           status === 'connected' ? 'Connected' : 'Error'}
        </span>
      </div>
      {message && (
        <p className="text-xs text-gray-600 mt-1">{message}</p>
      )}
      <button
        onClick={checkHealth}
        className="text-xs text-blue-600 hover:text-blue-800 mt-2"
      >
        Retry
      </button>
    </div>
  );
};

export default HealthCheck;
