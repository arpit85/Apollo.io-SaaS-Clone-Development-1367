import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuthStore } from '../store/authStore';
import { useLeadsStore } from '../store/leadsStore';
import { rapidApiService } from '../services/api';

const { FiSearch, FiFilter, FiDownload, FiBookmark, FiExternalLink, FiMail, FiPhone, FiMapPin } = FiIcons;

const LeadSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { credits, deductCredit } = useAuthStore();
  const { addSearchHistory, saveContact } = useLeadsStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSearch = async (data) => {
    if (credits <= 0) {
      toast.error('Insufficient credits. Please purchase more credits to continue.');
      return;
    }

    setIsSearching(true);
    try {
      const results = await rapidApiService.searchLeads(data);
      setSearchResults(results);
      
      // Deduct credits for the search
      if (deductCredit()) {
        addSearchHistory(data);
        toast.success(`Found ${results.length} leads! 1 credit deducted.`);
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveContact = (contact) => {
    if (credits <= 0) {
      toast.error('Insufficient credits to save contact.');
      return;
    }

    if (deductCredit()) {
      saveContact(contact);
      toast.success('Contact saved successfully! 1 credit deducted.');
    }
  };

  const handleExportResults = () => {
    if (searchResults.length === 0) {
      toast.error('No results to export.');
      return;
    }

    const csvContent = [
      ['Name', 'Email', 'Company', 'Title', 'Phone', 'Location'].join(','),
      ...searchResults.map(lead => [
        lead.name,
        lead.email,
        lead.company,
        lead.title,
        lead.phone,
        lead.location
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Results exported successfully!');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Search</h1>
          <p className="text-gray-600">Find and connect with potential leads</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Credits:</span>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
            {credits}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                {...register('company')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Google, Microsoft"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., CEO, Marketing Manager"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                {...register('location')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                {...register('industry')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Industries</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size
              </label>
              <select
                {...register('companySize')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Sizes</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <SafeIcon icon={FiFilter} className="w-4 h-4" />
              <span>Advanced Filters</span>
            </button>
            <button
              type="submit"
              disabled={isSearching || credits <= 0}
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiSearch} className="w-4 h-4" />
              <span>{isSearching ? 'Searching...' : 'Search Leads'}</span>
            </button>
          </div>
        </form>
      </motion.div>

      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
              <button
                onClick={handleExportResults}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {searchResults.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {lead.title}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{lead.company}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiMail} className="w-4 h-4" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiPhone} className="w-4 h-4" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                        <span>{lead.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                        <a
                          href={lead.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveContact(lead)}
                      className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm"
                    >
                      <SafeIcon icon={FiBookmark} className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {searchResults.length === 0 && !isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiSearch} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No search results yet</h3>
          <p className="text-gray-600">Use the search form above to find leads matching your criteria.</p>
        </motion.div>
      )}
    </div>
  );
};

export default LeadSearch;