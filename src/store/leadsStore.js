import { create } from 'zustand';

export const useLeadsStore = create((set, get) => ({
  leads: [],
  savedContacts: [],
  searchHistory: [],
  isLoading: false,
  
  setLeads: (leads) => set({ leads }),
  
  addLead: (lead) => {
    const { leads } = get();
    set({ leads: [...leads, lead] });
  },
  
  saveContact: (contact) => {
    const { savedContacts } = get();
    const exists = savedContacts.find(c => c.email === contact.email);
    if (!exists) {
      set({ savedContacts: [...savedContacts, { ...contact, savedAt: new Date() }] });
    }
  },
  
  removeContact: (contactId) => {
    const { savedContacts } = get();
    set({ savedContacts: savedContacts.filter(c => c.id !== contactId) });
  },
  
  addSearchHistory: (search) => {
    const { searchHistory } = get();
    set({ 
      searchHistory: [
        { ...search, timestamp: new Date() },
        ...searchHistory.slice(0, 9)
      ]
    });
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  clearLeads: () => set({ leads: [] })
}));