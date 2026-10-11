import React, { useState, useEffect } from 'react';
import { SchoolWebsiteData } from './types';
import { INITIAL_DATA } from './data';
import { PublicSiteView } from './components/PublicSiteView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';

const STORAGE_KEY = 'sdn_sucopangepok_04_data_v2';
const ADMIN_AUTH_KEY = 'sdn_sucopangepok_04_admin_session';

export default function App() {
  const [data, setData] = useState<SchoolWebsiteData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure new features are merged in if old data exists
        return {
          ...INITIAL_DATA,
          ...parsed,
          profile: {
            ...INITIAL_DATA.profile,
            ...(parsed.profile || {}),
            schoolMemories: parsed.profile?.schoolMemories || INITIAL_DATA.profile.schoolMemories,
          },
          typography: {
            ...INITIAL_DATA.typography,
            ...(parsed.typography || {}),
          },
        };
      }
    } catch {
      // Fallback
    }
    return INITIAL_DATA;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  const [currentRoute, setCurrentRoute] = useState<'public' | 'admin' | 'login'>('public');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme_mode') as 'light' | 'dark') || data.theme.defaultTheme || 'light';
  });

  // Sync with Hash router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        if (sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true') {
          setCurrentRoute('admin');
        } else {
          setCurrentRoute('login');
        }
      } else if (hash === '#preview-mobile') {
        setPreviewDevice('mobile');
        setCurrentRoute('public');
      } else if (hash === '#preview-desktop') {
        setPreviewDevice('desktop');
        setCurrentRoute('public');
      } else {
        if (currentRoute !== 'admin') {
          setCurrentRoute('public');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentRoute]);

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme_mode', themeMode);
  }, [themeMode]);

  // Persist data updates
  const handleUpdateData = (newData: SchoolWebsiteData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {
      console.warn("Storage quota exceeded or private mode.");
    }
  };

  const handleAdminLoginSuccess = () => {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    setIsAdminLoggedIn(true);
    setCurrentRoute('admin');
    window.location.hash = '#admin';
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAdminLoggedIn(false);
    setCurrentRoute('public');
    window.location.hash = '#beranda';
  };

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handlePreview = (device: 'desktop' | 'mobile') => {
    setPreviewDevice(device);
    setCurrentRoute('public');
    window.location.hash = device === 'mobile' ? '#preview-mobile' : '#preview-desktop';
  };

  // Render Admin Login
  if (currentRoute === 'login') {
    return (
      <AdminLogin
        school={data.school}
        auth={data.auth}
        onSuccess={handleAdminLoginSuccess}
        onBackToPublic={() => {
          setCurrentRoute('public');
          window.location.hash = '#beranda';
        }}
      />
    );
  }

  // Render Admin Dashboard
  if (currentRoute === 'admin' && isAdminLoggedIn) {
    return (
      <AdminDashboard
        data={data}
        onUpdateData={handleUpdateData}
        onPreview={handlePreview}
        onLogout={handleAdminLogout}
      />
    );
  }

  // If in Preview Mobile mode (Poin 6)
  if (window.location.hash === '#preview-mobile' || previewDevice === 'mobile') {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-start py-6 px-4">
        {/* Mobile Mockup Device Frame */}
        <div className="w-full max-w-[420px] rounded-[48px] bg-black p-3.5 shadow-2xl border-4 border-stone-700/80 ring-8 ring-stone-800 relative">
          {/* Speaker & camera notch */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-stone-900 rounded-full z-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-stone-800 mr-2" />
            <div className="w-12 h-1.5 rounded-full bg-stone-800" />
          </div>

          <div className="rounded-[38px] overflow-hidden bg-[#fbf7ee] dark:bg-[#0e1611] max-h-[85vh] overflow-y-auto scrollbar-thin">
            <PublicSiteView
              data={data}
              isAdmin={isAdminLoggedIn}
              isPreviewMode={true}
              previewDevice="mobile"
              onEnterAdmin={() => {
                setPreviewDevice('desktop');
                setCurrentRoute('admin');
                window.location.hash = '#admin';
              }}
              onExitPreview={() => {
                setPreviewDevice('desktop');
                setCurrentRoute('admin');
                window.location.hash = '#admin';
              }}
              onToggleTheme={handleToggleTheme}
              currentTheme={themeMode}
            />
          </div>
        </div>
      </div>
    );
  }

  // Render Standard Public View
  return (
    <PublicSiteView
      data={data}
      isAdmin={isAdminLoggedIn}
      isPreviewMode={window.location.hash === '#preview-desktop'}
      previewDevice="desktop"
      onEnterAdmin={() => {
        if (isAdminLoggedIn) {
          setCurrentRoute('admin');
          window.location.hash = '#admin';
        } else {
          setCurrentRoute('login');
          window.location.hash = '#admin';
        }
      }}
      onExitPreview={() => {
        setCurrentRoute('admin');
        window.location.hash = '#admin';
      }}
      onToggleTheme={handleToggleTheme}
      currentTheme={themeMode}
    />
  );
}
