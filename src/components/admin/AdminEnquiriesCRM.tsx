import React, { useState } from 'react';
import { 
  Search, Download, MessageSquare, Phone, Calendar, 
  Clock, CheckCircle, Plus, Send, User, ChevronRight, MessageCircle, FileText, X
} from 'lucide-react';
import { Enquiry, EnquiryStatus, DealershipSettings } from '../../types';
import { formatDateTime, formatINR } from '../../utils/formatters';
import { ApiService } from '../../services/api';

interface AdminEnquiriesCRMProps {
  enquiries: Enquiry[];
  settings: DealershipSettings;
  onRefresh: () => void;
  selectedEnquiryFromOverview?: Enquiry | null;
}

export const AdminEnquiriesCRM: React.FC<AdminEnquiriesCRMProps> = ({
  enquiries,
  settings,
  onRefresh,
  selectedEnquiryFromOverview,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(selectedEnquiryFromOverview || null);
  const [noteInput, setNoteInput] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('Naresh Joshi');

  const filtered = enquiries.filter((e) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCustomer = e.customer_name.toLowerCase().includes(q) || e.customer_phone.includes(q);
      const matchCar = e.car_summary ? `${e.car_summary.make} ${e.car_summary.model}`.toLowerCase().includes(q) : false;
      if (!matchCustomer && !matchCar) return false;
    }
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = async (enquiryId: string, newStatus: EnquiryStatus) => {
    await ApiService.updateEnquiryStatus(enquiryId, newStatus);
    onRefresh();
    if (activeEnquiry && activeEnquiry.id === enquiryId) {
      setActiveEnquiry(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnquiry || !noteInput.trim()) return;
    const updated = await ApiService.addEnquiryNote(activeEnquiry.id, noteInput.trim(), assignedStaff);
    setActiveEnquiry(updated);
    setNoteInput('');
    onRefresh();
  };

  const handleExportCSV = () => {
    const csvContent = ApiService.exportEnquiriesToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `JK_Motors_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const kanbanColumns: { status: EnquiryStatus; title: string; color: string }[] = [
    { status: 'new', title: 'New Leads', color: 'border-blue-500/40 text-blue-400' },
    { status: 'contacted', title: 'Contacted', color: 'border-amber-500/40 text-amber-400' },
    { status: 'visit_scheduled', title: 'Visit Scheduled', color: 'border-purple-500/40 text-purple-400' },
    { status: 'negotiation', title: 'Negotiation', color: 'border-indigo-500/40 text-indigo-400' },
    { status: 'converted', title: 'Delivered / Converted', color: 'border-emerald-500/40 text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Filter and CSV Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131622] p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, phone or car..."
              className="w-full bg-[#171a26] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#171a26] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Stages ({enquiries.length})</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="visit_scheduled">Visit Scheduled</option>
            <option value="negotiation">Negotiation</option>
            <option value="converted">Converted</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#171a26] border border-white/10 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pipeline Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'table' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#1d2233] hover:bg-[#252b40] text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Download CSV export"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Kanban Pipeline View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colEnquiries = filtered.filter(e => e.status === col.status);
            return (
              <div key={col.status} className="bg-[#111420] border border-white/10 rounded-2xl p-3 flex flex-col space-y-3 min-w-[220px]">
                <div className={`flex items-center justify-between pb-2 border-b ${col.color}`}>
                  <span className="text-xs font-bold uppercase tracking-wider">{col.title}</span>
                  <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-white">
                    {colEnquiries.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] no-scrollbar">
                  {colEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      onClick={() => setActiveEnquiry(enq)}
                      className={`p-3 rounded-xl bg-[#171a26] hover:bg-[#1f2436] border transition-all cursor-pointer space-y-2 text-xs ${
                        activeEnquiry?.id === enq.id ? 'border-amber-400 ring-1 ring-amber-400/40' : 'border-white/5'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-white text-xs">{enq.customer_name}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-slate-400 uppercase">
                          {enq.source}
                        </span>
                      </div>

                      <p className="text-[11px] text-amber-400 font-medium truncate">
                        {enq.car_summary ? `${enq.car_summary.make} ${enq.car_summary.model}` : 'General Inquiry'}
                      </p>

                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        "{enq.message}"
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-slate-500">
                        <span>+91 {enq.customer_phone}</span>
                        <span>{enq.notes.length} notes</span>
                      </div>
                    </div>
                  ))}

                  {colEnquiries.length === 0 && (
                    <div className="p-4 text-center text-slate-500 text-[11px] border border-dashed border-white/5 rounded-xl">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#131622] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0e1017] border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-3">Vehicle</th>
                  <th className="py-3.5 px-3">Source & Message</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#181c2b] transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-white text-sm">{enq.customer_name}</span>
                        <p className="text-slate-400 font-mono text-[11px]">+91 {enq.customer_phone}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      {enq.car_summary ? (
                        <div>
                          <span className="font-medium text-white">{enq.car_summary.make} {enq.car_summary.model}</span>
                          <p className="text-amber-400 font-mono text-[11px]">{formatINR(enq.car_summary.price)}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">General Inquiry</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 max-w-xs">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-amber-300 uppercase mr-1.5">
                        {enq.source}
                      </span>
                      <span className="text-slate-300 line-clamp-1">"{enq.message}"</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                        className="bg-[#181c2b] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="visit_scheduled">Visit Scheduled</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="converted">Delivered (Converted)</option>
                        <option value="closed">Closed</option>
                        <option value="spam">Spam</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/91${enq.customer_phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${enq.customer_name}, this is Naresh Joshi from JK Motors Nashik regarding your enquiry.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setActiveEnquiry(enq)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiry Detail Drawer / Modal */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#111420] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-white text-base">
                  Enquiry from {activeEnquiry.customer_name}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: #{activeEnquiry.id} • Received: {formatDateTime(activeEnquiry.created_at)}
                </span>
              </div>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <a
                href={`tel:${activeEnquiry.customer_phone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-[#1c202e] hover:bg-[#252b3d] text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call +91 {activeEnquiry.customer_phone}</span>
              </a>

              <a
                href={`https://wa.me/91${activeEnquiry.customer_phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${activeEnquiry.customer_name}, this is Naresh Joshi from JK Motors Nashik regarding your enquiry.`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp Customer</span>
              </a>
            </div>

            {/* Status Selector */}
            <div className="bg-[#171a26] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Stage Status:</span>
              <select
                value={activeEnquiry.status}
                onChange={(e) => handleStatusChange(activeEnquiry.id, e.target.value as EnquiryStatus)}
                className="bg-[#0e1017] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-bold focus:outline-none"
              >
                <option value="new">New Lead</option>
                <option value="contacted">Contacted by Staff</option>
                <option value="visit_scheduled">Visit / Test Drive Scheduled</option>
                <option value="negotiation">Price Negotiation</option>
                <option value="converted">Delivered / Converted</option>
                <option value="closed">Closed</option>
                <option value="spam">Spam</option>
              </select>
            </div>

            {/* Vehicle Information */}
            {activeEnquiry.car_summary && (
              <div className="p-3 rounded-xl bg-[#171a26] border border-white/5 space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Interested Vehicle</span>
                <p className="font-bold text-white text-sm">
                  {activeEnquiry.car_summary.make} {activeEnquiry.car_summary.model} ({activeEnquiry.car_summary.year})
                </p>
                <p className="text-amber-400 font-mono font-bold">
                  Price: {formatINR(activeEnquiry.car_summary.price)} • Reg: {activeEnquiry.car_summary.registration_number || 'MH 15'}
                </p>
              </div>
            )}

            {/* Customer Message */}
            <div className="p-3 rounded-xl bg-[#0e1017] border border-white/5 space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Customer Note</span>
              <p className="text-slate-200 leading-relaxed italic">
                "{activeEnquiry.message}"
              </p>
              {activeEnquiry.preferred_visit_date && (
                <p className="text-amber-300 font-medium text-[11px] pt-1">
                  Requested Visit: <b>{activeEnquiry.preferred_visit_date}</b>
                </p>
              )}
            </div>

            {/* Internal Notes & CRM Activity */}
            <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
              <span className="font-bold text-white text-xs block">Internal Staff Notes ({activeEnquiry.notes.length})</span>
              
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add note (e.g. Offered ₹10k discount, loan approved via SBI)..."
                  className="flex-1 bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
                >
                  Save Note
                </button>
              </form>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {activeEnquiry.notes.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-[#171a26] border border-white/5 text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-bold text-slate-300">{n.author_name}</span>
                      <span>{formatDateTime(n.created_at)}</span>
                    </div>
                    <p className="text-slate-200">{n.note}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
