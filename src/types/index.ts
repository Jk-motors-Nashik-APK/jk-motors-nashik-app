export type CarStatus = 'draft' | 'published' | 'reserved' | 'sold' | 'archived';
export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
export type TransmissionType = 'Manual' | 'Automatic';
export type BodyType = 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Compact SUV' | 'Luxury';
export type UserRole = 'customer' | 'staff' | 'owner';

export interface CarMedia {
  id: string;
  car_id: string;
  media_type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
  alt_text?: string;
  display_order: number;
  is_cover: boolean;
  mime_type?: string;
  file_size_bytes?: number;
  duration_seconds?: number;
}

export interface Car {
  id: string;
  slug: string;
  make: string;
  model: string;
  variant?: string;
  model_year: number;
  registration_year?: number;
  price: number;
  negotiable: boolean;
  offer_price?: number;
  kilometres: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  body_type?: BodyType;
  ownership_count: number;
  colour?: string;
  registration_location?: string;
  registration_number?: string;
  description: string;
  features: string[];
  status: CarStatus;
  media: CarMedia[];
  created_at: string;
  updated_at: string;
  published_at?: string;
  estimated_loan_amount?: number;
  estimated_emi?: number;
  featured?: boolean;
}

export type EnquirySource = 'app_form' | 'whatsapp_click' | 'callback' | 'visit_request' | 'other';
export type EnquiryStatus = 'new' | 'contacted' | 'visit_scheduled' | 'negotiation' | 'converted' | 'closed' | 'spam';

export interface EnquiryNote {
  id: string;
  enquiry_id: string;
  author_name: string;
  note: string;
  created_at: string;
}

export interface EnquiryStatusHistory {
  id: string;
  enquiry_id: string;
  changed_by: string;
  old_status: EnquiryStatus;
  new_status: EnquiryStatus;
  created_at: string;
}

export interface Enquiry {
  id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  car_id?: string;
  car_summary?: {
    make: string;
    model: string;
    year: number;
    price: number;
    registration_number?: string;
    cover_image?: string;
  };
  source: EnquirySource;
  message: string;
  status: EnquiryStatus;
  assigned_to?: string;
  follow_up_at?: string;
  notes: EnquiryNote[];
  history: EnquiryStatusHistory[];
  created_at: string;
  updated_at: string;
  preferred_visit_date?: string;
  loan_required?: boolean;
}

export interface Offer {
  id: string;
  title: string;
  title_hindi?: string;
  description: string;
  banner_url?: string;
  discount_amount?: number;
  starts_at: string;
  ends_at: string;
  status: 'draft' | 'scheduled' | 'active' | 'inactive' | 'expired';
  terms?: string;
  applicable_car_ids: string[]; // empty means all cars
  created_at: string;
}

export interface DealershipSettings {
  id: string;
  dealership_name: string;
  dealership_name_hindi?: string;
  proprietor: string;
  whatsapp_number: string;
  secondary_phone: string;
  instagram_url: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  business_hours: string;
  support_email: string;
  privacy_policy_url: string;
  terms_url: string;
  currency: string;
  currency_symbol: string;
  logo_url?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_name: string;
  action: string;
  entity_type: 'car' | 'enquiry' | 'offer' | 'settings' | 'auth';
  entity_id?: string;
  details: string;
  created_at: string;
}

export interface FilterOptions {
  searchQuery: string;
  make: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  maxKm: number;
  ownership: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'km_asc' | 'year_desc';
  onlyWithVideo: boolean;
}
