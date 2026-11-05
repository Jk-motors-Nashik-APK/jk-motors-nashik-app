import React, { useState, useMemo } from 'react';
import { 
  Search, SlidersHorizontal, Heart, MessageCircle, Play, 
  RotateCcw, ArrowUpDown, LayoutGrid, List, Sparkles, Filter, X 
} from 'lucide-react';
import { Car, DealershipSettings, FilterOptions } from '../../types';
import { formatINR, formatKm, createWhatsAppLink } from '../../utils/formatters';
import { Language, translations } from '../../locales/i18n';

interface ExploreScreenProps {
  cars: Car[];
  settings: DealershipSettings;
  language: Language;
  favourites: string[];
  initialFilters?: { bodyType?: string; maxPrice?: number; fuel?: string };
  onSelectCar: (car: Car) => void;
  onToggleFavourite: (carId: string) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  cars,
  settings,
  language,
  favourites,
  initialFilters,
  onSelectCar,
  onToggleFavourite,
}) => {
  const t = translations[language];

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('all');
  const [selectedBodyType, setSelectedBodyType] = useState(initialFilters?.bodyType || 'all');
  const [selectedFuel, setSelectedFuel] = useState(initialFilters?.fuel || 'all');
  const [selectedTransmission, setSelectedTransmission] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number>(initialFilters?.maxPrice || 1500000);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'km_asc'>('newest');
  const [onlyVideo, setOnlyVideo] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Customer only sees published cars
  const publishedCars = useMemo(() => cars.filter(c => c.status === 'published'), [cars]);

  // Unique makes in stock
  const makes = useMemo(() => {
    const list = Array.from(new Set(publishedCars.map(c => c.make)));
    return ['all', ...list];
  }, [publishedCars]);

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    return publishedCars
      .filter((car) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchMake = car.make.toLowerCase().includes(q);
          const matchModel = car.model.toLowerCase().includes(q);
          const matchVariant = car.variant?.toLowerCase().includes(q);
          const matchReg = car.registration_number?.toLowerCase().includes(q);
          if (!matchMake && !matchModel && !matchVariant && !matchReg) return false;
        }

        // Make
        if (selectedMake !== 'all' && car.make !== selectedMake) return false;

        // Body type
        if (selectedBodyType !== 'all' && car.body_type !== selectedBodyType) return false;

        // Fuel
        if (selectedFuel !== 'all' && car.fuel_type !== selectedFuel) return false;

        // Transmission
        if (selectedTransmission !== 'all' && car.transmission !== selectedTransmission) return false;

        // Price
        if (car.price > maxPrice) return false;

        // Video only
        if (onlyVideo && !car.media.some(m => m.media_type === 'video')) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'km_asc') return a.kilometres - b.kilometres;
        return 0;
      });
  }, [publishedCars, searchQuery, selectedMake, selectedBodyType, selectedFuel, selectedTransmission, maxPrice, onlyVideo, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMake('all');
    setSelectedBodyType('all');
    setSelectedFuel('all');
    setSelectedTransmission('all');
    setMaxPrice(1500000);
    setOnlyVideo(false);
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery !== '' || selectedMake !== 'all' || selectedBodyType !== 'all' || selectedFuel !== 'all' || selectedTransmission !== 'all' || maxPrice < 1500000 || onlyVideo;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Search Bar & Quick Filters Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#131622] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Modal Toggle Button */}
          <button
            onClick={() => setShowFiltersModal(true)}
            className={`p-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
              hasActiveFilters
                ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-[#151926] text-slate-300 border-white/10 hover:text-white hover:bg-[#1c2133]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-black ml-0.5" />
            )}
          </button>
        </div>

        {/* Quick Filter Horizontal Scroll Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {/* Video Walkaround filter chip */}
          <button
            onClick={() => setOnlyVideo(prev => !prev)}
            className={`px-3 py-1.5 rounded-full border flex-shrink-0 flex items-center gap-1.5 font-semibold transition-all ${
              onlyVideo
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-[#151824] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Play className={`w-3 h-3 ${onlyVideo ? 'fill-rose-300' : ''}`} />
            <span>Video Walkarounds</span>
          </button>

          {/* Makes */}
          {makes.map((mk) => (
            <button
              key={mk}
              onClick={() => setSelectedMake(mk)}
              className={`px-3 py-1.5 rounded-full border flex-shrink-0 font-medium transition-all ${
                selectedMake === mk
                  ? 'bg-amber-500 text-black border-amber-400 font-bold'
                  : 'bg-[#151824] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {mk === 'all' ? 'All Brands' : mk}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header: Count & Sort */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <span className="font-bold text-white">{filteredCars.length}</span> verified cars
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="ml-2 text-amber-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="flex items-center bg-[#151824] border border-white/10 rounded-lg px-2 py-1 text-slate-300">
            <ArrowUpDown className="w-3 h-3 text-slate-400 mr-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-[#12141c]">Recently Added</option>
              <option value="price_asc" className="bg-[#12141c]">Price: Low to High</option>
              <option value="price_desc" className="bg-[#12141c]">Price: High to Low</option>
              <option value="km_asc" className="bg-[#12141c]">Lowest Kilometres</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center bg-[#151824] border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Car Cards Grid / List */}
      {filteredCars.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#131622] border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No cars match your filters</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your price range, fuel type, or keyword search to view available stock at JK Motors.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-all inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCars.map((car) => {
            const coverMedia = car.media.find(m => m.is_cover) || car.media[0];
            const isFav = favourites.includes(car.id);
            const hasVideo = car.media.some(m => m.media_type === 'video');

            return (
              <div
                key={car.id}
                className="group bg-[#131622] border border-white/10 hover:border-amber-400/40 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
              >
                {/* Media Container */}
                <div
                  onClick={() => onSelectCar(car)}
                  className="relative aspect-[16/10] w-full bg-slate-900 cursor-pointer overflow-hidden"
                >
                  {coverMedia?.media_type === 'video' ? (
                    <div className="w-full h-full relative">
                      <video src={coverMedia.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="p-3 rounded-full bg-amber-500/90 text-black shadow-lg">
                          <Play className="w-4 h-4 fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={coverMedia?.url}
                      alt={car.make + ' ' + car.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {hasVideo && (
                      <span className="bg-rose-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded backdrop-blur-md flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>VIDEO</span>
                      </span>
                    )}
                    <span className="bg-black/70 text-slate-300 font-semibold text-[10px] px-2 py-0.5 rounded backdrop-blur-md">
                      {car.model_year}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavourite(car.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-all ${
                        isFav
                          ? 'bg-rose-500/80 text-white'
                          : 'bg-black/60 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {car.registration_number && (
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/75 text-slate-300 px-2 py-0.5 rounded">
                      {car.registration_number}
                    </span>
                  )}
                </div>

                {/* Details Container */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div onClick={() => onSelectCar(car)} className="cursor-pointer space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{car.ownership_count === 1 ? '1st Owner' : `${car.ownership_count} Owners`} • {car.body_type || 'Hatchback'}</span>
                      <span className="text-emerald-400 font-medium">{car.fuel_type}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {car.make} {car.model}
                    </h3>

                    <p className="text-xs text-slate-400 truncate">
                      {car.variant} • {formatKm(car.kilometres)} • {car.transmission}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Price</span>
                      <span className="text-lg font-black text-amber-400 font-mono">
                        {formatINR(car.price)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Loan Assistance</span>
                      <span className="text-xs font-bold text-emerald-400">
                        Available
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectCar(car)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#1d2130] hover:bg-[#252b3d] text-white font-bold text-xs border border-white/10 transition-all text-center"
                    >
                      {t.viewDetails}
                    </button>

                    <a
                      href={createWhatsAppLink({
                        phone: settings.whatsapp_number,
                        carMake: car.make,
                        carModel: car.model,
                        carYear: car.model_year,
                        carPrice: car.price,
                        listingId: car.id,
                        registrationNumber: car.registration_number,
                      }).url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center justify-center"
                      title="Enquire on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredCars.map((car) => {
            const coverMedia = car.media.find(m => m.is_cover) || car.media[0];
            const isFav = favourites.includes(car.id);

            return (
              <div
                key={car.id}
                onClick={() => onSelectCar(car)}
                className="group bg-[#131622] border border-white/10 hover:border-amber-400/40 rounded-xl p-3 flex flex-col sm:flex-row gap-4 items-center cursor-pointer transition-all"
              >
                <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                  {coverMedia?.media_type === 'video' ? (
                    <div className="w-full h-full relative">
                      <video src={coverMedia.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                  ) : (
                    <img src={coverMedia?.url} alt={car.model} className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="flex-1 space-y-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-400 font-semibold">{car.model_year} • {car.fuel_type} • {car.transmission}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavourite(car.id);
                      }}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                  <h4 className="font-bold text-base text-white">{car.make} {car.model}</h4>
                  <p className="text-xs text-slate-400">{car.variant} • {formatKm(car.kilometres)} • Reg: {car.registration_number || 'MH 15'}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <span className="text-lg font-black text-amber-400 font-mono">{formatINR(car.price)}</span>
                  <button className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400">
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Advanced Filters Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#121520] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-base">Filter Pre-Owned Stock</h3>
              </div>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Max Budget</span>
                <span className="font-bold text-amber-400 font-mono">{formatINR(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="1500000"
                step="25000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Fuel Type */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 block">Fuel Type</label>
              <div className="grid grid-cols-4 gap-2">
                {['all', 'Petrol', 'Diesel', 'CNG'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFuel(f)}
                    className={`py-1.5 text-xs rounded-lg border font-medium ${
                      selectedFuel === f
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-[#181c2b] border-white/10 text-slate-300'
                    }`}
                  >
                    {f === 'all' ? 'All' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Body Type */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 block">Body Type</label>
              <div className="grid grid-cols-4 gap-2">
                {['all', 'Hatchback', 'Sedan', 'SUV'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBodyType(b)}
                    className={`py-1.5 text-xs rounded-lg border font-medium ${
                      selectedBodyType === b
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-[#181c2b] border-white/10 text-slate-300'
                    }`}
                  >
                    {b === 'all' ? 'All' : b}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 block">Transmission</label>
              <div className="grid grid-cols-3 gap-2">
                {['all', 'Manual', 'Automatic'].map((tVal) => (
                  <button
                    key={tVal}
                    onClick={() => setSelectedTransmission(tVal)}
                    className={`py-1.5 text-xs rounded-lg border font-medium ${
                      selectedTransmission === tVal
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-[#181c2b] border-white/10 text-slate-300'
                    }`}
                  >
                    {tVal === 'all' ? 'All' : tVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setShowFiltersModal(false)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider"
              >
                Apply Filters ({filteredCars.length} Cars)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
