import React from 'react';
import { Phone, MessageCircle, ShieldCheck, Globe, Smartphone, Monitor, Code2, ShieldAlert } from 'lucide-react';
import { Language, translations } from '../../locales/i18n';
import { DealershipSettings } from '../../types';
import { JKMotorsLogo } from '../common/JKMotorsLogo';

interface CustomerNavbarProps {
  settings: DealershipSettings;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  onOpenAdmin: () => void;
  onOpenFlutterHub: () => void;
  onGoHome?: () => void;
}

export const CustomerNavbar: React.FC<CustomerNavbarProps> = ({
  settings,
  language,
  onLanguageChange,
  isMobileFrame,
  onToggleFrame,
  onOpenAdmin,
  onOpenFlutterHub,
  onGoHome,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d12]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-4 py-2.5 sm:py-3">
      {/* Top Utility Bar for Switching Modes & Quick Call */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        {/* Dealership Identity Logo & Brand (Clickable to return Home) */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer transition-all hover:opacity-95 focus:outline-none"
          title="Return to JK Motors Home Screen"
          aria-label="Return to JK Motors Home Screen"
        >
          {/* Official JK Motors Crown Shield Logo */}
          <div className="group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
            <JKMotorsLogo
              size="md"
              variant="gold"
              glow={true}
              logoUrl={settings.logo_url}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wide text-white uppercase group-hover:text-amber-300 transition-colors">
                {language === 'mr' || language === 'hi' ? 'जे. के. मोटर्स' : settings.dealership_name}
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[150px] sm:max-w-xs group-hover:text-slate-300 transition-colors">
              {settings.city}, Maharashtra • Prop. {settings.proprietor.split(' ')[0]}
            </p>
          </div>
        </button>

        {/* Action Controls & Toggles */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-[#171a26] rounded-lg border border-white/10 p-0.5">
            <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-1" />
            {(['en', 'mr', 'hi'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-1.5 py-0.5 text-[11px] font-medium rounded transition-all ${
                  language === lang
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
              </button>
            ))}
          </div>

          {/* Flutter & Backend Code Hub Button */}
          <button
            onClick={onOpenFlutterHub}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all font-medium text-xs"
            title="Flutter App Code & Supabase Backend Arch"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Flutter & Supabase</span>
          </button>

          {/* Frame Toggle (Desktop only) */}
          <button
            onClick={onToggleFrame}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#171a26] hover:bg-[#202536] text-slate-300 border border-white/10 transition-all text-xs"
            title={isMobileFrame ? "Switch to Wide Desktop View" : "Simulate Mobile Device Frame"}
          >
            {isMobileFrame ? <Monitor className="w-3.5 h-3.5 text-amber-400" /> : <Smartphone className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isMobileFrame ? 'Desktop View' : 'Mobile View'}</span>
          </button>

          {/* Owner Dashboard Switcher */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all font-semibold text-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t.adminDashboard}</span>
          </button>

          {/* Quick Call */}
          <a
            href={`tel:${settings.whatsapp_number}`}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{settings.whatsapp_number}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
