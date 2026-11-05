import React, { useState } from 'react';
import { Plus, Tag, Calendar, Trash2, Edit3, CheckCircle, Clock } from 'lucide-react';
import { Offer, Car } from '../../types';
import { formatDate } from '../../utils/formatters';

interface AdminOffersManagerProps {
  offers: Offer[];
  cars: Car[];
  onSaveOffer: (offer: Partial<Offer>) => Promise<void>;
  onDeleteOffer: (id: string) => Promise<void>;
}

export const AdminOffersManager: React.FC<AdminOffersManagerProps> = ({
  offers,
  cars,
  onSaveOffer,
  onDeleteOffer,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [titleHindi, setTitleHindi] = useState('');
  const [desc, setDesc] = useState('');
  const [discountAmount, setDiscountAmount] = useState(15000);
  const [terms, setTerms] = useState('Valid on all pre-owned cars booked this month with min ₹10,000 token.');
  const [selectedCarIds, setSelectedCarIds] = useState<string[]>([]);
  const [status, setStatus] = useState<Offer['status']>('active');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveOffer({
      title,
      title_hindi: titleHindi,
      description: desc,
      discount_amount: discountAmount,
      terms,
      applicable_car_ids: selectedCarIds,
      status,
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    });
    setShowModal(false);
    setTitle('');
    setTitleHindi('');
    setDesc('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#131622] p-4 rounded-2xl border border-white/10">
        <div>
          <h3 className="font-bold text-white text-base">Festive Offers & Banners</h3>
          <p className="text-xs text-slate-400">
            Publish discounts and festive financing perks visible to mobile app customers
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Offer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <div key={offer.id} className="p-5 rounded-2xl bg-[#131622] border border-white/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  offer.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-500/15 text-slate-400'
                }`}>
                  {offer.status.toUpperCase()}
                </span>
                <button
                  onClick={() => onDeleteOffer(offer.id)}
                  className="text-slate-400 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="font-bold text-white text-base">{offer.title}</h4>
              {offer.title_hindi && (
                <p className="text-xs text-amber-300 font-medium">{offer.title_hindi}</p>
              )}
              <p className="text-xs text-slate-300">{offer.description}</p>
            </div>

            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Expires: {formatDate(offer.ends_at)}</span>
              <span>{offer.applicable_car_ids.length > 0 ? `${offer.applicable_car_ids.length} cars linked` : 'All cars eligible'}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#131622] border border-white/10 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-white text-base">Create Promotional Offer</h4>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Offer Title (English)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Diwali Dhamaka Free Service"
                  className="w-full bg-[#181c2b] border border-white/10 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Offer Title (Hindi / Marathi)</label>
                <input
                  type="text"
                  value={titleHindi}
                  onChange={(e) => setTitleHindi(e.target.value)}
                  placeholder="e.g. दीवाली धमाका फ्री सर्विस"
                  className="w-full bg-[#181c2b] border border-white/10 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-[#181c2b] border border-white/10 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Terms</label>
                <input
                  type="text"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full bg-[#181c2b] border border-white/10 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#1c2030] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 text-black font-bold"
                >
                  Publish Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
