import React, { useState } from 'react';
import { 
  LayoutDashboard, Car as CarIcon, MessageSquare, Tag, 
  Settings as SettingsIcon, ShieldCheck, ArrowLeft, Plus, 
  ExternalLink, Bell, Code2, Phone, LogOut, Check
} from 'lucide-react';
import { AdminOverview } from './AdminOverview';
import { AdminCarManager } from './AdminCarManager';
import { CarFormModal } from './CarFormModal';
import { AdminEnquiriesCRM } from './AdminEnquiriesCRM';
import { AdminOffersManager } from './AdminOffersManager';
import { AdminSettings } from './AdminSettings';
import { AdminAuditLogs } from './AdminAuditLogs';
import { Car, Enquiry, Offer, DealershipSettings, AuditLog, CarStatus } from '../../types';
import { JKMotorsLogo } from '../common/JKMotorsLogo';

interface AdminDashboardProps {
  cars: Car[];
  enquiries: Enquiry[];
  offers: Offer[];
  settings: DealershipSettings;
  auditLogs: AuditLog[];
  onBackToCustomerApp: () => void;
  onOpenFlutterHub: () => void;
  onSaveCar: (carData: Partial<Car>) => Promise<void>;
  onDeleteCar: (id: string) => Promise<void>;
  onUpdateCarStatus: (id: string, status: CarStatus) => Promise<void>;
  onDuplicateCar: (id: string) => Promise<void>;
  onSaveOffer: (offerData: Partial<Offer>) => Promise<void>;
  onDeleteOffer: (id: string) => Promise<void>;
  onSaveSettings: (settings: DealershipSettings) => Promise<void>;
  onRefreshData: () => void;
  onPreviewCar: (car: Car) => void;
}

export type AdminTab = 'overview' | 'cars' | 'enquiries' | 'offers' | 'settings' | 'audit';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  cars,
  enquiries,
  offers,
  settings,
  auditLogs,
  onBackToCustomerApp,
  onOpenFlutterHub,
  onSaveCar,
  onDeleteCar,
  onUpdateCarStatus,
  onDuplicateCar,
  onSaveOffer,
  onDeleteOffer,
  onSaveSettings,
  onRefreshData,
  onPreviewCar,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showCarModal, setShowCarModal] = useState(false);
  const [carToEdit, setCarToEdit] = useState<Car | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const handleEditCar = (car: Car) => {
    setCarToEdit(car);
    setShowCarModal(true);
  };

  const handleAddNewCar = () => {
    setCarToEdit(null);
    setShowCarModal(true);
  };

  const handleSelectEnquiryFromOverview = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setActiveTab('enquiries');
  };

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'cars', label: 'Car Inventory', icon: <CarIcon className="w-4 h-4" />, badge: cars.length },
    { id: 'enquiries', label: 'Enquiry CRM', icon: <MessageSquare className="w-4 h-4" />, badge: enquiries.filter(e => e.status === 'new').length },
    { id: 'offers', label: 'Offers & Banners', icon: <Tag className="w-4 h-4" /> },
    { id: 'settings', label: 'Dealership Settings', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'audit', label: 'Security & Audit', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col">
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0d1018]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          
          {/* Identity & Back Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onBackToCustomerApp}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#181c2b] hover:bg-[#202538] text-slate-300 hover:text-white border border-white/10 transition-all font-semibold cursor-pointer"
              title="Return to Showroom Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to App</span>
              <span className="sm:hidden">Back</span>
            </button>

            {/* Clickable Dealership Logo linking back to Customer Home Screen */}
            <button
              onClick={onBackToCustomerApp}
              className="flex items-center gap-2 group text-left cursor-pointer transition-all hover:opacity-95 focus:outline-none"
              title="Return to JK Motors Showroom Home"
              aria-label="Return to JK Motors Showroom Home"
            >
              <div className="group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                <JKMotorsLogo
                  size="sm"
                  variant="gold"
                  glow={true}
                  logoUrl={settings.logo_url}
                />
              </div>
              <div className="hidden xs:block sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white tracking-wide uppercase text-xs sm:text-sm group-hover:text-amber-300 transition-colors">
                    {settings.dealership_name}
                  </span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold hidden sm:inline">
                    ADMIN
                  </span>
                </div>
                <span className="text-[10px] text-amber-400 block font-semibold leading-none group-hover:text-amber-300 transition-colors">
                  Owner Portal • {settings.proprietor.split(' ')[0]}
                </span>
              </div>
            </button>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFlutterHub}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 transition-all font-semibold text-xs"
              title="Flutter App Code & Supabase Backend Arch"
            >
              <Code2 className="w-4 h-4" />
              <span>Flutter Source & Supabase</span>
            </button>

            <button
              onClick={handleAddNewCar}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Car</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Tab Bar */}
      <div className="bg-[#0f121b] border-b border-white/10 px-4">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto no-scrollbar py-2 text-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-black text-amber-400' : 'bg-white/10 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <AdminOverview
            cars={cars}
            enquiries={enquiries}
            settings={settings}
            onNavigateToTab={(tab) => setActiveTab(tab as AdminTab)}
            onAddNewCar={handleAddNewCar}
            onSelectEnquiry={handleSelectEnquiryFromOverview}
          />
        )}

        {activeTab === 'cars' && (
          <AdminCarManager
            cars={cars}
            settings={settings}
            onAddNewCar={handleAddNewCar}
            onEditCar={handleEditCar}
            onDuplicateCar={onDuplicateCar}
            onDeleteCar={onDeleteCar}
            onUpdateStatus={onUpdateCarStatus}
            onPreviewCar={onPreviewCar}
          />
        )}

        {activeTab === 'enquiries' && (
          <AdminEnquiriesCRM
            enquiries={enquiries}
            settings={settings}
            onRefresh={onRefreshData}
            selectedEnquiryFromOverview={selectedEnquiry}
          />
        )}

        {activeTab === 'offers' && (
          <AdminOffersManager
            offers={offers}
            cars={cars}
            onSaveOffer={onSaveOffer}
            onDeleteOffer={onDeleteOffer}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onSaveSettings={onSaveSettings}
          />
        )}

        {activeTab === 'audit' && (
          <AdminAuditLogs
            logs={auditLogs}
          />
        )}
      </main>

      {/* Car Form Modal (Add / Edit) */}
      {showCarModal && (
        <CarFormModal
          carToEdit={carToEdit}
          onSave={onSaveCar}
          onClose={() => setShowCarModal(false)}
        />
      )}

    </div>
  );
};
