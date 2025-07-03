import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useLeadsStore } from '../store/leadsStore';
import { format } from 'date-fns';

const { FiUsers, FiMail, FiPhone, FiMapPin, FiExternalLink, FiTrash2, FiDownload, FiSearch } = FiIcons;

const Contacts = () => {
  const { savedContacts, removeContact } = useLeadsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);

  const filteredContacts = savedContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };

  const handleDeleteSelected = () => {
    selectedContacts.forEach(contactId => {
      removeContact(contactId);
    });
    setSelectedContacts([]);
    toast.success(`${selectedContacts.length} contact(s) deleted successfully!`);
  };

  const handleExportContacts = () => {
    if (filteredContacts.length === 0) {
      toast.error('No contacts to export.');
      return;
    }

    const csvContent = [
      ['Name', 'Email', 'Company', 'Title', 'Phone', 'Location', 'Saved Date'].join(','),
      ...filteredContacts.map(contact => [
        contact.name,
        contact.email,
        contact.company,
        contact.title,
        contact.phone,
        contact.location,
        format(new Date(contact.savedAt), 'yyyy-MM-dd')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Contacts exported successfully!');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Contacts</h1>
          <p className="text-gray-600">Manage your saved leads and contacts</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Total:</span>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
            {savedContacts.length}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div className="relative flex-1 max-w-md">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            {selectedContacts.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                <span>Delete ({selectedContacts.length})</span>
              </button>
            )}
            <button
              onClick={handleExportContacts}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {filteredContacts.length > 0 && (
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedContacts.length === filteredContacts.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">Select all contacts</span>
            </label>
          </div>
        )}

        {filteredContacts.length > 0 ? (
          <div className="space-y-4">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                  selectedContacts.includes(contact.id) ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => handleSelectContact(contact.id)}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {contact.title}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{contact.company}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiMail} className="w-4 h-4" />
                        <span>{contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiPhone} className="w-4 h-4" />
                        <span>{contact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                        <span>{contact.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                        <a
                          href={contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500">
                      Saved on {format(new Date(contact.savedAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      removeContact(contact.id);
                      toast.success('Contact removed successfully!');
                    }}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No contacts found' : 'No saved contacts yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Try adjusting your search terms.'
                : 'Start by searching for leads and saving them to your contacts.'}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Contacts;