import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, MonthData, TaEntry } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  profiles: UserProfile[];
  currentProfileId: string | null;
  currentMonthData: MonthData | null;
  addProfile: (profile: UserProfile) => void;
  switchProfile: (id: string) => void;
  updateProfile: (profile: UserProfile) => void;
  createOrGetMonth: (year: number, month: number) => void;
  saveEntry: (entry: TaEntry) => void;
  deleteEntry: (entryId: string) => void;
  clearCurrentData: () => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (val: boolean) => void;
  duplicateLastEntry: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to save to local storage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Storage limit reached or error", e);
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [currentMonthData, setCurrentMonthData] = useState<MonthData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load initial data
  useEffect(() => {
    const storedProfiles = localStorage.getItem('railway_ta_profiles');
    if (storedProfiles) {
      setProfiles(JSON.parse(storedProfiles));
    }
    const lastProfileId = localStorage.getItem('railway_ta_last_profile');
    if (lastProfileId) {
      setCurrentProfileId(lastProfileId);
    }
  }, []);

  // Save profiles when changed
  useEffect(() => {
    saveToStorage('railway_ta_profiles', profiles);
  }, [profiles]);

  // Save current profile ID
  useEffect(() => {
    if (currentProfileId) {
      localStorage.setItem('railway_ta_last_profile', currentProfileId);
    }
  }, [currentProfileId]);

  const addProfile = (profile: UserProfile) => {
    const newProfiles = [...profiles, profile];
    setProfiles(newProfiles);
    setCurrentProfileId(profile.id);
  };

  const updateProfile = (updatedProfile: UserProfile) => {
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
  };

  const switchProfile = (id: string) => {
    setCurrentProfileId(id);
    setCurrentMonthData(null); // Reset month view on switch
  };

  const createOrGetMonth = (year: number, month: number) => {
    if (!currentProfileId) return;
    
    const id = `${year}-${month}-${currentProfileId}`;
    const storedMonth = localStorage.getItem(`ta_${id}`);
    
    if (storedMonth) {
      setCurrentMonthData(JSON.parse(storedMonth));
    } else {
      const newData: MonthData = {
        id,
        profileId: currentProfileId,
        year,
        month,
        entries: []
      };
      setCurrentMonthData(newData);
    }
  };

  const saveEntry = (entry: TaEntry) => {
    if (!currentMonthData) return;
    
    let newEntries = [...currentMonthData.entries];
    const index = newEntries.findIndex(e => e.id === entry.id);
    
    if (index >= 0) {
      newEntries[index] = entry;
    } else {
      newEntries.push(entry);
    }

    // Sort by date/time
    newEntries.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.departureTime.localeCompare(b.departureTime);
    });

    const newData = { ...currentMonthData, entries: newEntries };
    setCurrentMonthData(newData);
    saveToStorage(`ta_${newData.id}`, newData);
    setHasUnsavedChanges(false);
  };

  const deleteEntry = (entryId: string) => {
    if (!currentMonthData) return;
    const newEntries = currentMonthData.entries.filter(e => e.id !== entryId);
    const newData = { ...currentMonthData, entries: newEntries };
    setCurrentMonthData(newData);
    saveToStorage(`ta_${newData.id}`, newData);
  };

  const duplicateLastEntry = () => {
    if (!currentMonthData || currentMonthData.entries.length === 0) return;
    const lastEntry = currentMonthData.entries[currentMonthData.entries.length - 1];
    
    // Create next day entry logic could be added here, for now, simple clone
    const newEntry: TaEntry = {
      ...lastEntry,
      id: uuidv4(),
      // Optional: Increment date logic
    };
    saveEntry(newEntry);
  };

  const clearCurrentData = () => {
    setCurrentMonthData(null);
  };

  return (
    <AppContext.Provider value={{
      profiles,
      currentProfileId,
      currentMonthData,
      addProfile,
      switchProfile,
      updateProfile,
      createOrGetMonth,
      saveEntry,
      deleteEntry,
      clearCurrentData,
      hasUnsavedChanges,
      setHasUnsavedChanges,
      duplicateLastEntry
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};
