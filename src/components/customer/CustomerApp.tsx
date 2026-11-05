import React, { useState } from 'react';
import { CustomerNavbar } from './CustomerNavbar';
import { HomeScreen } from './HomeScreen';
import { ExploreScreen } from './ExploreScreen';
import { FavouritesScreen } from './FavouritesScreen';
import { OffersScreen } from './OffersScreen';
import { ReelsScreen } from './ReelsScreen';
import { ProfileScreen } from './ProfileScreen';
import { BottomNavigation, CustomerTab } from './BottomNavigation';
import { CarDetailModal } from './CarDetailModal';
import { Car, DealershipSettings, Offer, UserProfile } from '../../types';
import { Language } from '../../locales/i18n';

interface CustomerAppProps {
  cars: Car[];
  settings: DealershipSettings;
  offers: Offer[];
  favourites: string[];
  currentUser: UserProfile | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onToggleFavourite: (carId: string) => void;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onOpenFlutterHub: () => void;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({
  cars,
  settings,
  offers,
  favourites,
  currentUser,
  language,
  onLanguageChange,
  onToggleFavourite,
  onLoginSuccess,
  onLogout,
  onOpenAdmin,
  onOpenFlutterHub,
}) => {
  const [activeTab, setActiveTab] = useState<CustomerTab>('home');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [exploreFilterPreset, setExploreFilterPreset] = useState<{ bodyType?: string; maxPrice?: number; fuel?: string } | undefined>(undefined);
  const [reelsInitialId, setReelsInitialId] = useState<string | undefined>(undefined);
  const [reelsInitialCategory, setReelsInitialCategory] = useState<'all' | 'walkarounds' | 'customers'>('walkarounds');

  const handleNavigateToExplore = (preset?: { bodyType?: string; maxPrice?: number; fuel?: string }) => {
    setExploreFilterPreset(preset);
    setActiveTab('explore');
  };

  const handleOpenReels = (carIdOrReelId?: string, category: 'all' | 'walkarounds' | 'customers' = 'walkarounds') => {
    setReelsInitialId(carIdOrReelId);
    setReelsInitialCategory(category);
    setActiveTab('reels');
  };

  const content = (
    <div className="min-h-screen bg-[#0c0d12] text-slate-100 flex flex-col justify-between">
      <CustomerNavbar
        settings={settings}
        language={language}
        onLanguageChange={onLanguageChange}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(prev => !prev)}
        onOpenAdmin={onOpenAdmin}
        onOpenFlutterHub={onOpenFlutterHub}
        onGoHome={() => {
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4">
        {activeTab === 'home' && (
          <HomeScreen
            cars={cars}
            settings={settings}
            offers={offers}
            language={language}
            favourites={favourites}
            currentUser={currentUser}
            onSelectCar={(c) => setSelectedCar(c)}
            onToggleFavourite={onToggleFavourite}
            onNavigateToExplore={handleNavigateToExplore}
            onOpenReels={handleOpenReels}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreScreen
            cars={cars}
            settings={settings}
            language={language}
            favourites={favourites}
            initialFilters={exploreFilterPreset}
            onSelectCar={(c) => setSelectedCar(c)}
            onToggleFavourite={onToggleFavourite}
          />
        )}

        {activeTab === 'reels' && (
          <ReelsScreen
            cars={cars}
            settings={settings}
            favourites={favourites}
            initialCategory={reelsInitialCategory}
            initialReelId={reelsInitialId}
            onSelectCar={(c) => setSelectedCar(c)}
            onToggleFavourite={onToggleFavourite}
          />
        )}

        {activeTab === 'favourites' && (
          <FavouritesScreen
            cars={cars}
            favouriteIds={favourites}
            settings={settings}
            language={language}
            onSelectCar={(c) => setSelectedCar(c)}
            onRemoveFavourite={onToggleFavourite}
            onNavigateToExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            currentUser={currentUser}
            enquiries={[]} // Will be linked
            settings={settings}
            language={language}
            onLoginSuccess={onLoginSuccess}
            onLogout={onLogout}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        language={language}
        favouritesCount={favourites.length}
      />

      {/* Car Detail Modal */}
      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          settings={settings}
          language={language}
          isFavourite={favourites.includes(selectedCar.id)}
          currentUser={currentUser}
          onToggleFavourite={onToggleFavourite}
          onClose={() => setSelectedCar(null)}
          onSelectCar={(c) => setSelectedCar(c)}
          allCars={cars}
        />
      )}
    </div>
  );

  if (isMobileFrame) {
    return (
      <div className="min-h-screen bg-[#07080b] flex flex-col items-center justify-center p-2 sm:p-6">
        <div className="w-full max-w-sm sm:max-w-md h-[92vh] max-h-[880px] bg-black rounded-[48px] p-3 shadow-2xl border-[10px] border-[#222533] ring-1 ring-white/10 flex flex-col relative overflow-hidden">
          {/* Phone Dynamic Island / Speaker notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] mr-2" />
            <div className="w-10 h-1.5 rounded-full bg-[#1c1c1e]" />
          </div>

          <div className="w-full h-full rounded-[38px] overflow-y-auto no-scrollbar relative flex flex-col">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};
