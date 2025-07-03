import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const { FiHome, FiSearch, FiUsers, FiCreditCard, FiDollarSign, FiSettings, FiLogOut } = FiIcons;

const Sidebar = () => {
  const navigate = useNavigate();
  const { signOut, user, credits } = useAuthStore();

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      toast.success('Signed out successfully');
      navigate('/login');
    } else {
      toast.error('Error signing out');
    }
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-primary-600">Apollo Clone</h1>
          <p className="text-sm text-gray-500 mt-1">Lead Generation Platform</p>
        </motion.div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary-50 rounded-lg p-3"
        >
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
        </motion.div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.li 
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
        >
          <SafeIcon icon={FiLogOut} className="w-5 h-5 mr-3 group-hover:transform group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;