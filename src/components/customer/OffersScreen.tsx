import React from 'react';
import { Gift, Calendar, CheckCircle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Offer, Car, DealershipSettings } from '../../types';
import { formatINR, formatDate, createWhatsAppLink } from '../../utils/formatters';
import { Language, translations } from '../../locales/i18n';

interface OffersScreenProps {
  offers: Offer[];
  cars: Car[];
  settings: DealershipSettings;
  language: Language;
  onSelectCar: (car: Car) => void;
  onNavigateToExplore: () => void;
}

export const OffersScreen: React.FC<OffersScreenProps> = ({
  offers,
  cars,
  settings,
  language,
  onSelectCar,
  onNavigateToExplore,
}) => {
  const t = translations[language];
  const activeOffers = offers.filter(o => o.status === 'active');

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-400" />
          <span>{t.offers}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Exclusive festive discounts, low finance rates, and complimentary service packages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeOffers.map((offer) => {
          // Find applicable cars
          const applicableCars = offer.applicable_car_ids.length > 0
            ? cars.filter(c => offer.applicable_car_ids.includes(c.id) && c.status === 'published')
            : cars.filter(c => c.status === 'published').slice(0, 3);

          return (
            <div
              key={offer.id}
              className="bg-gradient-to-br from-[#161a29] to-[#111420] border border-amber-500/25 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Active Deal</span>
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Valid till {formatDate(offer.ends_at)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {language === 'mr' || language === 'hi' ? (offer.title_hindi || offer.title) : offer.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {offer.description}
                </p>

                {offer.terms && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300 block">Terms & Conditions:</span>
                    <p>{offer.terms}</p>
                  </div>
                )}
              </div>

              {/* Applicable vehicles preview */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {offer.applicable_car_ids.length > 0 ? 'Eligible Stock Models:' : 'Applicable on All Inventory:'}
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {applicableCars.map((car) => (
                    <button
                      key={car.id}
                      onClick={() => onSelectCar(car)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1e2336] hover:bg-[#282f48] border border-white/10 text-xs text-white flex-shrink-0 flex items-center gap-1.5 transition-all text-left"
                    >
                      <span className="font-bold">{car.make} {car.model}</span>
                      <span className="text-amber-400 font-mono text-[11px]">{formatINR(car.price)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <a
                href={createWhatsAppLink({
                  phone: settings.whatsapp_number,
                  customMessage: `Hello JK Motors! I would like to claim the *${offer.title}* offer. Please share details.`,
                }).url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <span>Claim Offer on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
