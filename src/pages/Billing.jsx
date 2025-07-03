import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

const { FiCreditCard, FiCalendar, FiDownload, FiCheck, FiX, FiStar } = FiIcons;

const Billing = () => {
  const { user, subscription, updateSubscription } = useAuthStore();
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      credits: 10,
      features: [
        '10 credits per month',
        'Basic lead search',
        'CSV export',
        'Email support'
      ],
      limitations: [
        'Limited search filters',
        'No API access',
        'Basic support only'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 49,
      credits: 200,
      popular: true,
      features: [
        '200 credits per month',
        'Advanced lead search',
        'CSV export',
        'Priority email support',
        'Advanced filters',
        'Contact enrichment'
      ],
      limitations: []
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      credits: 1000,
      features: [
        '1000 credits per month',
        'Advanced lead search',
        'CSV export',
        'Phone support',
        'Advanced filters',
        'Contact enrichment',
        'API access',
        'Custom integrations'
      ],
      limitations: []
    }
  ];

  const mockTransactions = [
    {
      id: 'txn_001',
      date: new Date('2024-01-15'),
      description: 'Professional Plan - Monthly',
      amount: 49,
      status: 'completed'
    },
    {
      id: 'txn_002',
      date: new Date('2024-01-10'),
      description: 'Credit Top-up - 100 credits',
      amount: 29,
      status: 'completed'
    },
    {
      id: 'txn_003',
      date: new Date('2023-12-15'),
      description: 'Professional Plan - Monthly',
      amount: 49,
      status: 'completed'
    }
  ];

  const handlePlanChange = async (planId) => {
    setIsChangingPlan(true);
    try {
      // Mock plan change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPlan = subscriptionPlans.find(p => p.id === planId);
      updateSubscription({
        plan: planId,
        status: 'active',
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      
      toast.success(`Successfully changed to ${newPlan.name} plan!`);
    } catch (error) {
      toast.error('Failed to change plan. Please try again.');
    } finally {
      setIsChangingPlan(false);
    }
  };

  const handleDownloadInvoice = (transactionId) => {
    // Mock invoice download
    toast.success('Invoice downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription and billing information</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-primary-600 capitalize">
                    {subscription?.plan || 'Free'} Plan
                  </h3>
                  {subscription?.plan === 'pro' && (
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-gray-600">
                  {subscription?.plan === 'free' ? 'Free tier' : `$${subscriptionPlans.find(p => p.id === subscription?.plan)?.price || 0}/month`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Next billing date</p>
                <p className="font-medium text-gray-900">
                  {subscription?.nextBilling 
                    ? format(new Date(subscription.nextBilling), 'MMM dd, yyyy')
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiCalendar} className="w-4 h-4" />
              <span>
                Status: <span className="font-medium text-green-600">Active</span>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h2>
            <div className="space-y-4">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-4 border rounded-lg ${
                    subscription?.plan === plan.id 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                        {plan.popular && (
                          <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                            <SafeIcon icon={FiStar} className="w-3 h-3" />
                            <span>Popular</span>
                          </span>
                        )}
                        {subscription?.plan === plan.id && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            Current Plan
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-primary-600 mb-2">
                        ${plan.price}
                        <span className="text-sm font-normal text-gray-500">/month</span>
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <SafeIcon icon={FiX} className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span className="text-gray-400">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4">
                      {subscription?.plan !== plan.id && (
                        <button
                          onClick={() => handlePlanChange(plan.id)}
                          disabled={isChangingPlan}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isChangingPlan ? 'Changing...' : 'Select Plan'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <SafeIcon icon={FiCreditCard} className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/27</p>
              </div>
            </div>
            <button className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              Update Payment Method
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {format(transaction.date, 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      ${transaction.amount}
                    </span>
                    <button
                      onClick={() => handleDownloadInvoice(transaction.id)}
                      className="text-primary-600 hover:text-primary-700 p-1"
                    >
                      <SafeIcon icon={FiDownload} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All Transactions
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Billing;