import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuthStore } from '../store/authStore';
import { useLeadsStore } from '../store/leadsStore';
import ReactECharts from 'echarts-for-react';

const { FiUsers, FiCreditCard, FiTrendingUp, FiActivity, FiTarget, FiDollarSign } = FiIcons;

const Dashboard = () => {
  const { user, credits, subscription } = useAuthStore();
  const { savedContacts, searchHistory } = useLeadsStore();
  const [stats, setStats] = useState({
    totalContacts: 0,
    leadsGenerated: 0,
    creditsUsed: 0,
    conversionRate: 0
  });

  useEffect(() => {
    // Mock stats calculation
    setStats({
      totalContacts: savedContacts.length,
      leadsGenerated: searchHistory.length * 3,
      creditsUsed: 100 - credits,
      conversionRate: 23.5
    });
  }, [savedContacts, searchHistory, credits]);

  const chartOptions = {
    title: {
      text: 'Lead Generation Over Time',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Leads Generated', 'Contacts Saved'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Leads Generated',
        type: 'line',
        stack: 'Total',
        data: [12, 13, 10, 13, 9, 23, 21]
      },
      {
        name: 'Contacts Saved',
        type: 'line',
        stack: 'Total',
        data: [22, 18, 19, 23, 29, 35, 36]
      }
    ]
  };

  const statCards = [
    {
      title: 'Total Contacts',
      value: stats.totalContacts,
      icon: FiUsers,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Credits Remaining',
      value: credits,
      icon: FiCreditCard,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Leads Generated',
      value: stats.leadsGenerated,
      icon: FiTarget,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: FiTrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your leads today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Current Plan:</span>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize">
            {subscription?.plan || 'Free'}
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${card.bgColor} rounded-xl p-6 border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor} mt-1`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <SafeIcon icon={card.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Generation Chart</h3>
          <ReactECharts option={chartOptions} style={{ height: '300px' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {searchHistory.slice(0, 5).map((search, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Searched for leads in {search.company || 'various companies'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(search.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {searchHistory.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent activity. Start searching for leads!
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Need more credits?</h3>
            <p className="text-primary-100 mt-1">
              Upgrade your plan or purchase additional credits to continue generating leads.
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Buy Credits
            </button>
            <button className="bg-primary-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-800 transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;