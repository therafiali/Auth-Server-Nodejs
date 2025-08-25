'use client';

import { useEffect, useState } from 'react';
import TodosPage from '../../components/TodosPage';
import { redirectIfNotAuthenticated } from '../../utils/auth';

const TodosRoute = () => {
  const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       // Add a small delay to ensure cookies are properly set
//       await new Promise(resolve => setTimeout(resolve, 500));
//       await redirectIfNotAuthenticated();
//       setIsLoading(false);
//     };
    
//     checkAuth();
//   }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <TodosPage />;
};

export default TodosRoute;
