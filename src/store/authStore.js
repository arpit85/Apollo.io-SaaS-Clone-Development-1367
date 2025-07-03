import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      subscription: null,
      credits: 0,
      
      login: (userData) => {
        set({ 
          user: userData,
          subscription: userData.subscription || { plan: 'free', status: 'active' },
          credits: userData.credits || 10
        });
      },
      
      logout: () => {
        set({ user: null, subscription: null, credits: 0 });
      },
      
      updateCredits: (newCredits) => {
        set({ credits: newCredits });
      },
      
      deductCredit: () => {
        const { credits } = get();
        if (credits > 0) {
          set({ credits: credits - 1 });
          return true;
        }
        return false;
      },
      
      updateSubscription: (subscription) => {
        set({ subscription });
      },
      
      addCredits: (amount) => {
        const { credits } = get();
        set({ credits: credits + amount });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);