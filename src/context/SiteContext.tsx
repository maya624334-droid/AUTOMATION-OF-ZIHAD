import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { SiteSettings, UserBookmark } from '../types';
import { initialSiteSettings } from '../data/defaultData';
import { useAuth } from './AuthContext';

interface SiteContextType {
  settings: SiteSettings;
  loadingSettings: boolean;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  bookmarks: UserBookmark[];
  toggleBookmark: (project: { id: string; title: string; category?: string; thumbnailUrl?: string }) => Promise<void>;
  isBookmarked: (projectId: string) => boolean;
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(true);
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>([]);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  // Load site settings from Firestore
  useEffect(() => {
    async function loadSettings() {
      try {
        const docRef = doc(db, 'siteSettings', 'main');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setSettings({ ...initialSiteSettings, ...(snap.data() as SiteSettings) });
        } else {
          setSettings(initialSiteSettings);
        }
      } catch (err) {
        console.warn('Could not load siteSettings from Firestore, using defaults:', err);
        setSettings(initialSiteSettings);
      } finally {
        setLoadingSettings(false);
      }
    }
    loadSettings();
  }, []);

  // Load user bookmarks if signed in
  useEffect(() => {
    if (!currentUser) {
      setBookmarks([]);
      return;
    }

    async function loadBookmarks() {
      try {
        const q = query(collection(db, 'userBookmarks'), where('userId', '==', currentUser!.uid));
        const snap = await getDocs(q);
        const list: UserBookmark[] = [];
        snap.forEach((d) => list.push(d.data() as UserBookmark));
        setBookmarks(list);
      } catch (e) {
        console.warn('Could not load bookmarks:', e);
      }
    }
    loadBookmarks();
  }, [currentUser]);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = {
      ...settings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'siteSettings', 'main'), updated);
      setSettings(updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings/main');
    }
  };

  const isBookmarked = (projectId: string) => {
    return bookmarks.some((b) => b.projectId === projectId);
  };

  const toggleBookmark = async (project: { id: string; title: string; category?: string; thumbnailUrl?: string }) => {
    if (!currentUser) return;
    const bookmarkId = `${currentUser.uid}_${project.id}`;
    const docRef = doc(db, 'userBookmarks', bookmarkId);

    if (isBookmarked(project.id)) {
      try {
        await deleteDoc(docRef);
        setBookmarks((prev) => prev.filter((b) => b.projectId !== project.id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `userBookmarks/${bookmarkId}`);
      }
    } else {
      const newBookmark: UserBookmark = {
        id: bookmarkId,
        userId: currentUser.uid,
        projectId: project.id,
        projectTitle: project.title,
        projectCategory: project.category || 'General',
        thumbnailUrl: project.thumbnailUrl || '',
        createdAt: new Date().toISOString(),
      };
      try {
        await setDoc(docRef, newBookmark);
        setBookmarks((prev) => [...prev, newBookmark]);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `userBookmarks/${bookmarkId}`);
      }
    }
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        loadingSettings,
        updateSettings,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        language,
        setLanguage,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
