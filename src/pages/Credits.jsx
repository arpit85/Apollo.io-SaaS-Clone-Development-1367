import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuthStore } from '../store/authStore';
import { paymentService } from '../services/api';

const { FiCreditCard, FiZap, FiStar, FiCheck, FiShoppingCart } = FiIcons;

const Credits = () => {
  const { credits, addCredits, user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const creditPackages = [
    {
      id: 'basic',
      name: 'Basic Pack',
      credits: 50,
      price: 29,
      popular: false,
      features: [
        '50 Lead searches',
        '50 Contact saves',
        'Basic email support',
        'CSV export'
      ]
    },
    {
      id: 'professional',
      name: 'Professional Pack',
      credits: 200,
      price: 99,
      popular: true,
      features: [
        '200 Lead searches',
        '200 Contact saves',
        'Priority email support',
        'CSV export',
        'Advanced filters'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Pack',
      credits: 500,
      price: 199,
      popular: false,
      features: [
        '500 Lead searches',
        '500 Contact saves',
        'Phone support',
        'CSV export',
        'Advanced filters',
        'API access'
      ]
    }
  ];

  const handlePurchase = async (packageData) => {
    setIsProcessing(true);
    try {
      // Mock payment processing
      await paymentService.processPayment('card', packageData.price);
      
      addCredits(packageData.credits);
      toast.success(`Successfully purchased ${packageData.credits} credits!`);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credits</h1>
          <p className="text-gray-600">Purchase credits to generate more leads</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Current Balance:</span>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
            {credits} Credits
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Credit Balance</h2>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiZap} className="w-6 h-6" />
              <span className="text-3xl font-bold">{credits}</span>
              <span className="text-primary-200">credits remaining</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-primary-200 text-sm">1 Credit = 1 Lead Search</p>
            <p className="text-primary-200 text-sm">1 Credit = 1 Contact Save</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creditPackages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`relative bg-white rounded-xl p-6 shadow-sm border-2 ${
              pkg.popular ? 'border-primary-500' : 'border-gray-200'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <SafeIcon icon={FiStar} className="w-3 h-3" />
                  <span>Most Popular</span>
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-3xl font-bold text-primary-600">${pkg.price}</span>
                <span className="text-gray-500">one-time</span>
              </div>
              <p className="text-gray-600">{pkg.credits} credits</p>
            </div>

            <div className="space-y-3 mb-6">
              {pkg.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handlePurchase(pkg)}
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                pkg.popular
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <SafeIcon icon={FiShoppingCart} className="w-4 h-4" />
              <span>{isProcessing ? 'Processing...' : 'Purchase Credits'}</span>
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How Credits Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Lead Search</h4>
            <p className="text-sm text-gray-600">
              Each search query consumes 1 credit. The search returns up to 50 leads matching your criteria.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Contact Save</h4>
            <p className="text-sm text-gray-600">
              Saving a contact to your database consumes 1 credit. Saved contacts include enriched data.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">No Expiration</h4>
            <p className="text-sm text-gray-600">
              Credits never expire. Use them at your own pace without worrying about time limits.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Refund Policy</h4>
            <p className="text-sm text-gray-600">
              Unused credits can be refunded within 30 days of purchase. Contact support for assistance.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Credits;