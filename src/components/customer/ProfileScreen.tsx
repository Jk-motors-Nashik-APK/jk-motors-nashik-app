import React, { useState, useEffect } from 'react';
import { 
  User, Phone, LogIn, LogOut, ShieldCheck, 
  Clock, Calendar, CheckCircle2, AlertTriangle, 
  Trash2, FileText, ExternalLink, KeyRound, Sparkles, Send, Check
} from 'lucide-react';
import { UserProfile, Enquiry, DealershipSettings } from '../../types';
import { formatDateTime, formatINR } from '../../utils/formatters';
import { Language, translations } from '../../locales/i18n';
import { ApiService } from '../../services/api';

interface ProfileScreenProps {
  currentUser: UserProfile | null;
  enquiries: Enquiry[];
  settings: DealershipSettings;
  language: Language;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  enquiries,
  settings,
  language,
  onLoginSuccess,
  onLogout,
}) => {
  const t = translations[language];

  // OTP Login Form State
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.full_name || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filter enquiries for this customer (or all recent if demo customer)
  const myEnquiries = currentUser
    ? enquiries.filter(e => e.customer_phone.includes(currentUser.phone.replace(/[^0-9]/g, '').slice(-10)) || e.customer_id === currentUser.id)
    : [];

  // Countdown timer for OTP resend
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (phoneInput.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const res = await ApiService.sendPhoneOTP(phoneInput);
      setStep('otp');
      setCooldown(60);
      if (res.simulatedOtp) {
        setSimulatedCode(res.simulatedOtp);
        setOtpInput(res.simulatedOtp); // Auto-fill for ultra smooth testing
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const user = await ApiService.verifyPhoneOTP(phoneInput, otpInput);
      onLoginSuccess(user);
      setStep('phone');
      setOtpInput('');
      setPhoneInput('');
      setSimulatedCode(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      full_name: editName,
    };
    onLoginSuccess(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const getStatusBadge = (status: Enquiry['status']) => {
    const config: Record<Enquiry['status'], { label: string; color: string; border: string }> = {
      new: { label: 'Received / New', color: 'bg-blue-500/15 text-blue-400', border: 'border-blue-500/30' },
      contacted: { label: 'Contacted by Dealer', color: 'bg-amber-500/15 text-amber-400', border: 'border-amber-500/30' },
      visit_scheduled: { label: 'Visit / Test Drive Confirmed', color: 'bg-purple-500/15 text-purple-400', border: 'border-purple-500/30' },
      negotiation: { label: 'Price Negotiation', color: 'bg-indigo-500/15 text-indigo-400', border: 'border-indigo-500/30' },
      converted: { label: 'Delivered / Converted', color: 'bg-emerald-500/15 text-emerald-400', border: 'border-emerald-500/30' },
      closed: { label: 'Completed / Closed', color: 'bg-slate-500/15 text-slate-400', border: 'border-slate-500/30' },
      spam: { label: 'Ignored', color: 'bg-rose-500/15 text-rose-400', border: 'border-rose-500/30' },
    };
    const c = config[status] || config.new;
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${c.color} ${c.border}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      
      {/* Profile Header or Login Card */}
      {currentUser ? (
        <div className="bg-[#141724] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-lg shadow-lg">
                {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{currentUser.full_name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{currentUser.phone}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-[#1c2030] hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-all flex items-center gap-1.5 text-xs"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Edit Profile Accordion */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="bg-[#0e1017] p-4 rounded-xl border border-white/10 space-y-3">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#1c2030] text-slate-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <span className="text-slate-400">Account verified through Indian Mobile OTP</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-amber-400 hover:underline font-semibold"
              >
                Edit Profile
              </button>
            </div>
          )}

          {savedSuccess && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}
        </div>
      ) : (
        /* OTP Login Card */
        <div className="bg-[#141724] border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Login with Mobile OTP</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Access your test drive appointments, saved vehicle favourites, and direct dealership chat.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* In-app Simulator Banner for Testing */}
          {simulatedCode && (
            <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-xl text-amber-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Simulated SMS Code: <b className="font-mono text-sm tracking-widest text-white">{simulatedCode}</b></span>
              </div>
              <span className="text-[10px] text-slate-400">Auto-filled</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  10-Digit Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-xs bg-[#1f2333] border border-r-0 border-white/10 rounded-l-xl text-slate-300 font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="9822014633"
                    className="w-full bg-[#0c0d12] border border-white/10 rounded-r-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Sending SMS...' : 'Send Verification OTP'}</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Tip: Enter <b>7020114633</b> to test logging in as Dealership Owner
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-300 font-medium">
                    Enter 6-Digit OTP sent to +91 {phoneInput}
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Change Phone
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="6-digit code"
                  className="w-full bg-[#0c0d12] border border-white/10 rounded-xl px-3.5 py-3 text-center text-lg font-mono font-bold tracking-widest text-amber-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLoading ? 'Verifying...' : 'Verify OTP & Sign In'}</span>
              </button>

              <div className="text-center text-xs text-slate-400">
                {cooldown > 0 ? (
                  <span>Resend code in <b className="text-white">{cooldown}s</b></span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="text-amber-400 hover:underline font-semibold"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {/* Submitted Enquiries & Test Drive Status Tracker */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>My Enquiries & Dealership Visits ({myEnquiries.length})</span>
        </h3>

        {myEnquiries.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-[#131622] border border-white/5 text-xs text-slate-400">
            No active enquiries submitted yet. When you request a callback or book a test drive, its real-time CRM status will be tracked here.
          </div>
        ) : (
          <div className="space-y-3">
            {myEnquiries.map((enq) => (
              <div key={enq.id} className="p-4 rounded-xl bg-[#131622] border border-white/10 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">ID: #{enq.id}</span>
                    <h4 className="text-sm font-bold text-white">
                      {enq.car_summary ? `${enq.car_summary.make} ${enq.car_summary.model} (${enq.car_summary.year})` : 'General Dealership Enquiry'}
                    </h4>
                  </div>
                  {getStatusBadge(enq.status)}
                </div>

                <p className="text-xs text-slate-300 bg-black/40 p-2.5 rounded-lg border border-white/5">
                  "{enq.message}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5 flex-wrap gap-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatDateTime(enq.created_at)}
                  </span>
                  {enq.preferred_visit_date && (
                    <span className="text-amber-400 font-medium">
                      Visit: {enq.preferred_visit_date}
                    </span>
                  )}
                  {enq.assigned_to && (
                    <span className="text-slate-300">
                      Assigned: <b>{enq.assigned_to}</b>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dealership Info & Legal */}
      <section className="bg-[#12141e] p-5 rounded-2xl border border-white/5 space-y-3 text-xs text-slate-400">
        <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Dealership & Compliance</h4>
        <div className="space-y-1">
          <p><b>Dealership:</b> {settings.dealership_name} (Prop. {settings.proprietor})</p>
          <p><b>Showroom:</b> {settings.address}, {settings.city}, Maharashtra {settings.pincode}</p>
          <p><b>WhatsApp Hotline:</b> +91 {settings.whatsapp_number}</p>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 text-[11px]">
          <span className="text-slate-400">Verified Pre-Owned Motor Vehicle Dealership</span>
          <div className="flex gap-3 text-amber-400">
            <span className="cursor-pointer hover:underline">Privacy Policy</span>
            <span className="cursor-pointer hover:underline">Terms of Service</span>
            <span className="cursor-pointer hover:underline text-rose-400">Request Data Deletion</span>
          </div>
        </div>
      </section>

    </div>
  );
};
