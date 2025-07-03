import axios from 'axios';

const API_BASE_URL = 'https://api.rapidapi.com';

// Mock RapidAPI service - Replace with actual RapidAPI endpoints
export const rapidApiService = {
  searchLeads: async (searchParams) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data - Replace with actual RapidAPI call
    const mockLeads = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@techcorp.com',
        company: 'TechCorp Inc.',
        title: 'VP of Sales',
        phone: '+1-555-0123',
        linkedin: 'https://linkedin.com/in/johnsmith',
        location: 'San Francisco, CA',
        industry: 'Technology',
        companySize: '100-500',
        revenue: '$10M-$50M'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@innovate.com',
        company: 'Innovate Solutions',
        title: 'Marketing Director',
        phone: '+1-555-0124',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        location: 'New York, NY',
        industry: 'Marketing',
        companySize: '50-100',
        revenue: '$5M-$10M'
      },
      {
        id: 3,
        name: 'Michael Chen',
        email: 'michael.chen@startup.io',
        company: 'Startup.io',
        title: 'CEO',
        phone: '+1-555-0125',
        linkedin: 'https://linkedin.com/in/michaelchen',
        location: 'Austin, TX',
        industry: 'SaaS',
        companySize: '10-50',
        revenue: '$1M-$5M'
      }
    ];
    
    return mockLeads.filter(lead => 
      !searchParams.company || lead.company.toLowerCase().includes(searchParams.company.toLowerCase())
    );
  },
  
  enrichContact: async (email) => {
    // Mock contact enrichment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      email,
      verified: Math.random() > 0.3,
      socialProfiles: {
        linkedin: `https://linkedin.com/in/${email.split('@')[0]}`,
        twitter: `https://twitter.com/${email.split('@')[0]}`
      },
      lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    };
  }
};

// Payment processing service
export const paymentService = {
  createPaymentIntent: async (amount, currency = 'usd') => {
    // Mock payment intent creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      clientSecret: 'mock_client_secret',
      amount,
      currency
    };
  },
  
  processPayment: async (paymentMethod, amount) => {
    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
      amount
    };
  }
};