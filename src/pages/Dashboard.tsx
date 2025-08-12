import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { signOut } from '../lib/supabase';
import { BarChart3, Users, TrendingUp, DollarSign, LogOut, Crown, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { subscription, isActive, currentProduct } = useSubscription();

  const handleSignOut = async () => {
    await signOut();
  };

  const stats = [
    { name: 'Total Revenue', value: '$12,345', icon: DollarSign, change: '+12%' },
    { name: 'Active Users', value: '1,234', icon: Users, change: '+5%' },
    { name: 'Conversion Rate', value: '3.24%', icon: TrendingUp, change: '+0.5%' },
    { name: 'Monthly Growth', value: '23.1%', icon: BarChart3, change: '+2.1%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-yellow-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Premium Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {user?.email}
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {isActive ? (
            <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white p-6">
              <h2 className="text-2xl font-bold mb-2">🎉 You're a Premium Member!</h2>
              <p className="text-blue-100">
                Plan: <span className="font-semibold">{currentProduct?.name || 'Premium'}</span>
              </p>
              <p className="text-blue-100">
                Status: <span className="font-semibold capitalize">{subscription?.subscription_status}</span>
              </p>
              {subscription?.current_period_end && (
                <p className="text-blue-100">
                  Next billing: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <div className="mb-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg text-white p-6">
              <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
              <p className="text-blue-100">
                You don't have an active subscription yet.
              </p>
              <Link 
                to="/subscribe"
                className="mt-4 inline-flex items-center px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Subscribe Now
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((item) => (
              <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <item.icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {item.value}
                          </div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            {item.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Premium Analytics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">User Engagement</span>
                    <span className="text-sm font-medium text-gray-900">89%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="text-sm font-medium text-gray-900">3.24%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Premium Features
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">Advanced Analytics Enabled</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">Data Export Available</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">Priority Support</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">Custom Integrations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};