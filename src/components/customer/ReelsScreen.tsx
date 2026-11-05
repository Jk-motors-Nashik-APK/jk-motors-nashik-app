import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, MessageCircle, 
  ChevronUp, ChevronDown, Heart, Share2, Sparkles, X, Info,
  Award, CheckCircle2, Star, PartyPopper, Car as CarIcon, Loader2, RotateCcw
} from 'lucide-react';
import { Car, DealershipSettings } from '../../types';
import { formatINR, createWhatsAppLink, formatMediaUrl } from '../../utils/formatters';

export type ReelType = 'video' | 'story';
export type ReelCategory = 'all' | 'walkarounds' | 'customers';

export interface ReelItem {
  id: string;
  type: ReelType;
  category: 'walkaround' | 'customer' | 'facility';
  title: string;
  subtitle?: string;
  mediaUrl: string;
  carId?: string;
  price?: number;
  reg?: string;
  host: string;
  desc: string;
  customerReview?: string;
  deliveryDate?: string;
  badge?: string;
  likes?: number;
}

interface ReelsScreenProps {
  cars: Car[];
  settings: DealershipSettings;
  favourites: string[];
  initialCategory?: ReelCategory;
  initialReelId?: string;
  onSelectCar: (car: Car) => void;
  onToggleFavourite: (carId: string) => void;
  onClose?: () => void;
}

export const ReelsScreen: React.FC<ReelsScreenProps> = ({
  cars,
  settings,
  favourites,
  initialCategory = 'walkarounds',
  initialReelId,
  onSelectCar,
  onToggleFavourite,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<ReelCategory>(initialCategory);
  const [likedReelIds, setLikedReelIds] = useState<string[]>([]);
  const [shareToast, setShareToast] = useState(false);

  // Complete catalog of Video Walkarounds + Customer Delivery Story Reels
  // Note: Video Walkarounds are prioritized first for instant video playback
  const allReels: ReelItem[] = [
    // --- 1. Video Walkaround Reels (Original Recorded MP4 Videos) ---
    {
      id: 'reel-video-celerio',
      type: 'video',
      category: 'walkaround',
      title: 'Maruti Suzuki Celerio VXi 2016',
      subtitle: 'In-Depth Walkaround Video with Naresh Joshi',
      mediaUrl: '/assets/aistudio/VID-20261104-WA0014_2147fa0a.mp4',
      carId: 'car-celerio-2016',
      price: 349000,
      reg: 'MH 15 FN 0155',
      host: 'Naresh Joshi (Proprietor)',
      badge: 'Single Owner Petrol',
      desc: 'Single owner pure petrol Maruti Celerio in immaculate condition. Chilling AC, Pioneer stereo, and full service book.',
      likes: 420,
    },
    {
      id: 'reel-video-duster',
      type: 'video',
      category: 'walkaround',
      title: 'Renault Duster RxZ Top Model 2016',
      subtitle: 'High Ground Clearance 1.5 dCi Diesel',
      mediaUrl: '/assets/aistudio/VID-20261104-WA0019_df17b738.mp4',
      carId: 'car-duster-2016',
      price: 435000,
      reg: 'MH 15 FF 9959',
      host: 'Naresh Joshi (Proprietor)',
      badge: '20+ km/l Diesel Cruiser',
      desc: 'Legendary 1.5 dCi diesel highway cruiser. MediaNAV touchscreen, original alloy wheels, and punchy diesel torque.',
      likes: 615,
    },
    {
      id: 'reel-video-seltos',
      type: 'video',
      category: 'walkaround',
      title: 'Kia Seltos GTX+ Sunroof 2019',
      subtitle: 'VIP Number MH 05 DZ 7002',
      mediaUrl: '/assets/aistudio/VID-20261104-WA0018_1c1d51ed.mp4',
      carId: 'car-seltos-2019',
      price: 1049000,
      reg: 'MH 05 DZ 7002',
      host: 'Naresh Joshi (Proprietor)',
      badge: 'Sunroof & VIP Number',
      desc: 'Loaded top model with electric sunroof, push button start, 10.25-inch screen, Bose sound, and VIP registration.',
      likes: 890,
    },
    {
      id: 'reel-video-celebration',
      type: 'video',
      category: 'walkaround',
      title: 'Grand Customer Delivery Ceremony',
      subtitle: 'Dussehra Puja & Aarti at JK Motors',
      mediaUrl: '/assets/aistudio/VID-20261104-WA0022_238eef52.mp4',
      carId: '',
      price: 0,
      reg: 'JK Motors Nashik',
      host: 'JK Motors Family',
      badge: 'Delivery Ceremony',
      desc: 'Every car handover is celebrated with Aarti, coconut puja, floral garlands, and ceremonial key presentation!',
      likes: 740,
    },
    {
      id: 'reel-video-office',
      type: 'video',
      category: 'facility',
      title: 'Transparent Paperwork & RC Transfer',
      subtitle: 'Showroom Office & Loan Processing',
      mediaUrl: '/assets/aistudio/VID-20261104-WA0023_b87e663d.mp4',
      carId: '',
      price: 0,
      reg: 'Showroom Desk',
      host: 'Naresh Joshi (Desk)',
      badge: '100% Verified RC',
      desc: 'Transparent RC transfer, NOC verification, and bank loan documentation right at our Nashik Highway office.',
      likes: 310,
    },

    // --- 2. Happy Customer Delivery Stories (Ceremony Photos) ---
    {
      id: 'reel-cust-ciaz-silver',
      type: 'story',
      category: 'customer',
      title: 'Maruti Ciaz Luxury Handover',
      subtitle: 'Delivered to Patil Family, Nashik',
      mediaUrl: '/assets/aistudio/IMG-20261104-WA0006.jpg',
      carId: 'car-celerio-2016',
      price: 499000,
      reg: 'MH 15 FF 7705',
      host: 'Naresh Joshi (Proprietor)',
      badge: 'Patil Family Handover',
      deliveryDate: 'Ceremonial Key Handover',
      desc: 'Proud moments at JK Motors Nashik! Ceremonial big key presentation for Maruti Suzuki Ciaz with 100% RTO paper transfer and full warranty.',
      customerReview: '“100% honest dealership in Nashik! Naresh ji gave us the best price and arranged loan in just 2 hours.”',
      likes: 342,
    },
    {
      id: 'reel-cust-brezza-dussehra',
      type: 'story',
      category: 'customer',
      title: 'Vitara Brezza ZDi+ Dussehra Delivery',
      subtitle: 'Delivered on Shubh Muhurat',
      mediaUrl: '/assets/aistudio/IMG-20261104-WA0002_9ea5637b.jpg',
      carId: '',
      price: 749000,
      reg: 'MH 15 EX 8377',
      host: 'Naresh Joshi & Team',
      badge: 'Dussehra Shubh Muhurat',
      deliveryDate: 'Dussehra Day',
      desc: 'Shubh Dussehra car handover with traditional coconut puja and giant ceremonial key! Delivered to smiling friends and family.',
      customerReview: '“Purchased our dream SUV on Dussehra! Complete non-accidental certificate given by JK Motors.”',
      likes: 512,
    },
    {
      id: 'reel-cust-ciaz-white-garland',
      type: 'story',
      category: 'customer',
      title: 'Maruti Ciaz Special White Edition',
      subtitle: 'Delivered with Floral Garland & Vedic Puja',
      mediaUrl: '/assets/aistudio/IMG-20261104-WA0008.jpg',
      carId: '',
      price: 525000,
      reg: 'MH 04 AR 2105',
      host: 'Naresh Joshi (Proprietor)',
      badge: 'Vedic Puja Handover',
      deliveryDate: 'Recent Delivery',
      desc: 'Single-owner pristine white Maruti Ciaz handover with fresh red rose garlands, ceremonial key, and instant RC paperwork.',
      customerReview: '“Transparent pricing, zero hidden charges. JK Motors is the most trusted car dealer in Nashik!”',
      likes: 289,
    },
    {
      id: 'reel-cust-tiago',
      type: 'story',
      category: 'customer',
      title: 'Tata Tiago Revotron Handover',
      subtitle: 'Delivered with Traditional Aarti & Puja',
      mediaUrl: '/assets/aistudio/IMG-20261104-WA0009.jpg',
      carId: '',
      price: 385000,
      reg: 'MH 15 HG 1727',
      host: 'JK Motors Team',
      badge: '4-Star Safety Hatchback',
      deliveryDate: 'Happy Family',
      desc: 'Safe and certified Tata Tiago handed over to proud new owner. Inspected on 200+ mechanical quality check points.',
      customerReview: '“Very polite staff and genuine odometer reading. Got smooth finance from SBI with low EMI.”',
      likes: 198,
    },
    {
      id: 'reel-cust-kwid',
      type: 'story',
      category: 'customer',
      title: 'Renault Kwid First Family Car',
      subtitle: 'Delivered to Young Entrepreneur',
      mediaUrl: '/assets/aistudio/IMG-20261104-WA0010.jpg',
      carId: '',
      price: 275000,
      reg: 'MH 05 CM 9527',
      host: 'Naresh Joshi',
      badge: 'First Car Milestone',
      deliveryDate: 'Celebration Day',
      desc: 'Turning the dream of owning a first car into reality with minimal down payment and guaranteed doorstep RTO transfer.',
      customerReview: '“My first car purchase! Naresh Joshi guided me through every step without any broker pressure.”',
      likes: 174,
    },
    {
      id: 'reel-cust-celerio',
      type: 'story',
      category: 'customer',
      title: 'Maruti Suzuki Celerio Automatic',
      subtitle: 'Delivered with 100% On-Spot Finance',
      mediaUrl: '/assets/aistudio/IMG-20261104-WA0012.jpg',
      carId: 'car-celerio-2016',
      price: 349000,
      reg: 'MH 04 GM 9757',
      host: 'JK Motors Delivery Desk',
      badge: 'Automatic City Hatchback',
      deliveryDate: 'Happy Owner',
      desc: 'Smooth automatic city commuter handed over to enthusiastic owner with full service record and 6 months engine warranty.',
      customerReview: '“Car was handed over spotless like a new car straight from the showroom!”',
      likes: 215,
    },
    {
      id: 'reel-cust-duster',
      type: 'story',
      category: 'customer',
      title: 'Renault Duster RxZ 110PS Diesel',
      subtitle: 'Rugged Highway Beast Handover',
      mediaUrl: '/assets/aistudio/IMG-20261104-WA0003_b7ac20e2.jpg',
      carId: 'car-duster-2016',
      price: 435000,
      reg: 'MH 15 FF 9959',
      host: 'Naresh Joshi (Proprietor)',
      badge: 'SUV Handover',
      deliveryDate: 'Highway Cruiser',
      desc: 'Legendary Renault Duster SUV delivered to adventure loving family. Highest ground clearance with chilling dual AC.',
      customerReview: '“Took it straight on the Nashik-Pune expressway, drive was butter smooth. Thank you JK Motors!”',
      likes: 311,
    },
    {
      id: 'reel-cust-wagonr',
      type: 'story',
      category: 'customer',
      title: 'Maruti WagonR Tall-Boy Handover',
      subtitle: 'LPG / Petrol with 5 Years Passing',
      mediaUrl: '/assets/aistudio/IMG-20261104-WA0005_d36d0584.jpg',
      carId: '',
      price: 185000,
      reg: 'MH 04 ED 2105',
      host: 'JK Motors Staff',
      badge: 'Economy Family Car',
      deliveryDate: 'Family Milestone',
      desc: 'Super economical family favorite delivered with complete 5 years fitness passing and fresh tyre set.',
      customerReview: '“Best budget car buying experience. Very respectful and helpful delivery ceremony.”',
      likes: 188,
    },
    {
      id: 'reel-cust-eeco',
      type: 'story',
      category: 'customer',
      title: 'Maruti Eeco 7-Seater Workhorse',
      subtitle: 'Delivered for Nashik Business Transport',
      mediaUrl: '/assets/aistudio/IMG-20261104-WA0004_a28823c9.jpg',
      carId: '',
      price: 295000,
      reg: 'MH 15 Commercial',
      host: 'Naresh Joshi',
      badge: '7-Seater Multi-Utility',
      deliveryDate: 'Commercial Handover',
      desc: 'Reliable 7-seater Eeco delivered with commercial fitness verification and quick business asset finance.',
      customerReview: '“Helped expand our business commute effortlessly. Transparent paperwork.”',
      likes: 153,
    },
  ];

  // Filter reels based on active tab
  const filteredReels = allReels.filter(reel => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'walkarounds') return reel.category === 'walkaround' || reel.type === 'video';
    if (activeCategory === 'customers') return reel.category === 'customer' || reel.id.includes('celebration');
    return true;
  });

  // Calculate starting index if initialReelId was requested
  const getInitialIndex = () => {
    if (initialReelId) {
      const foundIdx = filteredReels.findIndex(r => r.id === initialReelId || r.carId === initialReelId);
      if (foundIdx >= 0) return foundIdx;
    }
    return 0;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  // Default to muted so browsers allow 100% reliable autoplay without user gesture block
  const [isMuted, setIsMuted] = useState(true);
  const [storyProgress, setStoryProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoBuffering, setIsVideoBuffering] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const storyTimerRef = useRef<number | null>(null);

  // Safeguard index if category changes
  const activeReelIndex = Math.min(currentIndex, Math.max(0, filteredReels.length - 1));
  const currentReel = filteredReels[activeReelIndex] || allReels[0];

  const matchedCar = cars.find(c => c.id === currentReel.carId);
  const isFav = currentReel.carId ? favourites.includes(currentReel.carId) : false;
  const isLiked = likedReelIds.includes(currentReel.id);

  // Explicit Video playback trigger on mount / reel change
  const attemptPlayVideo = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;

    setPlaybackError(false);
    setIsVideoBuffering(true);

    // Apply muted state directly to DOM property (vital for React & mobile browsers)
    vid.defaultMuted = isMuted;
    vid.muted = isMuted;

    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsVideoBuffering(false);
        })
        .catch((err) => {
          console.warn('Autoplay with current settings prevented, retrying muted:', err);
          // If unmuted autoplay was rejected by browser, fallback to muted immediately
          if (!isMuted && vid) {
            vid.muted = true;
            setIsMuted(true);
            vid.play()
              .then(() => {
                setIsPlaying(true);
                setIsVideoBuffering(false);
              })
              .catch((e) => {
                console.error('Muted autoplay also blocked:', e);
                setIsPlaying(false);
                setIsVideoBuffering(false);
                setPlaybackError(true);
              });
          } else {
            setIsPlaying(false);
            setIsVideoBuffering(false);
            setPlaybackError(true);
          }
        });
    }
  }, [isMuted]);

  useEffect(() => {
    if (currentReel.type === 'video') {
      setVideoProgress(0);
      attemptPlayVideo();
    }
  }, [currentReel.id, currentReel.type, attemptPlayVideo]);

  // Story auto-advance timer for image reels (6.5 seconds per photo)
  useEffect(() => {
    if (currentReel.type === 'story' && isPlaying) {
      setStoryProgress(0);
      const startTime = Date.now();
      const duration = 6500; // 6.5s per story

      const interval = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, (elapsed / duration) * 100);
        setStoryProgress(pct);

        if (pct >= 100) {
          window.clearInterval(interval);
          handleNext();
        }
      }, 50);

      storyTimerRef.current = interval;

      return () => {
        window.clearInterval(interval);
      };
    } else {
      setStoryProgress(0);
      if (storyTimerRef.current) {
        window.clearInterval(storyTimerRef.current);
      }
    }
  }, [activeReelIndex, currentReel.id, isPlaying, activeCategory]);

  const handleNext = () => {
    if (activeReelIndex < filteredReels.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(true);
    } else {
      // Loop to beginning of list
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (activeReelIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (currentReel.type === 'video') {
      if (!videoRef.current) return;
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setPlaybackError(false);
          })
          .catch(() => {
            // Retry muted
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      // If currently paused, resume playing when user un-mutes
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleLike = () => {
    if (isLiked) {
      setLikedReelIds(prev => prev.filter(id => id !== currentReel.id));
    } else {
      setLikedReelIds(prev => [...prev, currentReel.id]);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentReel.title,
        text: `Watch this verified reel from JK Motors Nashik: ${currentReel.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-140px)] py-1 max-w-lg mx-auto">
      
      {/* Category Filter Switcher Tabs */}
      <div className="w-full flex items-center justify-between gap-1.5 p-1.5 bg-[#141824] rounded-2xl border border-white/10 mb-3 shadow-lg">
        <button
          onClick={() => {
            setActiveCategory('walkarounds');
            setCurrentIndex(0);
            setIsPlaying(true);
          }}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeCategory === 'walkarounds'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <CarIcon className="w-3.5 h-3.5" />
          <span>Walkaround Videos ({allReels.filter(r => r.type === 'video').length})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('customers');
            setCurrentIndex(0);
            setIsPlaying(true);
          }}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeCategory === 'customers'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <PartyPopper className="w-3.5 h-3.5" />
          <span>Deliveries ({allReels.filter(r => r.category === 'customer').length})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('all');
            setCurrentIndex(0);
            setIsPlaying(true);
          }}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All ({allReels.length})</span>
        </button>
      </div>

      {/* Main Reel Viewport Frame (9:16 vertical ratio) */}
      <div className="relative w-full aspect-[9/16] sm:aspect-[9/15] bg-black rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20 flex flex-col justify-between select-none">
        
        {/* Story / Video Progress Bar at Top */}
        <div className="absolute top-2 left-3 right-3 z-30 flex items-center gap-1">
          <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-amber-400 transition-all ease-linear"
              style={{ width: `${currentReel.type === 'story' ? storyProgress : videoProgress}%` }}
            />
          </div>
        </div>

        {/* Media Background Content */}
        {currentReel.type === 'video' ? (
          <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              key={currentReel.id}
              src={formatMediaUrl(currentReel.mediaUrl)}
              autoPlay
              playsInline
              webkit-playsinline="true"
              loop
              muted={isMuted}
              preload="auto"
              onClick={togglePlay}
              onTimeUpdate={(e) => {
                const el = e.currentTarget;
                if (el.duration && !isNaN(el.duration)) {
                  setVideoProgress((el.currentTime / el.duration) * 100);
                }
              }}
              onWaiting={() => setIsVideoBuffering(true)}
              onPlaying={() => {
                setIsVideoBuffering(false);
                setIsPlaying(true);
                setPlaybackError(false);
              }}
              onCanPlay={() => setIsVideoBuffering(false)}
              onError={(e) => {
                console.error('Video load error:', e);
                setIsVideoBuffering(false);
                setPlaybackError(true);
              }}
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
        ) : (
          <div 
            onClick={togglePlay} 
            className="absolute inset-0 w-full h-full cursor-pointer overflow-hidden bg-slate-950"
          >
            <img
              key={currentReel.mediaUrl}
              src={formatMediaUrl(currentReel.mediaUrl)}
              alt={currentReel.title}
              className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                isPlaying ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
        )}

        {/* Dark Vignette Overlays for Maximum Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/95 pointer-events-none" />

        {/* Buffering Indicator */}
        {isVideoBuffering && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-2" />
            <span className="text-xs font-bold text-amber-300 bg-black/70 px-3 py-1 rounded-full border border-amber-500/30">
              Loading Video Walkaround...
            </span>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="relative z-20 pt-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-black text-amber-300 font-brand tracking-wider uppercase drop-shadow">
              JK MOTORS {currentReel.type === 'story' ? 'DELIVERY' : 'WALKAROUND'}
            </span>
            <span className="text-[10px] text-slate-300 font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">
              {activeReelIndex + 1}/{filteredReels.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentReel.type === 'video' && (
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 border border-white/10 transition-all cursor-pointer"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            )}

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 border border-white/10 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Unmute Floating Banner / Indicator when video is playing muted */}
        {currentReel.type === 'video' && isPlaying && isMuted && (
          <button
            onClick={toggleMute}
            className="absolute top-14 left-4 z-20 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-400/40 shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 animate-pulse"
          >
            <VolumeX className="w-4 h-4 text-rose-400" />
            <span>Sound Off • Tap to Unmute 🔊</span>
          </button>
        )}

        {/* Paused Indicator Center */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer bg-black/40 backdrop-blur-[2px]"
          >
            <div className="p-4 rounded-full bg-amber-500 text-black shadow-2xl flex items-center justify-center transition-transform hover:scale-110">
              <Play className="w-8 h-8 fill-black ml-1" />
            </div>
          </div>
        )}

        {/* Playback Retry if Blocked */}
        {playbackError && !isPlaying && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 p-4">
            <p className="text-sm font-bold text-white mb-3 text-center">
              Tap below to start video playback
            </p>
            <button
              onClick={() => {
                setIsMuted(true);
                if (videoRef.current) {
                  videoRef.current.muted = true;
                  videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                }
              }}
              className="py-2.5 px-5 rounded-full bg-amber-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Video Now</span>
            </button>
          </div>
        )}

        {/* Right Floating Quick Actions */}
        <div className="absolute right-3.5 bottom-28 z-20 flex flex-col items-center gap-4">
          {/* Previous Reel */}
          <button
            onClick={handlePrev}
            disabled={activeReelIndex === 0}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all border border-white/10 ${
              activeReelIndex === 0 ? 'bg-black/30 text-white/30 cursor-not-allowed' : 'bg-black/70 text-white hover:bg-black/90 cursor-pointer'
            }`}
            title="Previous Story"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Like Button */}
          <button
            onClick={toggleLike}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`p-3 rounded-full backdrop-blur-md border border-white/10 transition-all ${
              isLiked ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40' : 'bg-black/70 text-white hover:bg-black/90'
            }`}>
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
            </div>
            <span className="text-[10px] font-mono font-bold text-white drop-shadow">
              {(currentReel.likes || 150) + (isLiked ? 1 : 0)}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Share Reel"
          >
            <div className="p-3 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/10 transition-all">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow">Share</span>
          </button>

          {/* Favourites Button (if linked to car) */}
          {currentReel.carId && (
            <button
              onClick={() => onToggleFavourite(currentReel.carId!)}
              className={`p-3 rounded-full backdrop-blur-md border border-white/10 transition-all cursor-pointer ${
                isFav ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/40' : 'bg-black/70 text-amber-300 hover:bg-black/90'
              }`}
              title="Save to Favourites"
            >
              <Star className={`w-5 h-5 ${isFav ? 'fill-black' : ''}`} />
            </button>
          )}

          {/* Next Reel */}
          <button
            onClick={handleNext}
            className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-all border border-white/10 cursor-pointer"
            title="Next Story"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Vehicle & Customer Delivery Details Overlay */}
        <div className="relative z-20 p-4 space-y-2.5 pb-5">
          
          {/* Badge & Host Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {currentReel.badge && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-sm flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>{currentReel.badge}</span>
              </span>
            )}

            {currentReel.reg && (
              <span className="text-[10px] font-mono font-bold text-white bg-black/70 border border-white/20 px-2 py-0.5 rounded backdrop-blur-md">
                {currentReel.reg}
              </span>
            )}

            <span className="text-[10px] text-slate-300 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
              {currentReel.host}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight drop-shadow-md">
              {currentReel.title}
            </h3>
            {currentReel.subtitle && (
              <p className="text-xs text-amber-300/90 font-medium mt-0.5 drop-shadow">
                {currentReel.subtitle}
              </p>
            )}
          </div>

          {/* Customer Quote Review (For delivery stories) */}
          {currentReel.customerReview && (
            <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/20 backdrop-blur-md">
              <p className="text-[11px] text-amber-200/90 italic leading-snug">
                {currentReel.customerReview}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Verified Delivery at JK Motors Nashik</span>
              </div>
            </div>
          )}

          {/* Description */}
          {!currentReel.customerReview && (
            <p className="text-xs text-slate-300 leading-snug drop-shadow line-clamp-2 pr-12">
              {currentReel.desc}
            </p>
          )}

          {/* Price display if car available */}
          {currentReel.price && currentReel.price > 0 && (
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-xl font-black text-amber-400 font-mono drop-shadow">
                {formatINR(currentReel.price)}
              </span>
              <span className="text-[11px] text-emerald-400 font-bold drop-shadow">
                • 100% On-Spot Loan Approval
              </span>
            </div>
          )}

          {/* Interactive CTAs */}
          <div className="flex items-center gap-2 pt-1">
            {matchedCar && (
              <button
                onClick={() => onSelectCar(matchedCar)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all cursor-pointer"
              >
                <Info className="w-4 h-4 text-amber-300" />
                <span>Vehicle Details</span>
              </button>
            )}

            <a
              href={createWhatsAppLink({
                phone: settings.whatsapp_number,
                customMessage: currentReel.category === 'customer'
                  ? `Hello Naresh Joshi! I saw the happy customer delivery story for *${currentReel.title}* (${currentReel.reg || 'JK Motors'}). Congratulations! Do you have similar certified cars available in stock?`
                  : `Hello Naresh Joshi! I watched the video reel for *${currentReel.title}* (Reg: ${currentReel.reg}). Listed at ${currentReel.price ? formatINR(currentReel.price) : 'Best Price'}. Please share test drive and loan details.`,
              }).url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{currentReel.category === 'customer' ? 'Ask For Similar Car' : 'WhatsApp Naresh Joshi'}</span>
            </a>
          </div>

        </div>

      </div>

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-2 rounded-full font-bold text-xs shadow-2xl z-50 animate-bounce">
          Reel link copied to clipboard!
        </div>
      )}

      {/* Reel Progress dots below */}
      <div className="flex items-center justify-center gap-1 mt-3 overflow-x-auto max-w-full py-1 px-4">
        {filteredReels.map((r, i) => (
          <button
            key={r.id}
            onClick={() => {
              setCurrentIndex(i);
              setIsPlaying(true);
            }}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              i === activeReelIndex
                ? 'w-6 bg-amber-400'
                : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
            title={r.title}
          />
        ))}
      </div>

    </div>
  );
};
