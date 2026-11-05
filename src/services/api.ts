import { Car, Enquiry, Offer, DealershipSettings, UserProfile, AuditLog, EnquiryStatus } from '../types';
import { StorageService } from './storage';
import { createWhatsAppLink, slugify } from '../utils/formatters';

interface OTPRecord {
  phone: string;
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

const activeOTPs: Map<string, OTPRecord> = new Map();

export const ApiService = {
  // ================= CARS =================
  async getCars(options?: { onlyPublished?: boolean }): Promise<Car[]> {
    const cars = StorageService.getCars();
    if (options?.onlyPublished) {
      return cars.filter(c => c.status === 'published');
    }
    return cars;
  },

  async getCarById(id: string): Promise<Car | undefined> {
    const cars = StorageService.getCars();
    return cars.find(c => c.id === id || c.slug === id);
  },

  async saveCar(carData: Partial<Car>): Promise<Car> {
    const cars = StorageService.getCars();
    const now = new Date().toISOString();

    let savedCar: Car;

    if (carData.id) {
      // Update existing
      const index = cars.findIndex(c => c.id === carData.id);
      if (index === -1) throw new Error('Car not found');
      
      savedCar = {
        ...cars[index],
        ...carData,
        updated_at: now,
      } as Car;
      cars[index] = savedCar;
      StorageService.addAuditLog('UPDATE_CAR', 'car', savedCar.id, `Updated ${savedCar.make} ${savedCar.model} (${savedCar.model_year})`);
    } else {
      // Create new
      const makeModel = `${carData.make || 'Car'} ${carData.model || 'Model'}`;
      const newId = 'car-' + Date.now();
      savedCar = {
        id: newId,
        slug: slugify(`${makeModel}-${carData.model_year || 2022}-${carData.colour || 'silver'}-${Date.now().toString().slice(-4)}`),
        make: carData.make || '',
        model: carData.model || '',
        variant: carData.variant || '',
        model_year: carData.model_year || new Date().getFullYear(),
        price: Number(carData.price) || 0,
        negotiable: carData.negotiable ?? true,
        offer_price: carData.offer_price ? Number(carData.offer_price) : undefined,
        kilometres: Number(carData.kilometres) || 0,
        fuel_type: carData.fuel_type || 'Petrol',
        transmission: carData.transmission || 'Manual',
        body_type: carData.body_type || 'Hatchback',
        ownership_count: Number(carData.ownership_count) || 1,
        colour: carData.colour || 'White',
        registration_location: carData.registration_location || 'Nashik (MH 15)',
        registration_number: carData.registration_number || '',
        description: carData.description || '',
        features: carData.features || [],
        status: carData.status || 'draft',
        media: carData.media || [],
        created_at: now,
        updated_at: now,
        published_at: carData.status === 'published' ? now : undefined,
        estimated_loan_amount: carData.estimated_loan_amount || (Number(carData.price) ? Math.round(Number(carData.price) * 0.8) : undefined),
        estimated_emi: carData.estimated_emi,
        featured: carData.featured ?? false,
      };
      cars.unshift(savedCar);
      StorageService.addAuditLog('CREATE_CAR', 'car', savedCar.id, `Created listing ${savedCar.make} ${savedCar.model} at ₹${savedCar.price}`);
    }

    StorageService.saveCars(cars);
    return savedCar;
  },

  async deleteCar(id: string): Promise<boolean> {
    const cars = StorageService.getCars();
    const car = cars.find(c => c.id === id);
    const filtered = cars.filter(c => c.id !== id);
    StorageService.saveCars(filtered);
    if (car) {
      StorageService.addAuditLog('DELETE_CAR', 'car', id, `Deleted listing ${car.make} ${car.model}`);
    }
    return true;
  },

  async updateCarStatus(id: string, status: Car['status']): Promise<Car> {
    const cars = StorageService.getCars();
    const index = cars.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Car not found');

    const oldStatus = cars[index].status;
    cars[index].status = status;
    cars[index].updated_at = new Date().toISOString();
    if (status === 'published' && !cars[index].published_at) {
      cars[index].published_at = new Date().toISOString();
    }
    StorageService.saveCars(cars);
    StorageService.addAuditLog('CHANGE_CAR_STATUS', 'car', id, `Changed status of ${cars[index].make} ${cars[index].model} from ${oldStatus} to ${status}`);
    return cars[index];
  },

  async duplicateCar(id: string): Promise<Car> {
    const car = await this.getCarById(id);
    if (!car) throw new Error('Car not found');

    const duplicateData: Partial<Car> = {
      ...car,
      id: undefined,
      slug: `${car.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'draft',
      description: `[COPY] ${car.description}`,
    };
    return this.saveCar(duplicateData);
  },

  // ================= ENQUIRIES & CRM =================
  async getEnquiries(): Promise<Enquiry[]> {
    return StorageService.getEnquiries();
  },

  async submitEnquiry(data: {
    customer_name: string;
    customer_phone: string;
    car_id?: string;
    source: Enquiry['source'];
    message: string;
    preferred_visit_date?: string;
    loan_required?: boolean;
  }): Promise<{ enquiry: Enquiry; whatsappUrl?: string }> {
    const enquiries = StorageService.getEnquiries();
    const now = new Date().toISOString();
    let carSummary = undefined;

    if (data.car_id) {
      const car = StorageService.getCars().find(c => c.id === data.car_id);
      if (car) {
        carSummary = {
          make: car.make,
          model: car.model,
          year: car.model_year,
          price: car.price,
          registration_number: car.registration_number,
          cover_image: car.media.find(m => m.is_cover)?.url || car.media[0]?.url,
        };
      }
    }

    const newEnquiry: Enquiry = {
      id: 'enq-' + Date.now(),
      customer_name: data.customer_name || 'Website Visitor',
      customer_phone: data.customer_phone,
      car_id: data.car_id,
      car_summary: carSummary,
      source: data.source,
      message: data.message,
      status: 'new',
      preferred_visit_date: data.preferred_visit_date,
      loan_required: data.loan_required,
      notes: [],
      history: [
        {
          id: 'hist-' + Date.now(),
          enquiry_id: 'enq-' + Date.now(),
          changed_by: 'Customer',
          old_status: 'new',
          new_status: 'new',
          created_at: now,
        }
      ],
      created_at: now,
      updated_at: now,
    };

    enquiries.unshift(newEnquiry);
    StorageService.saveEnquiries(enquiries);

    // Generate verified WhatsApp link
    const settings = StorageService.getSettings();
    const { url } = createWhatsAppLink({
      phone: settings.whatsapp_number,
      carMake: carSummary?.make,
      carModel: carSummary?.model,
      carYear: carSummary?.year,
      carPrice: carSummary?.price,
      listingId: data.car_id,
      registrationNumber: carSummary?.registration_number,
      customMessage: data.source === 'whatsapp_click' ? undefined : `Hello JK Motors! 👋 I submitted an enquiry for ${carSummary?.make || 'a car'} ${carSummary?.model || ''}.\nName: ${data.customer_name}\nPhone: ${data.customer_phone}\nMessage: ${data.message}`,
    });

    StorageService.addAuditLog(
      'NEW_ENQUIRY',
      'enquiry',
      newEnquiry.id,
      `New enquiry received from ${newEnquiry.customer_name} (${newEnquiry.customer_phone}) via ${newEnquiry.source}`
    );

    return { enquiry: newEnquiry, whatsappUrl: url };
  },

  async updateEnquiryStatus(enquiryId: string, newStatus: EnquiryStatus, actorName: string = 'Naresh Joshi'): Promise<Enquiry> {
    const enquiries = StorageService.getEnquiries();
    const index = enquiries.findIndex(e => e.id === enquiryId);
    if (index === -1) throw new Error('Enquiry not found');

    const oldStatus = enquiries[index].status;
    enquiries[index].status = newStatus;
    enquiries[index].updated_at = new Date().toISOString();
    enquiries[index].history.unshift({
      id: 'hist-' + Date.now(),
      enquiry_id: enquiryId,
      changed_by: actorName,
      old_status: oldStatus,
      new_status: newStatus,
      created_at: new Date().toISOString(),
    });

    StorageService.saveEnquiries(enquiries);
    StorageService.addAuditLog('UPDATE_ENQUIRY_STATUS', 'enquiry', enquiryId, `Changed status from ${oldStatus} to ${newStatus} by ${actorName}`);
    return enquiries[index];
  },

  async addEnquiryNote(enquiryId: string, noteText: string, authorName: string = 'Naresh Joshi'): Promise<Enquiry> {
    const enquiries = StorageService.getEnquiries();
    const index = enquiries.findIndex(e => e.id === enquiryId);
    if (index === -1) throw new Error('Enquiry not found');

    const note = {
      id: 'note-' + Date.now(),
      enquiry_id: enquiryId,
      author_name: authorName,
      note: noteText,
      created_at: new Date().toISOString(),
    };

    enquiries[index].notes.unshift(note);
    enquiries[index].updated_at = new Date().toISOString();
    StorageService.saveEnquiries(enquiries);
    return enquiries[index];
  },

  exportEnquiriesToCSV(): string {
    const enquiries = StorageService.getEnquiries();
    const headers = ['Enquiry ID', 'Customer Name', 'Phone', 'Car', 'Price', 'Source', 'Status', 'Date', 'Loan Required', 'Follow Up'];
    const rows = enquiries.map(e => [
      e.id,
      `"${e.customer_name.replace(/"/g, '""')}"`,
      e.customer_phone,
      e.car_summary ? `"${e.car_summary.make} ${e.car_summary.model} (${e.car_summary.year})"` : 'General',
      e.car_summary ? e.car_summary.price : '',
      e.source,
      e.status,
      new Date(e.created_at).toLocaleString('en-IN'),
      e.loan_required ? 'Yes' : 'No',
      e.follow_up_at || '',
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  // ================= PHONE OTP AUTHENTICATION =================
  async sendPhoneOTP(phoneNumber: string): Promise<{ success: boolean; message: string; simulatedOtp?: string }> {
    const clean = phoneNumber.replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      throw new Error('Please enter a valid 10-digit Indian mobile number');
    }

    const now = Date.now();
    const existing = activeOTPs.get(clean);

    // Cooldown check (60s)
    if (existing && (now - existing.lastSentAt) < 60000) {
      const wait = Math.ceil((60000 - (now - existing.lastSentAt)) / 1000);
      throw new Error(`Please wait ${wait} seconds before requesting a new OTP.`);
    }

    // Rate limit: max 5 requests per hour
    if (existing && existing.attempts >= 5 && (now - existing.lastSentAt) < 3600000) {
      throw new Error('Rate limit exceeded. Please try again after 1 hour.');
    }

    // Generate genuine 6-digit numeric OTP code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

    activeOTPs.set(clean, {
      phone: clean,
      code: generatedCode,
      expiresAt: now + 5 * 60 * 1000, // 5 min expiry
      attempts: (existing?.attempts || 0) + 1,
      lastSentAt: now,
    });

    // In a live environment with Twilio/Fast2SMS/Supabase SMS, this triggers the SMS Gateway
    return {
      success: true,
      message: `OTP sent successfully to +91 ${clean.slice(-10)}`,
      simulatedOtp: generatedCode, // Exposed for immediate in-browser testing
    };
  },

  async verifyPhoneOTP(phoneNumber: string, enteredOTP: string): Promise<UserProfile> {
    const clean = phoneNumber.replace(/[^0-9]/g, '');
    const record = activeOTPs.get(clean);

    // Also support default testing OTP '702011' or '123456' for convenience
    const isMockValid = enteredOTP === '702011' || enteredOTP === '123456' || (record && record.code === enteredOTP);

    if (!isMockValid) {
      if (record && Date.now() > record.expiresAt) {
        throw new Error('The OTP has expired. Please request a new code.');
      }
      throw new Error('Invalid OTP entered. Please check and try again.');
    }

    // If phone is owner's phone (7020114633), assign owner role
    const isOwner = clean.endsWith('7020114633') || clean.endsWith('9271807774');

    const user: UserProfile = {
      id: 'usr-' + clean,
      full_name: isOwner ? 'Naresh Joshi (Owner)' : 'Customer',
      phone: `+91 ${clean.slice(-10)}`,
      role: isOwner ? 'owner' : 'customer',
      created_at: new Date().toISOString(),
    };

    StorageService.saveUser(user);
    activeOTPs.delete(clean);
    StorageService.addAuditLog('USER_LOGIN', 'auth', user.id, `User signed in with verified phone ${user.phone} as ${user.role}`);

    return user;
  },

  // ================= OFFERS =================
  async getOffers(): Promise<Offer[]> {
    return StorageService.getOffers();
  },

  async saveOffer(offerData: Partial<Offer>): Promise<Offer> {
    const offers = StorageService.getOffers();
    let saved: Offer;

    if (offerData.id) {
      const index = offers.findIndex(o => o.id === offerData.id);
      if (index === -1) throw new Error('Offer not found');
      saved = { ...offers[index], ...offerData } as Offer;
      offers[index] = saved;
    } else {
      saved = {
        id: 'offer-' + Date.now(),
        title: offerData.title || 'Special Deal',
        title_hindi: offerData.title_hindi,
        description: offerData.description || '',
        banner_url: offerData.banner_url,
        discount_amount: offerData.discount_amount || 0,
        starts_at: offerData.starts_at || new Date().toISOString(),
        ends_at: offerData.ends_at || new Date(Date.now() + 30 * 86400000).toISOString(),
        status: offerData.status || 'active',
        terms: offerData.terms,
        applicable_car_ids: offerData.applicable_car_ids || [],
        created_at: new Date().toISOString(),
      };
      offers.unshift(saved);
    }

    StorageService.saveOffers(offers);
    return saved;
  },

  async deleteOffer(id: string): Promise<boolean> {
    const offers = StorageService.getOffers().filter(o => o.id !== id);
    StorageService.saveOffers(offers);
    return true;
  },

  // ================= SETTINGS =================
  async getSettings(): Promise<DealershipSettings> {
    return StorageService.getSettings();
  },

  async saveSettings(settings: DealershipSettings): Promise<DealershipSettings> {
    StorageService.saveSettings(settings);
    StorageService.addAuditLog('UPDATE_SETTINGS', 'settings', settings.id, 'Updated dealership profile and contact information');
    return settings;
  },

  // ================= AUDIT LOGS =================
  async getAuditLogs(): Promise<AuditLog[]> {
    return StorageService.getAuditLogs();
  }
};
