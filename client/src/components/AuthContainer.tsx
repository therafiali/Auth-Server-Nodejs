'use client';

import React, { useState } from 'react';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

type AuthMode = 'signup' | 'login';

const AuthContainer = () => {
  const [mode, setMode] = useState<AuthMode>('signup');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {mode === 'signup' ? <SignupForm /> : <LoginForm />}
      
      {/* Floating toggle button */}
      <div className="fixed top-4 right-4">
        <button
          onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-200"
        >
          {mode === 'signup' ? 'Switch to Login' : 'Switch to Signup'}
        </button>
      </div>
    </div>
  );
};

export default AuthContainer;
