import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getMyProfile, updateMyProfile } from '../api';
import type { CustomerProfile } from '../types';
import { useTranslation } from 'react-i18next';
import { subscribe } from '../ws/customerSocket';

interface UserContextType {
  user: CustomerProfile | null;
  loading: boolean;
  updateLanguage: (lang: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  const fetchUser = async () => {
    try {
      const profile = await getMyProfile();
      setUser(profile);
      // Sync i18n language with user's language preference
      if (profile.lang && i18n.language !== profile.lang) {
        await i18n.changeLanguage(profile.lang);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLanguage = async (lang: string) => {
    try {
      const updated = await updateMyProfile({ lang });
      setUser(updated);
      await i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Failed to update language:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => subscribe('balance_updated', () => { fetchUser(); }), []);

  return (
    <UserContext.Provider value={{ user, loading, updateLanguage, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
