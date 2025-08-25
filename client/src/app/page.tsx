'use client';

import { useEffect, useState } from 'react';
import AuthContainer from '../components/AuthContainer';
import HealthCheck from '../components/HealthCheck';
import { redirectIfAuthenticated } from '../utils/auth';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Add a small delay to ensure cookies are properly set
      await new Promise(resolve => setTimeout(resolve, 500));
      await redirectIfAuthenticated();
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <HealthCheck />
      <AuthContainer />
    </>
  );
};

export default Home;