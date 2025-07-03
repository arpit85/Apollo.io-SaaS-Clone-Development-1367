import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      subscription: null,
      credits: 0,
      loading: false,
      
      // Initialize auth state from Supabase
      initialize: async () => {
        set({ loading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            set({ 
              user: session.user,
              session,
              subscription: { plan: 'free', status: 'active' },
              credits: 10
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
        } finally {
          set({ loading: false });
        }
      },
      
      // Sign up with email and password
      signUp: async (email, password, userData) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: userData.name,
                company: userData.company || '',
              }
            }
          });
          
          if (error) throw error;
          
          if (data.user) {
            set({ 
              user: data.user,
              session: data.session,
              subscription: { plan: 'free', status: 'active' },
              credits: 10
            });
            return { success: true, data };
          }
          
          return { success: true, data };
        } catch (error) {
          console.error('Sign up error:', error);
          return { success: false, error: error.message };
        } finally {
          set({ loading: false });
        }
      },
      
      // Sign in with email and password
      signIn: async (email, password) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) throw error;
          
          set({ 
            user: data.user,
            session: data.session,
            subscription: { plan: 'free', status: 'active' },
            credits: 50
          });
          
          return { success: true, data };
        } catch (error) {
          console.error('Sign in error:', error);
          return { success: false, error: error.message };
        } finally {
          set({ loading: false });
        }
      },
      
      // Sign out
      signOut: async () => {
        set({ loading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          
          set({ 
            user: null, 
            session: null, 
            subscription: null, 
            credits: 0 
          });
          
          return { success: true };
        } catch (error) {
          console.error('Sign out error:', error);
          return { success: false, error: error.message };
        } finally {
          set({ loading: false });
        }
      },
      
      // Legacy methods for backward compatibility
      login: (userData) => {
        set({ 
          user: userData,
          subscription: userData.subscription || { plan: 'free', status: 'active' },
          credits: userData.credits || 10
        });
      },
      
      logout: () => {
        set({ user: null, session: null, subscription: null, credits: 0 });
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
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        subscription: state.subscription,
        credits: state.credits
      })
    }
  )
);