import React, { useState } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Copy, Eye, 
  Play, CheckCircle, Clock, ShieldAlert, AlertTriangle, ExternalLink 
} from 'lucide-react';
import { Car, CarStatus, DealershipSettings } from '../../types';
import { formatINR, formatKm } from '../../utils/formatters';

interface AdminCarManagerProps {
  cars: Car[];
  settings: DealershipSettings;
  onAddNewCar: () => void;
  onEditCar: (car: Car) => void;
  onDuplicateCar: (id: string) => void;
  onDeleteCar: (id: string) => void;
  onUpdateStatus: (id: string, status: CarStatus) => void;
  onPreviewCar: (car: Car) => void;
}

export const AdminCarManager: React.FC<AdminCarManagerProps> = ({
  cars,
  settings,
  onAddNewCar,
  onEditCar,
  onDuplicateCar,
  onDeleteCar,
  onUpdateStatus,
  onPreviewCar,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);

  const filtered = cars.filter(car => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = `${car.make} ${car.model} ${car.variant || ''}`.toLowerCase().includes(q);
      const matchReg = car.registration_number?.toLowerCase().includes(q);
      if (!matchName && !matchReg) return false;
    }
    if (statusFilter !== 'all' && car.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: CarStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Published</span>;
      case 'sold':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">Customer Delivered</span>;
      case 'reserved':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Reserved</span>;
      case 'draft':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">Draft</span>;
      case 'archived':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Archived</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Controls & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131622] p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, registration plate..."
              className="w-full bg-[#171a26] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#171a26] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses ({cars.length})</option>
            <option value="published">Published</option>
            <option value="sold">Customer Delivered</option>
            <option value="reserved">Reserved</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        <button
          onClick={onAddNewCar}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Car</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#131622] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1017] border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Vehicle & Media</th>
                <th className="py-3.5 px-3">Specs</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((car) => {
                const cover = car.media.find(m => m.is_cover)?.url || car.media[0]?.url;
                const hasVideo = car.media.some(m => m.media_type === 'video');

                return (
                  <tr key={car.id} className="hover:bg-[#181c2b] transition-colors">
                    {/* Vehicle */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 border border-white/10">
                          {car.media[0]?.media_type === 'video' ? (
                            <div className="w-full h-full relative flex items-center justify-center bg-black">
                              <video src={car.media[0].url} className="w-full h-full object-cover opacity-60" />
                              <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400 absolute" />
                            </div>
                          ) : (
                            <img src={cover} alt={car.model} className="w-full h-full object-cover" />
                          )}
                          {hasVideo && (
                            <span className="absolute bottom-0 right-0 bg-rose-600 text-white text-[8px] font-bold px-1 rounded-tl">
                              REEL
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">
                              {car.make} {car.model}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({car.model_year})
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px]">
                            {car.variant || 'Standard'} • Reg: <b className="text-slate-300 font-mono">{car.registration_number || 'N/A'}</b>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Specs */}
                    <td className="py-3.5 px-3 text-slate-300">
                      <div>
                        <span>{formatKm(car.kilometres)}</span>
                        <p className="text-[11px] text-slate-400">{car.fuel_type} • {car.transmission}</p>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {formatINR(car.price)}
                      </span>
                      {car.negotiable && (
                        <p className="text-[10px] text-slate-400">Negotiable</p>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-3">
                      <select
                        value={car.status}
                        onChange={(e) => onUpdateStatus(car.id, e.target.value as CarStatus)}
                        className="bg-[#181c2b] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="published">Published (Available)</option>
                        <option value="reserved">Deposit Reserved</option>
                        <option value="sold">Customer Delivered (Sold)</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreviewCar(car)}
                          className="p-1.5 rounded-lg bg-[#181c2b] hover:bg-white/10 text-slate-300 hover:text-white"
                          title="Preview Car Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onEditCar(car)}
                          className="p-1.5 rounded-lg bg-[#181c2b] hover:bg-amber-500/20 text-slate-300 hover:text-amber-400"
                          title="Edit Vehicle"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDuplicateCar(car.id)}
                          className="p-1.5 rounded-lg bg-[#181c2b] hover:bg-blue-500/20 text-slate-300 hover:text-blue-400"
                          title="Duplicate Listing"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setCarToDelete(car)}
                          className="p-1.5 rounded-lg bg-[#181c2b] hover:bg-rose-500/20 text-slate-300 hover:text-rose-400"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {carToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#141724] border border-rose-500/40 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-white text-base">Delete Listing?</h4>
              <p className="text-xs text-slate-300">
                Are you sure you want to delete <b>{carToDelete.make} {carToDelete.model} ({carToDelete.model_year})</b>? This action will remove all attached media from the catalog.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCarToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#1c2030] text-slate-300 text-xs font-bold hover:bg-[#252b40]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteCar(carToDelete.id);
                  setCarToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
