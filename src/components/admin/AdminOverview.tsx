import React from 'react';
import { 
  Car as CarIcon, DollarSign, MessageSquare, CheckCircle, 
  Clock, AlertCircle, ArrowUpRight, Plus, Eye, TrendingUp, Users, Calendar
} from 'lucide-react';
import { Car, Enquiry, DealershipSettings } from '../../types';
import { formatINR, formatDateTime } from '../../utils/formatters';

interface AdminOverviewProps {
  cars: Car[];
  enquiries: Enquiry[];
  settings: DealershipSettings;
  onNavigateToTab: (tab: string) => void;
  onAddNewCar: () => void;
  onSelectEnquiry: (enquiry: Enquiry) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  cars,
  enquiries,
  settings,
  onNavigateToTab,
  onAddNewCar,
  onSelectEnquiry,
}) => {
  const publishedCars = cars.filter(c => c.status === 'published');
  const soldCars = cars.filter(c => c.status === 'sold');
  const reservedCars = cars.filter(c => c.status === 'reserved');
  const draftCars = cars.filter(c => c.status === 'draft');

  // Valuation
  const totalStockValuation = publishedCars.reduce((acc, c) => acc + c.price, 0);

  // Enquiry status counts
  const newEnquiries = enquiries.filter(e => e.status === 'new');
  const activeNegotiations = enquiries.filter(e => e.status === 'negotiation' || e.status === 'visit_scheduled');
  const convertedEnquiries = enquiries.filter(e => e.status === 'converted');

  const recentEnquiries = enquiries.slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141724] border border-white/10 rounded-2xl p-5 shadow-lg">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            Dealership Admin Terminal
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            {settings.dealership_name} • Command Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Proprietor: {settings.proprietor} | WhatsApp: +91 {settings.whatsapp_number}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onAddNewCar}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </button>

          <button
            onClick={() => onNavigateToTab('enquiries')}
            className="px-3.5 py-2.5 rounded-xl bg-[#1d2233] hover:bg-[#252b40] text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>CRM Pipeline</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Published Inventory */}
        <div className="p-4 rounded-xl bg-[#131622] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Available Stock</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white">{publishedCars.length} Cars</span>
            <p className="text-[11px] text-slate-400 mt-0.5">{cars.length} Total Registered</p>
          </div>
        </div>

        {/* Valuation of Published Stock */}
        <div className="p-4 rounded-xl bg-[#131622] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Stock Valuation</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-amber-400 font-mono">{formatINR(totalStockValuation, true)}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Across {publishedCars.length} published units</p>
          </div>
        </div>

        {/* New Unread Enquiries */}
        <div className="p-4 rounded-xl bg-[#131622] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>New Inquiries</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-blue-400">{newEnquiries.length} New</span>
            <p className="text-[11px] text-slate-400 mt-0.5">{enquiries.length} Total recorded</p>
          </div>
        </div>

        {/* Total Deliveries & Sold */}
        <div className="p-4 rounded-xl bg-[#131622] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Sold & Delivered</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-purple-400">{soldCars.length} Units</span>
            <p className="text-[11px] text-slate-400 mt-0.5">{reservedCars.length} Currently Reserved</p>
          </div>
        </div>
      </div>

      {/* Pipeline Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inventory Status Breakdown */}
        <div className="p-5 rounded-2xl bg-[#131622] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Inventory Breakdown</h3>
            <button
              onClick={() => onNavigateToTab('cars')}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              Manage Cars
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#181c2b] border border-white/5">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Published & Available
              </span>
              <span className="font-bold text-white">{publishedCars.length}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#181c2b] border border-white/5">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                Customer Delivered (Sold)
              </span>
              <span className="font-bold text-white">{soldCars.length}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#181c2b] border border-white/5">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Deposit Reserved
              </span>
              <span className="font-bold text-white">{reservedCars.length}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#181c2b] border border-white/5">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                Unpublished Drafts
              </span>
              <span className="font-bold text-white">{draftCars.length}</span>
            </div>
          </div>
        </div>

        {/* Recent Enquiries CRM Stream */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#131622] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Latest Customer Enquiries</h3>
            <button
              onClick={() => onNavigateToTab('enquiries')}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              Open Full CRM ({enquiries.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {recentEnquiries.map((enq) => (
              <div
                key={enq.id}
                onClick={() => onSelectEnquiry(enq)}
                className="p-3 rounded-xl bg-[#181c2b] hover:bg-[#202538] border border-white/5 hover:border-amber-400/30 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{enq.customer_name}</span>
                    <span className="text-[10px] font-mono text-slate-400">+91 {enq.customer_phone}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/15 text-amber-300 uppercase">
                      {enq.source}
                    </span>
                  </div>
                  <p className="text-slate-400 truncate max-w-md">
                    {enq.car_summary ? `${enq.car_summary.make} ${enq.car_summary.model} (${enq.car_summary.year})` : 'General Inquiry'} — "{enq.message}"
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-200">
                    {enq.status}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-1">
                    {formatDateTime(enq.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
