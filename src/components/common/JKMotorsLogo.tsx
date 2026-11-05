import React from 'react';

interface JKMotorsLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'neon' | 'white';
  showText?: boolean;
  glow?: boolean;
  logoUrl?: string;
}

export const JKMotorsLogo: React.FC<JKMotorsLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'gold',
  showText = false,
  glow = true,
  logoUrl,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const isGold = variant === 'gold';
  const isNeon = variant === 'neon';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Shield with 3-Point Crown and 'JK' Lettering or Image */}
      <div className={`relative ${sizeMap[size]} flex-shrink-0 flex items-center justify-center`}>
        {glow && (
          <div
            className={`absolute inset-0 rounded-full blur-md opacity-40 ${
              isGold ? 'bg-amber-400' : isNeon ? 'bg-amber-300' : 'bg-white'
            }`}
          />
        )}

        {logoUrl && !imageError ? (
          <img
            src={logoUrl}
            alt="JK Motors Logo"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain relative z-10 drop-shadow-md select-none"
          />
        ) : (
          <svg
            viewBox="0 0 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full relative z-10 drop-shadow-md"
          >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdf0cd" />
              <stop offset="35%" stopColor="#d4af37" />
              <stop offset="70%" stopColor="#f3cf65" />
              <stop offset="100%" stopColor="#aa820a" />
            </linearGradient>

            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Crown Jewels (3 circular pearls above the crown peaks) */}
          <circle
            cx="26"
            cy="11"
            r="3.2"
            fill={isNeon ? 'url(#neonGradient)' : isGold ? 'url(#goldGradient)' : '#ffffff'}
          />
          <circle
            cx="50"
            cy="7"
            r="4"
            fill={isNeon ? 'url(#neonGradient)' : isGold ? 'url(#goldGradient)' : '#ffffff'}
          />
          <circle
            cx="74"
            cy="11"
            r="3.2"
            fill={isNeon ? 'url(#neonGradient)' : isGold ? 'url(#goldGradient)' : '#ffffff'}
          />

          {/* Royal 3-Prong Crown Silhouette */}
          <path
            d="M26 15 L37 28 L50 12 L63 28 L74 15 L78 35 L22 35 Z"
            fill={isNeon ? 'url(#neonGradient)' : isGold ? 'url(#goldGradient)' : '#ffffff'}
          />

          {/* Crown Base Band */}
          <rect
            x="20"
            y="36"
            width="60"
            height="4"
            rx="2"
            fill={isNeon ? 'url(#neonGradient)' : isGold ? 'url(#goldGradient)' : '#ffffff'}
          />

          {/* Shield Outer Border */}
          <path
            d="M15 44 C15 44 50 44 50 44 C50 44 85 44 85 44 C85 68 82 86 50 110 C18 86 15 68 15 44 Z"
            stroke={isNeon ? 'url(#neonGradient)' : isGold ? 'url(#goldGradient)' : '#ffffff'}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#090a0f"
          />

          {/* Shield Inner Inset Border */}
          <path
            d="M21 49 C21 49 50 49 50 49 C50 49 79 49 79 49 C79 69 76 83 50 103 C24 83 21 69 21 49 Z"
            stroke={isNeon ? 'url(#neonGradient)' : isGold ? 'url(#goldGradient)' : '#ffffff'}
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="none"
          />

          {/* 'JK' Bold Stylized Lettering */}
          {/* 'J' */}
          <path
            d="M33 58 H43 V78 C43 83.5 39.5 87 34 87 C28.5 87 25 83 25 78.5 H33 C33 80.5 34.5 81.5 36 81.5 C37.5 81.5 38 80.5 38 78 V63 H33 V58 Z"
            fill={isNeon ? 'url(#neonGradient)' : isGold ? 'url(#goldGradient)' : '#ffffff'}
          />

          {/* 'K' */}
          <path
            d="M51 58 H58 V70.5 L69 58 H78 L65.5 72.5 L79 87 H69.5 L58 74.5 V87 H51 V58 Z"
            fill={isNeon ? 'url(#neonGradient)' : isGold ? 'url(#goldGradient)' : '#ffffff'}
          />
        </svg>
        )}
      </div>

      {showText && (
        <div>
          <span className="font-extrabold text-white tracking-wider uppercase text-sm block leading-none font-brand">
            JK MOTORS
          </span>
          <span className="text-[10px] text-amber-400 font-semibold tracking-widest block uppercase mt-0.5">
            Nashik
          </span>
        </div>
      )}
    </div>
  );
};
