import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

export const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading period to allow webhook processing
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your subscription is now active.
          </p>
          {sessionId && (
            <p className="mt-2 text-xs text-gray-500">
              Session ID: {sessionId}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
              Your subscription is now active
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
              You have access to all premium features
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
              You'll receive email confirmations shortly
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
          
          <Link
            to="/dashboard"
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Explore Features
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-500">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};