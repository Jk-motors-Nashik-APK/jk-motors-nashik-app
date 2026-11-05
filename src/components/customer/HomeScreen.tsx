import React, { useState } from 'react';
import { 
  Play, MessageCircle, ShieldCheck, Heart, Sparkles, 
  ChevronRight, Instagram, Phone, MapPin, Award, 
  FileCheck2, BadgePercent, ArrowRight, Video, Check, X, PartyPopper, CheckCircle2
} from 'lucide-react';
import { Car, DealershipSettings, Offer, UserProfile } from '../../types';
import { formatINR, formatKm, createWhatsAppLink, formatMediaUrl } from '../../utils/formatters';
import { Language, translations } from '../../locales/i18n';
import { JKMotorsLogo } from '../common/JKMotorsLogo';

interface HomeScreenProps {
  cars: Car[];
  settings: DealershipSettings;
  offers: Offer[];
  language: Language;
  favourites: string[];
  currentUser: UserProfile | null;
  onSelectCar: (car: Car) => void;
  onToggleFavourite: (carId: string) => void;
  onNavigateToExplore: (filterPreset?: { bodyType?: string; maxPrice?: number; fuel?: string }) => void;
  onOpenReels: (carIdOrReelId?: string, category?: 'all' | 'walkarounds' | 'customers') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  cars,
  settings,
  offers,
  language,
  favourites,
  onSelectCar,
  onToggleFavourite,
  onNavigateToExplore,
  onOpenReels,
}) => {
  const t = translations[language];
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [reelsTab, setReelsTab] = useState<'walkarounds' | 'celebrations'>('walkarounds');
  const [selectedCelebration, setSelectedCelebration] = useState<{
    id: string;
    title: string;
    image: string;
    badge: string;
    date: string;
    reg?: string;
    customer?: string;
    review?: string;
  } | null>(null);

  // Filter published available cars
  const availableCars = cars.filter(c => c.status === 'published');
  // Cars with walkaround videos
  const videoCars = availableCars.filter(c => c.media.some(m => m.media_type === 'video'));
  // Featured cars
  const featuredCars = availableCars.slice(0, 6);

  // Delivery photos for Hall of Fame (All genuine JK Motors customer deliveries)
  const deliveryCelebrations = [
    {
      id: 'del-ciaz-silver',
      title: 'Maruti Ciaz Luxury Handover',
      image: '/assets/aistudio/IMG-20261104-WA0006.jpg',
      badge: 'Ciaz Luxury Sedan',
      reg: 'MH 15 FF 7705',
      date: 'Patil Family',
      customer: 'Patil Family & Friends',
      review: '“Naresh Joshi ji made the entire deal transparent. Handover ceremony with big key was memorable!”'
    },
    {
      id: 'del-brezza-dussehra',
      title: 'Vitara Brezza ZDi+ Dussehra Handover',
      image: '/assets/aistudio/IMG-20261104-WA0002_9ea5637b.jpg',
      badge: 'Brezza ZDi+ Delivered',
      reg: 'MH 15 EX 8377',
      date: 'Dussehra Day',
      customer: 'Youth Owner & Group',
      review: '“Bought our dream SUV on Dussehra! Complete non-accidental certificate given by JK Motors.”'
    },
    {
      id: 'del-ciaz-garland',
      title: 'Maruti Ciaz Special Garland Handover',
      image: '/assets/aistudio/IMG-20261104-WA0008.jpg',
      badge: 'Vedic Puja Handover',
      reg: 'MH 04 AR 2105',
      date: 'Garland Handover',
      customer: 'Deshmukh Family',
      review: '“Delivered with fresh red rose garlands, coconut puja, and instant RC paperwork. 10/10 service!”'
    },
    {
      id: 'del-tiago-puja',
      title: 'Tata Tiago Revotron Handover',
      image: '/assets/aistudio/IMG-20261104-WA0009.jpg',
      badge: 'Tata Tiago Top Model',
      reg: 'MH 15 HG 1727',
      date: 'Delivered with Puja',
      customer: 'Kulkarni Family',
      review: '“Genuine odometer reading and clean service records. SBI loan approved same day with low EMI.”'
    },
    {
      id: 'del-kwid-firstcar',
      title: 'Renault Kwid First Car Handover',
      image: '/assets/aistudio/IMG-20261104-WA0010.jpg',
      badge: 'First Car Milestone',
      reg: 'MH 05 CM 9527',
      date: 'Young Professional',
      customer: 'Shinde Family',
      review: '“First car in our family! Very affordable pricing and genuine support from Naresh sir.”'
    },
    {
      id: 'del-celerio-auto',
      title: 'Maruti Celerio Automatic Handover',
      image: '/assets/aistudio/IMG-20261104-WA0012.jpg',
      badge: 'Automatic City Hatchback',
      reg: 'MH 04 GM 9757',
      date: 'Happy Owner',
      customer: 'More Family',
      review: '“Super smooth automatic car for daily commute. Delivered spotless like a brand new vehicle!”'
    },
    {
      id: 'del-duster-suv',
      title: 'Renault Duster RxZ SUV Handover',
      image: '/assets/aistudio/IMG-20261104-WA0003_b7ac20e2.jpg',
      badge: 'Duster SUV Delivered',
      reg: 'MH 15 FF 9959',
      date: 'Highway Cruiser',
      customer: 'Jadhav Family',
      review: '“High ground clearance and pristine engine condition. Drove straight on the highway!”'
    },
    {
      id: 'del-wagonr-family',
      title: 'Maruti WagonR Tall-Boy Handover',
      image: '/assets/aistudio/IMG-20261104-WA0005_d36d0584.jpg',
      badge: 'WagonR Delivered',
      reg: 'MH 04 ED 2105',
      date: 'Family Milestone',
      customer: 'Pawar Family',
      review: '“Best budget car buying experience. Valid passing for 5 years and genuine condition.”'
    },
    {
      id: 'del-eeco-workhorse',
      title: 'Maruti Eeco 7-Seater Workhorse',
      image: '/assets/aistudio/IMG-20261104-WA0004_a28823c9.jpg',
      badge: 'Eeco Commercial',
      reg: 'MH 15 Commercial',
      date: 'Business Owner',
      customer: 'Local Enterprise',
      review: '“Helped our business expansion with quick commercial finance and doorstep RC transfer.”'
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Banner & Promotional Showcase */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#181c2b] via-[#10131d] to-[#0c0d12] border border-amber-500/20 p-5 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-4">
            <JKMotorsLogo size="lg" variant="gold" glow={true} logoUrl={settings.logo_url} />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'mr' || language === 'hi' ? 'सर्व गाड्यांवर १००% फायनान्स उपलब्ध' : '100% On-Spot Loan Approval & RTO RC Transfer'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {language === 'mr' ? 'जे. के. मोटर्स, नाशिक' : language === 'hi' ? 'जे. के. मोटर्स, नाशिक' : 'JK MOTORS NASHIK'}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 font-brand text-xl sm:text-3xl md:text-4xl mt-1">
                  {language === 'mr' ? 'विश्वासू प्री-ओन्ड फोर व्हिलर' : 'Certified Pre-Owned Cars'}
                </span>
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            {language === 'mr' 
              ? 'सर्व प्रकारचे फोर व्हिलर गाड्यांची खरेदी व विक्रीचे विश्वास पात्र एकमेव ठिकाण. तपासा व टेस्ट ड्राइव्ह करा आजच.'
              : 'Browse genuine certified single-owner pre-owned vehicles with video walkarounds, low-interest finance, and verified clean RC documents.'}
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToExplore()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>{t.exploreCars}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenReels(undefined, 'walkarounds')}
              className="px-4 py-3 rounded-xl bg-[#1c202e] hover:bg-[#252b3d] text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition-all cursor-pointer"
            >
              <Video className="w-4 h-4 text-amber-400" />
              <span>Watch Video Reels ({videoCars.length})</span>
            </button>

            <a
              href={`https://wa.me/91${settings.whatsapp_number}?text=${encodeURIComponent('Hello JK Motors! I am interested in viewing your available cars.')}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Current Active Promotional Offer Highlight */}
        {offers.length > 0 && (
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131622]/60 p-4 rounded-xl border border-white/5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0 mt-0.5">
                <BadgePercent className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Active Deal</span>
                <p className="text-sm font-bold text-white">
                  {offers[activeOfferIndex]?.title}
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  {offers[activeOfferIndex]?.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToExplore()}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto flex-shrink-0"
            >
              <span>View Eligible Cars</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* Quick Search & Budget Shortcuts */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>Find By Category</span>
          </h2>
          <button
            onClick={() => onNavigateToExplore()}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            View All ({availableCars.length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Under 4 Lakh */}
          <div
            onClick={() => onNavigateToExplore({ maxPrice: 400000 })}
            className="p-3.5 rounded-xl bg-[#141724] hover:bg-[#1a1f30] border border-white/5 hover:border-amber-400/30 cursor-pointer transition-all flex flex-col justify-between"
          >
            <span className="text-[11px] text-slate-400 font-medium">Budget Cars</span>
            <span className="text-sm font-extrabold text-amber-400 mt-1">Under ₹4 Lakh</span>
            <span className="text-[10px] text-slate-400 mt-2">Celerio, Eeco, WagonR</span>
          </div>

          {/* Under 8 Lakh */}
          <div
            onClick={() => onNavigateToExplore({ maxPrice: 800000 })}
            className="p-3.5 rounded-xl bg-[#141724] hover:bg-[#1a1f30] border border-white/5 hover:border-amber-400/30 cursor-pointer transition-all flex flex-col justify-between"
          >
            <span className="text-[11px] text-slate-400 font-medium">Mid-Segment</span>
            <span className="text-sm font-extrabold text-white mt-1">₹4L – ₹8 Lakh</span>
            <span className="text-[10px] text-slate-400 mt-2">Duster, Brezza, Tiago</span>
          </div>

          {/* SUVs */}
          <div
            onClick={() => onNavigateToExplore({ bodyType: 'SUV' })}
            className="p-3.5 rounded-xl bg-[#141724] hover:bg-[#1a1f30] border border-white/5 hover:border-amber-400/30 cursor-pointer transition-all flex flex-col justify-between"
          >
            <span className="text-[11px] text-slate-400 font-medium">High Ground Clearance</span>
            <span className="text-sm font-extrabold text-emerald-400 mt-1">SUVs & Compact</span>
            <span className="text-[10px] text-slate-400 mt-2">Seltos, Duster, Creta</span>
          </div>

          {/* Sedans & Luxury */}
          <div
            onClick={() => onNavigateToExplore({ bodyType: 'Sedan' })}
            className="p-3.5 rounded-xl bg-[#141724] hover:bg-[#1a1f30] border border-white/5 hover:border-amber-400/30 cursor-pointer transition-all flex flex-col justify-between"
          >
            <span className="text-[11px] text-slate-400 font-medium">Comfort & Style</span>
            <span className="text-sm font-extrabold text-indigo-400 mt-1">Sedans</span>
            <span className="text-[10px] text-slate-400 mt-2">City, Ciaz, Verna</span>
          </div>
        </div>
      </section>

      {/* Video Reels & Customer Stories Showcase */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-base sm:text-lg font-bold text-white">Video Reels & Customer Stories</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Watch condition walkarounds with Naresh Joshi and real customer delivery celebrations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-[#141724] rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setReelsTab('walkarounds')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  reelsTab === 'walkarounds'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Videos ({videoCars.length})
              </button>
              <button
                onClick={() => setReelsTab('celebrations')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  reelsTab === 'celebrations'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Deliveries ({deliveryCelebrations.length})
              </button>
            </div>

            <button
              onClick={() => onOpenReels(undefined, reelsTab === 'celebrations' ? 'customers' : 'walkarounds')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer ml-1"
            >
              <span>Play All Reels</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Video Reel Cards */}
        {reelsTab === 'walkarounds' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {videoCars.map((vCar) => {
              const vid = vCar.media.find(m => m.media_type === 'video');
              if (!vid) return null;

              return (
                <div
                  key={vCar.id}
                  onClick={() => onOpenReels(vCar.id, 'walkarounds')}
                  className="group relative aspect-[9/13] sm:aspect-[9/14] rounded-2xl overflow-hidden bg-black border border-white/10 hover:border-amber-400/50 shadow-xl cursor-pointer transition-all flex flex-col justify-between p-4"
                >
                  {/* Background Video loop preview with robust autoplay */}
                  <video
                    src={formatMediaUrl(vid.url)}
                    autoPlay
                    muted
                    playsInline
                    loop
                    preload="auto"
                    ref={(el) => {
                      if (el) {
                        el.defaultMuted = true;
                        el.muted = true;
                        el.play().catch(() => {});
                      }
                    }}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-black/40 pointer-events-none" />

                  {/* Top Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-md">
                      <Play className="w-3 h-3 fill-amber-300" />
                      <span>Watch Reel</span>
                    </span>
                    <span className="text-[11px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                      {vCar.model_year}
                    </span>
                  </div>

                  {/* Bottom Details */}
                  <div className="relative z-10 space-y-2">
                    <div>
                      <p className="text-base font-extrabold text-white drop-shadow">
                        {vCar.make} {vCar.model}
                      </p>
                      <p className="text-xs text-slate-300 truncate drop-shadow">
                        {vCar.variant} • {formatKm(vCar.kilometres)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/20">
                      <span className="text-lg font-black text-amber-400 font-mono drop-shadow">
                        {formatINR(vCar.price)}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 bg-black/70 px-2 py-0.5 rounded">
                        Loan Avail.
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Happy Customer Story Reels Horizontal Row */}
        {reelsTab === 'celebrations' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {deliveryCelebrations.slice(0, 3).map((cust) => (
              <div
                key={cust.id}
                onClick={() => onOpenReels(cust.id, 'customers')}
                className="group relative aspect-[9/13] sm:aspect-[9/14] rounded-2xl overflow-hidden bg-black border border-white/10 hover:border-amber-400/50 shadow-xl cursor-pointer transition-all flex flex-col justify-between p-4"
              >
                <img
                  src={formatMediaUrl(cust.image)}
                  alt={cust.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-black/25 to-black/65 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                    <Play className="w-3 h-3 fill-amber-300" />
                    <span>Watch Story</span>
                  </span>
                  {cust.reg && (
                    <span className="text-[11px] font-mono font-bold text-white bg-black/70 px-2 py-0.5 rounded backdrop-blur-md">
                      {cust.reg}
                    </span>
                  )}
                </div>

                <div className="relative z-10 space-y-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                      {cust.badge}
                    </span>
                    <p className="text-base font-extrabold text-white drop-shadow leading-tight">
                      {cust.title}
                    </p>
                    <p className="text-xs text-slate-200 line-clamp-2 drop-shadow mt-1">
                      {cust.review}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/20">
                    <span className="text-xs font-bold text-amber-300">
                      Ceremonial Key Handover
                    </span>
                    <span className="text-[10px] text-slate-300">
                      {cust.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Verified Cars Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>{t.featuredCars}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Mechanically inspected, non-accidental guarantee with instant paperwork
            </p>
          </div>

          <button
            onClick={() => onNavigateToExplore()}
            className="text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            {t.exploreCars} ({availableCars.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCars.map((car) => {
            const coverMedia = car.media.find(m => m.is_cover) || car.media[0];
            const isFav = favourites.includes(car.id);

            return (
              <div
                key={car.id}
                className="group bg-[#131622] border border-white/10 hover:border-amber-400/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-amber-500/10 transition-all flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div
                  onClick={() => onSelectCar(car)}
                  className="relative aspect-[16/10] w-full bg-slate-900 cursor-pointer overflow-hidden"
                >
                  {coverMedia?.media_type === 'video' ? (
                    <div className="w-full h-full relative">
                      <video src={coverMedia.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="p-3 rounded-full bg-amber-500/90 text-black shadow-lg">
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        VIDEO WALKAROUND
                      </span>
                    </div>
                  ) : (
                    <img
                      src={coverMedia?.url}
                      alt={car.make + ' ' + car.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  )}

                  {/* Badges on card */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavourite(car.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-all ${
                        isFav
                          ? 'bg-rose-500/80 text-white'
                          : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {car.registration_number && (
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 text-slate-300 px-2 py-0.5 rounded backdrop-blur-sm">
                      {car.registration_number}
                    </span>
                  )}
                </div>

                {/* Car Details Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div onClick={() => onSelectCar(car)} className="cursor-pointer space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{car.model_year} • {car.ownership_count === 1 ? '1st Owner' : `${car.ownership_count} Owners`}</span>
                      <span className="text-emerald-400 font-medium">{car.fuel_type}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {car.make} {car.model}
                    </h3>

                    <p className="text-xs text-slate-400 truncate">
                      {car.variant} • {formatKm(car.kilometres)}
                    </p>
                  </div>

                  {/* Price & EMI */}
                  <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block text-[10px]">Price</span>
                      <span className="text-lg font-black text-amber-400 font-mono">
                        {formatINR(car.price)}
                      </span>
                    </div>

                    {car.estimated_emi && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Est. EMI</span>
                        <span className="text-xs font-bold text-slate-300">
                          ~{formatINR(car.estimated_emi)}/mo
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
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
      </section>

      {/* Customer Delivery Celebrations / Hall of Fame */}
      <section className="rounded-2xl bg-[#111420] border border-white/10 p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎉</span>
              <h2 className="text-base sm:text-lg font-bold text-white">{t.happyCustomers}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real deliveries, big ceremonial key handovers, and smiles at JK Motors Nashik
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
              500+ Cars Delivered
            </span>
          </div>
        </div>

        {/* Delivery Photo Gallery Grid (All 9 Real JK Motors Deliveries) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {deliveryCelebrations.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedCelebration(item)}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-amber-400/50 shadow-lg cursor-pointer transition-all flex flex-col justify-end"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3 pointer-events-none" />

              {/* Top Tag */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-bold text-amber-300 border border-amber-500/30">
                  {item.date}
                </span>
                {item.reg && (
                  <span className="px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-slate-300">
                    {item.reg}
                  </span>
                )}
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 space-y-1 p-2.5">
                <span className="text-[10px] font-black uppercase text-amber-400 block leading-tight">
                  {item.badge}
                </span>
                <p className="text-xs font-bold text-white truncate drop-shadow">
                  {item.title}
                </p>
                <p className="text-[10px] text-slate-300 truncate">
                  {item.customer}
                </p>
                <div className="pt-1 flex items-center gap-1 text-[10px] font-semibold text-amber-300/90 group-hover:text-amber-300">
                  <Play className="w-2.5 h-2.5 fill-amber-300" />
                  <span>View Story & Review</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Celebration snippet notice */}
        <div className="bg-[#171b29] p-4 rounded-xl border border-white/5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Aarti, Puja & Big Key Ceremony on Every Handover</span>
              <span className="text-slate-400">We celebrate each pre-owned car delivery with full family respect & blessings in Nashik!</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenReels(undefined, 'customers')}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-amber-300" />
              <span>Watch Reels</span>
            </button>

            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 text-xs font-semibold"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Follow @jkmotors</span>
            </a>
          </div>
        </div>
      </section>

      {/* Selected Customer Delivery Story Modal */}
      {selectedCelebration && (
        <div
          onClick={() => setSelectedCelebration(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#121624] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl space-y-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCelebration(null)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Delivery Photo */}
            <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
              <img
                src={selectedCelebration.image}
                alt={selectedCelebration.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121624] via-transparent to-black/30" />
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                  <Award className="w-3.5 h-3.5" />
                  <span>{selectedCelebration.badge}</span>
                </span>

                {selectedCelebration.reg && (
                  <span className="px-2.5 py-1 rounded-md bg-black/80 border border-white/20 text-xs font-mono font-bold text-white">
                    {selectedCelebration.reg}
                  </span>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 pt-0 space-y-4">
              <div>
                <h3 className="text-xl font-black text-white">
                  {selectedCelebration.title}
                </h3>
                <p className="text-xs text-amber-300 font-semibold mt-0.5">
                  Handover to {selectedCelebration.customer} • {selectedCelebration.date}
                </p>
              </div>

              {selectedCelebration.review && (
                <div className="p-3.5 rounded-2xl bg-[#181d2e] border border-white/10">
                  <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                    {selectedCelebration.review}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Customer Review at JK Motors Nashik</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedCelebration(null);
                    onOpenReels();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Watch in Full Reels</span>
                </button>

                <a
                  href={`https://wa.me/91${settings.whatsapp_number}?text=${encodeURIComponent(`Hello Naresh Joshi! I saw the customer delivery of *${selectedCelebration.title}* (${selectedCelebration.reg || 'JK Motors'}). Do you have similar certified cars available in stock?`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose JK Motors - Trust Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#141724] border border-white/5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
            <BadgePercent className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">100% Loan Assistance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tie-ups with SBI, HDFC, ICICI, Mahindra Finance & more. Quick sanction with minimal paperwork.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#141724] border border-white/5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Guaranteed Clean Documents</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            100% verified RC, insurance, NOC, and doorstep RTO transfer assistance included.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#141724] border border-white/5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Non-Accidental Guarantee</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every car undergoes 200+ mechanical, suspension, engine, and electrical diagnostic checks.
          </p>
        </div>
      </section>

      {/* Dealership Visit Location Card */}
      <section className="rounded-2xl bg-[#131622] border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Visit Our Nashik Showroom</h3>
          </div>
          <p className="text-xs text-slate-300">
            {settings.address}, {settings.city}, Maharashtra
          </p>
          <p className="text-[11px] text-amber-400">
            {settings.business_hours}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${settings.whatsapp_number}`}
            className="px-4 py-2.5 rounded-xl bg-[#1c202e] hover:bg-[#252b3d] text-white text-xs font-bold flex items-center gap-1.5 border border-white/10"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Call Now</span>
          </a>

          <a
            href={`https://wa.me/91${settings.whatsapp_number}?text=${encodeURIComponent('Hello JK Motors! Please share your showroom location pin on Google Maps.')}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Get Location Pin</span>
          </a>
        </div>
      </section>

    </div>
  );
};
