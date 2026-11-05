import React from 'react';
import { Home, Compass, Video, Heart, User } from 'lucide-react';
import { Language, translations } from '../../locales/i18n';

export type CustomerTab = 'home' | 'explore' | 'reels' | 'favourites' | 'profile';

interface BottomNavigationProps {
  activeTab: CustomerTab;
  onTabChange: (tab: CustomerTab) => void;
  language: Language;
  favouritesCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  language,
  favouritesCount,
}) => {
  const t = translations[language];

  const tabs: { id: CustomerTab; label: string; icon: React.ReactNode; isReel?: boolean }[] = [
    { id: 'home', label: t.home, icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: t.explore, icon: <Compass className="w-5 h-5" /> },
    { 
      id: 'reels', 
      label: 'Reels', 
      icon: <Video className="w-5 h-5" />, 
      isReel: true 
    },
    { 
      id: 'favourites', 
      label: t.favourites, 
      icon: (
        <div className="relative">
          <Heart className="w-5 h-5" />
          {favouritesCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {favouritesCount}
            </span>
          )}
        </div>
      ) 
    },
    { id: 'profile', label: t.profile, icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d12]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (tab.isReel) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative -top-2 flex flex-col items-center group cursor-pointer"
              >
                <div className={`p-2.5 rounded-full transition-all shadow-lg ${
                  isActive
                    ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-400 text-white scale-110 shadow-rose-500/30'
                    : 'bg-gradient-to-tr from-amber-600/80 to-rose-600/80 text-white group-hover:scale-105'
                }`}>
                  <Video className="w-5 h-5 fill-white/20" />
                </div>
                <span className={`text-[10px] font-bold mt-0.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-1 flex flex-col items-center transition-all cursor-pointer ${
                isActive ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="p-1">{tab.icon}</div>
              <span className="text-[10px] truncate max-w-[60px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
