import React from 'react';
import { Heart, Trash2, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Car, DealershipSettings } from '../../types';
import { formatINR, formatKm, createWhatsAppLink } from '../../utils/formatters';
import { Language, translations } from '../../locales/i18n';

interface FavouritesScreenProps {
  cars: Car[];
  favouriteIds: string[];
  settings: DealershipSettings;
  language: Language;
  onSelectCar: (car: Car) => void;
  onRemoveFavourite: (carId: string) => void;
  onNavigateToExplore: () => void;
}

export const FavouritesScreen: React.FC<FavouritesScreenProps> = ({
  cars,
  favouriteIds,
  settings,
  language,
  onSelectCar,
  onRemoveFavourite,
  onNavigateToExplore,
}) => {
  const t = translations[language];
  const savedCars = cars.filter(c => favouriteIds.includes(c.id));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>{t.favourites}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cars you saved for quick comparison and test drive booking
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">
          {savedCars.length} Saved
        </span>
      </div>

      {savedCars.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#131622] border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Your favourites list is empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Tap the heart icon on any car in our inventory to save it here for quick access and WhatsApp enquiry.
            </p>
          </div>
          <button
            onClick={onNavigateToExplore}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2"
          >
            <span>{t.exploreCars}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedCars.map((car) => {
            const cover = car.media.find(m => m.is_cover)?.url || car.media[0]?.url;
            return (
              <div
                key={car.id}
                className="group bg-[#131622] border border-white/10 hover:border-amber-400/40 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
              >
                <div
                  onClick={() => onSelectCar(car)}
                  className="relative aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden"
                >
                  <img src={cover} alt={car.model} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavourite(car.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-all"
                    title="Remove from Favourites"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div onClick={() => onSelectCar(car)} className="cursor-pointer">
                    <span className="text-[11px] text-amber-400 font-semibold">{car.model_year} • {car.fuel_type}</span>
                    <h4 className="text-base font-bold text-white">{car.make} {car.model}</h4>
                    <p className="text-xs text-slate-400">{formatKm(car.kilometres)} • Reg: {car.registration_number || 'MH 15'}</p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-lg font-black text-amber-400 font-mono">{formatINR(car.price)}</span>
                    <a
                      href={createWhatsAppLink({
                        phone: settings.whatsapp_number,
                        carMake: car.make,
                        carModel: car.model,
                        carYear: car.model_year,
                        carPrice: car.price,
                        listingId: car.id,
                      }).url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center"
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
      )}
    </div>
  );
};
