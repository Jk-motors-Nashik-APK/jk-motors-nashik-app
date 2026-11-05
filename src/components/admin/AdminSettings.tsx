import React, { useState } from 'react';
import { Save, Check, ShieldCheck, MapPin, Phone, Instagram, Mail, Clock, Image as ImageIcon, Sparkles, RotateCcw } from 'lucide-react';
import { DealershipSettings } from '../../types';
import { JKMotorsLogo } from '../common/JKMotorsLogo';

interface AdminSettingsProps {
  settings: DealershipSettings;
  onSaveSettings: (settings: DealershipSettings) => Promise<void>;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [dealershipName, setDealershipName] = useState(settings.dealership_name);
  const [dealershipHindi, setDealershipHindi] = useState(settings.dealership_name_hindi || 'जे. के. मोटर्स');
  const [proprietor, setProprietor] = useState(settings.proprietor);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp_number);
  const [secondaryPhone, setSecondaryPhone] = useState(settings.secondary_phone);
  const [instagram, setInstagram] = useState(settings.instagram_url);
  const [address, setAddress] = useState(settings.address);
  const [city, setCity] = useState(settings.city);
  const [state, setState] = useState(settings.state);
  const [pincode, setPincode] = useState(settings.pincode);
  const [businessHours, setBusinessHours] = useState(settings.business_hours);
  const [email, setEmail] = useState(settings.support_email);
  const [logoUrl, setLogoUrl] = useState(settings.logo_url || '/assets/jk-motors-logo.svg');

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSaveSettings({
      ...settings,
      dealership_name: dealershipName,
      dealership_name_hindi: dealershipHindi,
      proprietor,
      whatsapp_number: whatsapp,
      secondary_phone: secondaryPhone,
      instagram_url: instagram,
      address,
      city,
      state,
      pincode,
      business_hours: businessHours,
      support_email: email,
      logo_url: logoUrl,
    });
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#131622] p-5 rounded-2xl border border-white/10 space-y-1">
        <h3 className="font-bold text-white text-base">Dealership Profile & Contact Details</h3>
        <p className="text-xs text-slate-400">
          These credentials configure customer click-to-WhatsApp links, enquiry routing, and showroom address.
        </p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Dealership configuration saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#131622] p-6 rounded-2xl border border-white/10 space-y-5 text-xs">
        
        {/* Dealership Logo & Branding Asset */}
        <div className="p-4 rounded-xl bg-[#181c2b] border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-white font-bold flex items-center gap-1.5 text-xs">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Dealership Logo & Brand Asset</span>
            </label>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Persisted in Settings</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
            {/* Live Logo Preview Box */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-black border border-white/15 p-2 flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-transparent pointer-events-none" />
              <JKMotorsLogo size="lg" variant="gold" glow={true} logoUrl={logoUrl} />
              <span className="text-[9px] text-slate-400 font-mono mt-1 z-10">Preview</span>
            </div>

            {/* Logo URL Input & Actions */}
            <div className="flex-1 w-full space-y-2">
              <div>
                <span className="text-slate-300 font-medium block text-[11px] mb-1">
                  Logo Storage Path / Asset URL:
                </span>
                <input
                  type="text"
                  required
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/assets/jk-motors-logo.svg"
                  className="w-full bg-[#121520] border border-white/15 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setLogoUrl('/assets/jk-motors-logo.svg')}
                  className="px-2.5 py-1 rounded bg-[#222738] hover:bg-[#2b3248] text-amber-300 font-semibold text-[10px] flex items-center gap-1 border border-white/10 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore Official Vector Shield</span>
                </button>
                <span className="text-[10px] text-slate-400">
                  Used across CustomerNavbar, Admin Header, & Home splash
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dealership Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Dealership Name (English)</label>
            <input
              type="text"
              required
              value={dealershipName}
              onChange={(e) => setDealershipName(e.target.value)}
              className="w-full bg-[#181c2b] border border-white/10 rounded-lg px-3 py-2 text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Dealership Name (Marathi / Hindi)</label>
            <input
              type="text"
              value={dealershipHindi}
              onChange={(e) => setDealershipHindi(e.target.value)}
              className="w-full bg-[#181c2b] border border-white/10 rounded-lg px-3 py-2 text-white font-bold"
            />
          </div>
        </div>

        {/* Proprietor & Primary WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Proprietor Name</label>
            <input
              type="text"
              required
              value={proprietor}
              onChange={(e) => setProprietor(e.target.value)}
              className="w-full bg-[#181c2b] border border-white/10 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Primary WhatsApp Number *</label>
            <div className="flex">
              <span className="inline-flex items-center px-2.5 bg-[#202538] border border-r-0 border-white/10 rounded-l-lg text-slate-300 font-bold">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-[#181c2b] border border-white/10 rounded-r-lg px-3 py-2 text-white font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Secondary Phone</label>
            <input
              type="tel"
              value={secondaryPhone}
              onChange={(e) => setSecondaryPhone(e.target.value)}
              className="w-full bg-[#181c2b] border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>
        </div>

        {/* Instagram Profile URL & Support Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Instagram Profile URL</label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full bg-[#181c2b] border border-white/10 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Support Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#181c2b] border border-white/10 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Address & City */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Showroom Address / Highway Landmark</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#181c2b] border border-white/10 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#181c2b] border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#181c2b] border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-[#181c2b] border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Working Business Hours</label>
            <input
              type="text"
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
              className="w-full bg-[#181c2b] border border-white/10 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
