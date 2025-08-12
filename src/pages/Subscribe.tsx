import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { createCheckoutSession } from '../lib/stripe';
import { products } from '../stripe-config';
import { Check, Crown, Zap, ArrowLeft } from 'lucide-react';

export const Subscribe: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { isActive, loading: subscriptionLoading } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (authLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isActive) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubscribe = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      const { url } = await createCheckoutSession(priceId, mode);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create checkout session. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="text-center">
          <Crown className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Select the perfect plan for your needs
          </p>
        </div>

        {error && (
          <div className="mt-8 max-w-lg mx-auto p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="mt-16 grid gap-8 lg:grid-cols-1 max-w-lg mx-auto">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-8">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-900">{product.name}</h3>
                  <div className="mt-4">
                    <span className="text-5xl font-extrabold text-gray-900">{product.price}</span>
                    {product.mode === 'subscription' && (
                      <span className="text-xl font-medium text-gray-500">/month</span>
                    )}
                  </div>
                  <p className="mt-4 text-lg text-gray-600">
                    {product.description}
                  </p>
                </div>

                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Premium mirror features</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Custom integrations</span>
                  </li>
                </ul>

                <div className="mt-8">
                  <button
                    onClick={() => handleSubscribe(product.priceId, product.mode)}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        {product.mode === 'subscription' ? 'Subscribe Now' : 'Buy Now'}
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-4 text-xs text-center text-gray-500">
                  {product.mode === 'subscription' ? 'Cancel anytime. No questions asked.' : 'One-time payment'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Have questions?{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-500">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};