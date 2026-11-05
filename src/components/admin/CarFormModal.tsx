import React, { useState, useRef } from 'react';
import { 
  X, Upload, Plus, Trash2, Star, Play, 
  CheckCircle2, AlertCircle, Image as ImageIcon, Save, Video
} from 'lucide-react';
import { Car, CarMedia, FuelType, TransmissionType, BodyType, CarStatus } from '../../types';
import { formatINR } from '../../utils/formatters';

interface CarFormModalProps {
  carToEdit?: Car | null;
  onSave: (carData: Partial<Car>) => Promise<void>;
  onClose: () => void;
}

export const CarFormModal: React.FC<CarFormModalProps> = ({
  carToEdit,
  onSave,
  onClose,
}) => {
  // Form fields
  const [make, setMake] = useState(carToEdit?.make || '');
  const [model, setModel] = useState(carToEdit?.model || '');
  const [variant, setVariant] = useState(carToEdit?.variant || '');
  const [modelYear, setModelYear] = useState<number>(carToEdit?.model_year || 2018);
  const [regYear, setRegYear] = useState<number | undefined>(carToEdit?.registration_year || carToEdit?.model_year || 2018);
  const [price, setPrice] = useState<number>(carToEdit?.price || 400000);
  const [negotiable, setNegotiable] = useState(carToEdit?.negotiable ?? true);
  const [offerPrice, setOfferPrice] = useState<number | undefined>(carToEdit?.offer_price);
  const [kilometres, setKilometres] = useState<number>(carToEdit?.kilometres || 60000);
  const [fuelType, setFuelType] = useState<FuelType>(carToEdit?.fuel_type || 'Petrol');
  const [transmission, setTransmission] = useState<TransmissionType>(carToEdit?.transmission || 'Manual');
  const [bodyType, setBodyType] = useState<BodyType>(carToEdit?.body_type || 'Hatchback');
  const [ownershipCount, setOwnershipCount] = useState<number>(carToEdit?.ownership_count || 1);
  const [colour, setColour] = useState(carToEdit?.colour || 'White');
  const [regLocation, setRegLocation] = useState(carToEdit?.registration_location || 'Nashik (MH 15)');
  const [regNumber, setRegNumber] = useState(carToEdit?.registration_number || '');
  const [description, setDescription] = useState(carToEdit?.description || '');
  const [status, setStatus] = useState<CarStatus>(carToEdit?.status || 'draft');
  const [featured, setFeatured] = useState(carToEdit?.featured ?? false);

  // Features list
  const [features, setFeatures] = useState<string[]>(
    carToEdit?.features || [
      'Single Owner Non-Accidental',
      'Chilling AC & Heater',
      'Power Steering & Power Windows',
      'Central Locking with Key'
    ]
  );
  const [newFeatureText, setNewFeatureText] = useState('');

  // Media list
  const [mediaList, setMediaList] = useState<CarMedia[]>(carToEdit?.media || []);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaTypeInput, setMediaTypeInput] = useState<'image' | 'video'>('image');

  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddMediaUrl = () => {
    if (!mediaUrlInput.trim()) return;
    const newMedia: CarMedia = {
      id: 'med-' + Date.now(),
      car_id: carToEdit?.id || 'temp',
      media_type: mediaTypeInput,
      url: mediaUrlInput.trim(),
      display_order: mediaList.length + 1,
      is_cover: mediaList.length === 0, // First media is cover by default
    };
    setMediaList([...mediaList, newMedia]);
    setMediaUrlInput('');
  };

  const handleSetCover = (index: number) => {
    const updated = mediaList.map((m, i) => ({
      ...m,
      is_cover: i === index,
    }));
    setMediaList(updated);
  };

  const handleRemoveMedia = (index: number) => {
    const updated = mediaList.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some(m => m.is_cover)) {
      updated[0].is_cover = true;
    }
    setMediaList(updated);
  };

  // Mock / Local File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Create local object URL for instant preview
      const objectUrl = URL.createObjectURL(file);
      const isVid = file.type.startsWith('video');

      const newMedia: CarMedia = {
        id: 'upload-' + Date.now() + '-' + i,
        car_id: carToEdit?.id || 'temp',
        media_type: isVid ? 'video' : 'image',
        url: objectUrl,
        display_order: mediaList.length + i + 1,
        is_cover: mediaList.length === 0 && i === 0,
        mime_type: file.type,
        file_size_bytes: file.size,
      };
      setMediaList(prev => [...prev, newMedia]);
    }
  };

  const handleSubmit = async (targetStatus: CarStatus) => {
    setValidationError('');

    // Strict validation if publishing
    if (targetStatus === 'published') {
      if (!make.trim() || !model.trim()) {
        setValidationError('Make and Model are mandatory fields.');
        return;
      }
      if (price <= 0) {
        setValidationError('Price must be greater than zero.');
        return;
      }
      if (kilometres < 0) {
        setValidationError('Kilometres cannot be negative.');
        return;
      }
      if (modelYear < 1995 || modelYear > 2027) {
        setValidationError('Please enter a valid model year.');
        return;
      }
      if (mediaList.length === 0) {
        setValidationError('At least one vehicle image or video walkaround is required to publish.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSave({
        id: carToEdit?.id,
        make: make.trim(),
        model: model.trim(),
        variant: variant.trim(),
        model_year: Number(modelYear),
        registration_year: regYear ? Number(regYear) : undefined,
        price: Number(price),
        negotiable,
        offer_price: offerPrice ? Number(offerPrice) : undefined,
        kilometres: Number(kilometres),
        fuel_type: fuelType,
        transmission,
        body_type: bodyType,
        ownership_count: Number(ownershipCount),
        colour: colour.trim(),
        registration_location: regLocation.trim(),
        registration_number: regNumber.trim().toUpperCase(),
        description: description.trim(),
        features,
        status: targetStatus,
        media: mediaList,
        featured,
      });
      onClose();
    } catch (err: any) {
      setValidationError(err.message || 'Failed to save vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#111420] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0c0d12]">
          <div>
            <h3 className="font-extrabold text-lg text-white">
              {carToEdit ? `Edit: ${carToEdit.make} ${carToEdit.model}` : 'Add New Vehicle to Inventory'}
            </h3>
            <p className="text-xs text-slate-400">
              JK Motors Nashik • Certified Stock Catalog
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
          
          {validationError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section: Basic Vehicle Identity */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              1. Basic Information (Mandatory)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Make / Brand *</label>
                <input
                  type="text"
                  required
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Maruti Suzuki, Kia, Renault"
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Model Name *</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Celerio, Seltos, Duster"
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Variant / Trim</label>
                <input
                  type="text"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  placeholder="e.g. VXi, GTX+ Sunroof, RxZ"
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Model Year *</label>
                <input
                  type="number"
                  required
                  min="2000"
                  max="2027"
                  value={modelYear}
                  onChange={(e) => setModelYear(Number(e.target.value))}
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Price (₹ INR) *</label>
                <input
                  type="number"
                  required
                  min="10000"
                  step="5000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Kilometres Driven *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={kilometres}
                  onChange={(e) => setKilometres(Number(e.target.value))}
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Ownership</label>
                <select
                  value={ownershipCount}
                  onChange={(e) => setOwnershipCount(Number(e.target.value))}
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={1}>1st Owner (Single Handed)</option>
                  <option value={2}>2nd Owner</option>
                  <option value={3}>3rd Owner</option>
                  <option value={4}>4th+ Owner</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Fuel Type *</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as FuelType)}
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Transmission *</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Body Type</label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value as BodyType)}
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Compact SUV">Compact SUV</option>
                  <option value="MUV">MUV</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Colour</label>
                <input
                  type="text"
                  value={colour}
                  onChange={(e) => setColour(e.target.value)}
                  placeholder="e.g. Superior White"
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section: Registration & Negotiation */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              2. Registration & Negotiation Settings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">RTO Registration No.</label>
                <input
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="e.g. MH 15 FN 0155"
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Registration Location</label>
                <input
                  type="text"
                  value={regLocation}
                  onChange={(e) => setRegLocation(e.target.value)}
                  placeholder="e.g. Nashik (MH 15)"
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Special Offer Price (Optional)</label>
                <input
                  type="number"
                  value={offerPrice || ''}
                  onChange={(e) => setOfferPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 339000"
                  className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 rounded"
                />
                <span>Price Negotiable on Table</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 rounded"
                />
                <span>Show in Featured Carousel</span>
              </label>
            </div>
          </div>

          {/* Section: Description & Features */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              3. Description & Highlights
            </h4>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Detailed Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe vehicle condition, tyres, service history, loan eligibility, etc."
                className="w-full bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Key Features & Amenities</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  placeholder="Type feature (e.g. Sunroof, Touchscreen, New Tyres) and press Enter"
                  className="flex-1 bg-[#171a26] border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-bold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {features.map((feat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1d2133] border border-white/10 text-slate-300 text-[11px]"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(i)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Media & Video Walkaround Manager */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
                4. Photos & Walkaround Video Manager ({mediaList.length})
              </h4>
              <span className="text-[10px] text-slate-400">
                At least 1 cover item required to publish
              </span>
            </div>

            {/* Media Add Controls */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={mediaUrlInput}
                onChange={(e) => setMediaUrlInput(e.target.value)}
                placeholder="Enter image or MP4 video URL/path (e.g. /assets/aistudio/...)"
                className="flex-1 bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
              <select
                value={mediaTypeInput}
                onChange={(e) => setMediaTypeInput(e.target.value as any)}
                className="bg-[#171a26] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none"
              >
                <option value="image">Image</option>
                <option value="video">Video Walkaround</option>
              </select>
              <button
                type="button"
                onClick={handleAddMediaUrl}
                className="px-4 py-2 rounded-lg bg-[#20263b] hover:bg-[#2a334f] text-slate-200 border border-white/10 font-bold whitespace-nowrap"
              >
                Add Link
              </button>

              {/* Upload from Computer button */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/mp4"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Files</span>
              </button>
            </div>

            {/* Media Gallery Grid */}
            {mediaList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {mediaList.map((med, idx) => (
                  <div
                    key={med.id || idx}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border bg-black group ${
                      med.is_cover ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-white/10'
                    }`}
                  >
                    {med.media_type === 'video' ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-slate-950">
                        <video src={med.url} className="w-full h-full object-cover opacity-60" />
                        <Play className="w-6 h-6 text-amber-400 fill-amber-400 absolute" />
                        <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-black/80 px-1.5 py-0.5 rounded text-amber-300 font-bold">
                          VIDEO
                        </span>
                      </div>
                    ) : (
                      <img src={med.url} alt="media preview" className="w-full h-full object-cover" />
                    )}

                    {/* Cover badge */}
                    {med.is_cover && (
                      <span className="absolute top-1.5 left-1.5 bg-amber-500 text-black font-extrabold text-[9px] px-2 py-0.5 rounded shadow">
                        COVER
                      </span>
                    )}

                    {/* Actions overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      {!med.is_cover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(idx)}
                          className="p-1.5 rounded-lg bg-amber-500 text-black text-[10px] font-bold"
                          title="Set as Cover"
                        >
                          <Star className="w-3.5 h-3.5 fill-black" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(idx)}
                        className="p-1.5 rounded-lg bg-rose-600 text-white"
                        title="Delete Media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-4 border-t border-white/10 bg-[#0c0d12] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#1a1d2b] hover:bg-[#22273a] text-slate-300 text-xs font-bold"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2.5 rounded-xl bg-[#202538] hover:bg-[#2a314a] text-slate-200 text-xs font-bold border border-white/10"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('published')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{carToEdit ? 'Update & Publish' : 'Publish to Catalog'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
