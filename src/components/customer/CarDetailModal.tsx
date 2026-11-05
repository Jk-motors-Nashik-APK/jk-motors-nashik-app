import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, Heart, Share2, MessageCircle, Phone, Calendar, 
  CheckCircle2, Fuel, Gauge, Award, 
  MapPin, ChevronLeft, ChevronRight, Play, Volume2, VolumeX,
  CreditCard, Send, Sparkles, AlertCircle, CheckCheck, Copy, Check, Eye
} from 'lucide-react';
import { Car, DealershipSettings, UserProfile } from '../../types';
import { formatINR, formatKm, calculateEMI, createWhatsAppLink, formatMediaUrl } from '../../utils/formatters';
import { Language, translations } from '../../locales/i18n';
import { ApiService } from '../../services/api';

interface CarDetailModalProps {
  car: Car;
  settings: DealershipSettings;
  language: Language;
  isFavourite: boolean;
  currentUser: UserProfile | null;
  onToggleFavourite: (carId: string) => void;
  onClose: () => void;
  onSelectCar: (car: Car) => void;
  allCars: Car[];
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  settings,
  language,
  isFavourite,
  currentUser,
  onToggleFavourite,
  onClose,
  onSelectCar,
  allCars,
}) => {
  const t = translations[language];
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  // Default to muted so browser allows reliable autoplay
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // EMI Calculator State
  const defaultDownPayment = Math.round(car.price * 0.2);
  const [downPayment, setDownPayment] = useState(defaultDownPayment);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [interestRate, setInterestRate] = useState(9.5);

  const loanPrincipal = Math.max(0, car.price - downPayment);
  const calculatedEMI = calculateEMI(loanPrincipal, interestRate, loanTenureYears);

  // Form State
  const [customerName, setCustomerName] = useState(currentUser?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone ? currentUser.phone.replace(/[^0-9]/g, '').slice(-10) : '');
  const [preferredVisit, setPreferredVisit] = useState('');
  const [loanRequired, setLoanRequired] = useState(true);
  const [customMessage, setCustomMessage] = useState(`Hello, I would like to schedule a visit to inspect the ${car.make} ${car.model} (${car.model_year}) at JK Motors Nashik.`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeMedia = car.media[activeMediaIndex] || car.media[0];
  const isVideo = activeMedia?.media_type === 'video';

  // Ensure video plays reliably when selected
  useEffect(() => {
    if (isVideo && videoRef.current) {
      const vid = videoRef.current;
      vid.defaultMuted = isVideoMuted;
      vid.muted = isVideoMuted;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Modal autoplay blocked:', err);
          vid.muted = true;
          setIsVideoMuted(true);
          vid.play().catch(() => {});
        });
      }
    }
  }, [activeMediaIndex, isVideo, isVideoMuted]);


  // Handle direct WhatsApp enquiry
  const handleWhatsAppDirect = async () => {
    try {
      // Create DB enquiry tracking first as required by specs
      await ApiService.submitEnquiry({
        customer_name: currentUser?.full_name || 'Customer via WhatsApp Click',
        customer_phone: currentUser?.phone || '',
        car_id: car.id,
        source: 'whatsapp_click',
        message: `Customer clicked direct WhatsApp button for ${car.make} ${car.model} (${formatINR(car.price)})`,
        loan_required: true,
      });
    } catch (e) {
      console.warn('Logging enquiry failed', e);
    }

    const { url } = createWhatsAppLink({
      phone: settings.whatsapp_number,
      carMake: car.make,
      carModel: car.model,
      carYear: car.model_year,
      carPrice: car.offer_price || car.price,
      listingId: car.id,
      registrationNumber: car.registration_number,
    });

    window.open(url, '_blank');
  };

  const [copiedPreview, setCopiedPreview] = useState(false);
  const [confirmedWhatsAppUrl, setConfirmedWhatsAppUrl] = useState<string>('');

  // Real-time WhatsApp preview message including vehicle specs, customer inputs, and loan preference
  const whatsappPreviewMessage = useMemo(() => {
    const reg = car.registration_number ? ` (Reg: ${car.registration_number})` : '';
    const cleanPhone = customerPhone.trim() ? `+91 ${customerPhone.trim()}` : '+91 XXXXXXXXXX';
    const name = customerName.trim() ? customerName.trim() : 'Prospective Buyer';
    const visit = preferredVisit.trim() ? preferredVisit.trim() : 'As soon as possible / Flexible';
    const finance = loanRequired ? 'Yes (Bank Finance Assistance Required)' : 'No (Direct/Self Payment)';
    const priceFormatted = formatINR(car.offer_price || car.price);

    return `Hello JK Motors! 👋\nI would like to schedule an inspection & test drive for this vehicle:\n\n🚗 *Car:* ${car.make} ${car.model} (${car.model_year})${reg}\n💰 *Listed Price:* ${priceFormatted}\n🏷️ *Variant & Specs:* ${car.variant || 'Standard'} • ${car.fuel_type} • ${car.transmission} • ${formatKm(car.kilometres)}\n🆔 *Listing ID:* #${car.id.slice(-6).toUpperCase()}\n\n👤 *Customer Name:* ${name}\n📱 *WhatsApp Number:* ${cleanPhone}\n📅 *Preferred Visit Date & Time:* ${visit}\n🏦 *Loan / Finance Assistance:* ${finance}\n\n💬 *Customer Note:* "${customMessage.trim() || 'Please confirm showroom availability.'}"\n\nPlease share test drive slot confirmation and dealership address. Thank you!`;
  }, [car, customerName, customerPhone, preferredVisit, loanRequired, customMessage]);

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(whatsappPreviewMessage);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2000);
  };

  // Submit formal test drive/visit form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || customerPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await ApiService.submitEnquiry({
        customer_name: customerName || 'Valued Customer',
        customer_phone: customerPhone,
        car_id: car.id,
        source: 'visit_request',
        message: whatsappPreviewMessage,
        preferred_visit_date: preferredVisit || 'Soon as possible',
        loan_required: loanRequired,
      });

      const { url } = createWhatsAppLink({
        phone: settings.whatsapp_number,
        customMessage: whatsappPreviewMessage,
      });
      setConfirmedWhatsAppUrl(url);
      setEnquirySuccess(true);

      // Trigger WhatsApp in new window
      window.open(url, '_blank');
    } catch (err: any) {
      alert('Failed to submit: ' + (err.message || 'Network error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${car.make} ${car.model} at JK Motors`,
        text: `Check out this verified ${car.make} ${car.model} (${car.model_year}) at JK Motors Nashik for ${formatINR(car.price)}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Related cars
  const relatedCars = allCars
    .filter(c => c.id !== car.id && c.status === 'published')
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#10131d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0c0d12]">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30">
              JK Motors Verified
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: #{car.id.slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavourite(car.id)}
              className={`p-2 rounded-full border transition-all ${
                isFavourite
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-[#181b26] text-slate-400 border-white/10 hover:text-white'
              }`}
              title="Add to Favourites"
            >
              <Heart className={`w-4 h-4 ${isFavourite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-[#181b26] text-slate-400 border border-white/10 hover:text-white transition-all relative"
              title="Share Car"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-7 right-0 text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded shadow font-semibold whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#181b26] text-slate-400 border border-white/10 hover:text-white hover:bg-white/10 transition-all ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Media Gallery / Video Walkaround */}
          <div className="space-y-3">
            <div className="relative aspect-video sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
              {isVideo ? (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    key={activeMedia.url}
                    src={formatMediaUrl(activeMedia.url)}
                    controls
                    autoPlay
                    muted={isVideoMuted}
                    playsInline
                    preload="auto"
                    className="w-full h-full object-contain bg-black"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-amber-300 flex items-center gap-1.5 border border-amber-500/40 pointer-events-none">
                    <Play className="w-3.5 h-3.5 fill-amber-300" />
                    <span>Condition Walkaround Video</span>
                  </div>

                  <button
                    onClick={() => {
                      const nextMuted = !isVideoMuted;
                      setIsVideoMuted(nextMuted);
                      if (videoRef.current) {
                        videoRef.current.muted = nextMuted;
                      }
                    }}
                    className="absolute top-3 right-3 bg-black/75 hover:bg-black/90 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer z-20"
                  >
                    {isVideoMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        <span>Unmute 🔊</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mute</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <img
                  src={formatMediaUrl(activeMedia?.url)}
                  alt={car.make + ' ' + car.model}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Prev / Next media buttons if multiple */}
              {car.media.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveMediaIndex(prev => (prev === 0 ? car.media.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveMediaIndex(prev => (prev === car.media.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Media Thumbnails */}
            {car.media.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {car.media.map((med, idx) => (
                  <button
                    key={med.id || idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border transition-all ${
                      activeMediaIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/30'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {med.media_type === 'video' ? (
                      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-amber-400">
                        <Play className="w-4 h-4 fill-amber-400" />
                        <span className="text-[9px] font-bold">VIDEO</span>
                      </div>
                    ) : (
                      <img src={formatMediaUrl(med.url)} alt="thumbnail" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Badges & Price Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {car.model_year} Model
                </span>
                {car.registration_number && (
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    Reg: {car.registration_number}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  {car.ownership_count === 1 ? t.singleOwner : `${car.ownership_count} Owners`}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {car.make} {car.model}
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {car.variant || 'Standard Edition'} • {car.colour || 'Silver'}
              </p>
            </div>

            <div className="bg-[#171a26] p-3.5 rounded-xl border border-white/10 flex md:flex-col justify-between items-end gap-1">
              <span className="text-xs text-slate-400">JK Motors Deal Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  {formatINR(car.price)}
                </span>
                {car.offer_price && (
                  <span className="text-sm line-through text-slate-500">
                    {formatINR(car.offer_price)}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">
                {car.negotiable ? 'Negotiable on Table' : 'Fixed Best Price'} • EMI from ~{formatINR(calculatedEMI)}/mo
              </div>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#151824] p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.kmsDriven}</p>
                <p className="text-sm font-bold text-white">{formatKm(car.kilometres)}</p>
              </div>
            </div>

            <div className="bg-[#151824] p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Fuel className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.fuel}</p>
                <p className="text-sm font-bold text-white">{car.fuel_type}</p>
              </div>
            </div>

            <div className="bg-[#151824] p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.transmission}</p>
                <p className="text-sm font-bold text-white">{car.transmission}</p>
              </div>
            </div>

            <div className="bg-[#151824] p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Location / RTO</p>
                <p className="text-sm font-bold text-white truncate max-w-[120px]">{car.registration_location || 'Nashik MH 15'}</p>
              </div>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Vehicle Overview</h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-[#141722] p-4 rounded-xl border border-white/5">
              {car.description}
            </p>
          </div>

          {/* Features Checklist */}
          {car.features && car.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.features}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {car.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#141722] border border-white/5 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Loan EMI Calculator */}
          <div className="bg-gradient-to-br from-[#161a29] to-[#12141e] p-5 rounded-2xl border border-amber-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">{t.calculateLoan}</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                Up to 90% Loan Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Down payment slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{t.downPayment}</span>
                  <span className="font-bold text-white">{formatINR(downPayment)}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max={Math.round(car.price * 0.7)}
                  step="10000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Loan Tenure */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{t.tenureYears}</span>
                  <span className="font-bold text-white">{loanTenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={loanTenureYears}
                  onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Interest Rate</span>
                  <span className="font-bold text-white">{interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="8.0"
                  max="14.0"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Monthly EMI Box */}
            <div className="bg-[#0e1017] p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400">{t.estimatedEMI}</p>
                <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  {formatINR(calculatedEMI)} <span className="text-xs font-normal text-slate-400">/ month</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-400">Loan Amount: {formatINR(loanPrincipal)}</p>
                <p className="text-[10px] text-emerald-400 font-medium mt-0.5">Assistance with SBI, HDFC, ICICI, Mahindra</p>
              </div>
            </div>
          </div>

          {/* Test Drive & Visit Schedule Form Modal Drawer */}
          {showEnquiryModal && (
            <div className="bg-[#141724] border border-amber-500/30 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-white text-base">Schedule Dealership Visit & Test Drive</h4>
                </div>
                <button
                  onClick={() => setShowEnquiryModal(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {enquirySuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h5 className="font-bold text-emerald-300">Visit Request Received!</h5>
                  <p className="text-xs text-slate-300">
                    Naresh Joshi & the JK Motors team will contact you shortly on <b>+91 {customerPhone}</b> to confirm your appointment.
                  </p>
                  <button
                    onClick={handleWhatsAppDirect}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Open in WhatsApp Now
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 font-medium mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ramesh Patel"
                        className="w-full bg-[#0c0d12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 font-medium mb-1">Mobile Number (WhatsApp)</label>
                      <div className="relative flex">
                        <span className="inline-flex items-center px-2.5 text-xs bg-[#1f2333] border border-r-0 border-white/10 rounded-l-lg text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="9876543210"
                          className="w-full bg-[#0c0d12] border border-white/10 rounded-r-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 font-medium mb-1">Preferred Visit Date & Time</label>
                      <input
                        type="text"
                        value={preferredVisit}
                        onChange={(e) => setPreferredVisit(e.target.value)}
                        placeholder="e.g. Today 5:00 PM or Sunday Morning"
                        className="w-full bg-[#0c0d12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={loanRequired}
                          onChange={(e) => setLoanRequired(e.target.checked)}
                          className="w-4 h-4 accent-amber-400 rounded"
                        />
                        <span>I require Loan / Finance Assistance</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">Additional Message / Question</label>
                    <textarea
                      rows={2}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full bg-[#0c0d12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* REAL-TIME WHATSAPP MESSAGE PREVIEW */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-[#0b141a] overflow-hidden p-4 space-y-2.5 shadow-xl">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center text-black shadow-md flex-shrink-0">
                          <MessageCircle className="w-4 h-4 fill-black" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">
                              WhatsApp Message Live Preview
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Real-Time
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Sent to +91 {settings.whatsapp_number} (JK Motors)
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyPreview}
                        className="px-2.5 py-1 rounded-lg bg-[#16272c] hover:bg-[#1e383f] text-[11px] text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all font-semibold"
                        title="Copy message preview to clipboard"
                      >
                        {copiedPreview ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPreview ? 'Copied' : 'Copy Text'}</span>
                      </button>
                    </div>

                    {/* WhatsApp Outgoing Bubble */}
                    <div className="bg-[#005c4b] text-white rounded-xl rounded-tr-none p-3.5 shadow-md space-y-2.5 text-xs relative max-w-full">
                      {/* Highlighted Vehicle Header Banner inside WhatsApp bubble */}
                      <div className="bg-[#025142] p-2.5 rounded-lg border border-white/10 flex items-center gap-3">
                        <div className="w-12 h-10 rounded-md bg-black/50 overflow-hidden flex-shrink-0 border border-white/10">
                          <img
                            src={car.media.find(m => m.is_cover)?.url || car.media[0]?.url}
                            alt={car.model}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="truncate flex-1">
                          <p className="font-extrabold text-white text-xs truncate">
                            {car.make} {car.model} ({car.model_year})
                          </p>
                          <p className="text-amber-300 font-mono text-[11px] font-bold">
                            {formatINR(car.offer_price || car.price)} {car.registration_number ? `• ${car.registration_number}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Live Formatted WhatsApp Message Content */}
                      <div className="font-sans text-[11px] leading-relaxed text-slate-100 whitespace-pre-wrap select-text bg-black/20 p-2.5 rounded-lg border border-black/10">
                        {whatsappPreviewMessage}
                      </div>

                      {/* Bubble footer with timestamp and blue double ticks */}
                      <div className="flex items-center justify-end gap-1.5 text-[10px] text-emerald-200/90 pt-0.5">
                        <span>Just now</span>
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      </div>
                    </div>

                    {/* Transparency Notice */}
                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                      <span>🔒</span>
                      <span>
                        <b>Full Transparency:</b> You will see this draft opened in WhatsApp and can review or edit before tapping send.
                      </span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-black" />
                    <span>{isSubmitting ? 'Opening WhatsApp...' : 'Confirm Visit & Open in WhatsApp'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Related Cars Carousel */}
          {relatedCars.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Other Popular Cars at JK Motors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedCars.map((relCar) => {
                  const relCover = relCar.media.find(m => m.is_cover)?.url || relCar.media[0]?.url;
                  return (
                    <div
                      key={relCar.id}
                      onClick={() => onSelectCar(relCar)}
                      className="group bg-[#141724] border border-white/5 hover:border-amber-400/40 rounded-xl p-2.5 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-900 mb-2">
                        {relCar.media[0]?.media_type === 'video' ? (
                          <div className="w-full h-full relative flex items-center justify-center bg-slate-950">
                            <video src={relCar.media[0].url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-5 h-5 fill-amber-400 text-amber-400" />
                            </div>
                          </div>
                        ) : (
                          <img src={relCover} alt={relCar.model} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white truncate">{relCar.make} {relCar.model}</p>
                        <p className="text-[11px] text-amber-400 font-mono font-bold mt-0.5">{formatINR(relCar.price)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Floating Sticky Action Bar */}
        <div className="p-3 sm:p-4 bg-[#0c0d12] border-t border-white/10 flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${settings.whatsapp_number}`}
            className="flex-1 py-3 px-3 rounded-xl bg-[#1a1d2b] hover:bg-[#22273a] text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-all"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Call Dealer</span>
          </a>

          <button
            onClick={() => setShowEnquiryModal(prev => !prev)}
            className="flex-1 py-3 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-500/30 transition-all"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Book Visit</span>
          </button>

          <button
            onClick={handleWhatsAppDirect}
            className="flex-[1.5] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp Deal</span>
          </button>
        </div>

      </div>
    </div>
  );
};
