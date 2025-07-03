import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuthStore } from '../store/authStore';

const { FiHome, FiSearch, FiUsers, FiCreditCard, FiDollarSign, FiSettings, FiLogOut } = FiIcons;

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user, credits } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiSearch, label: 'Lead Search', path: '/leads' },
    { icon: FiUsers, label: 'Contacts', path: '/contacts' },
    { icon: FiCreditCard, label: 'Credits', path: '/credits' },
    { icon: FiDollarSign, label: 'Billing', path: '/billing' },
    { icon: FiSettings, label: 'Settings', path: '/settings' },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col"
    >
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary-600">Apollo Clone</h1>
        <p className="text-sm text-gray-500 mt-1">Lead Generation Platform</p>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="bg-primary-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-700">Credits</span>
            <span className="text-lg font-bold text-primary-600">{credits}</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-primary-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((credits / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <SafeIcon icon={FiLogOut} className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;