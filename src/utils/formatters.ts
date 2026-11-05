/**
 * Utilities & Formatters for JK Motors Marketplace
 */

// Format Indian Rupee (e.g. ₹3,49,000 or ₹10.49 Lakh)
export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  
  if (compact) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
  }

  // Standard Indian Numbering System: 1,00,000
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
}

// Format Kilometres (e.g. 70,774 km)
export function formatKm(km: number): string {
  if (!km && km !== 0) return '0 km';
  return `${new Intl.NumberFormat('en-IN').format(km)} km`;
}

// Calculate Monthly Loan EMI
// P = Principal Loan Amount, annualRate = interest rate (e.g. 9.5%), tenureYears = loan period (e.g. 5)
export function calculateEMI(principal: number, annualRate: number = 9.5, tenureYears: number = 5): number {
  if (principal <= 0) return 0;
  const monthlyRate = annualRate / 12 / 100;
  const numberOfMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / 
              (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
  return Math.round(emi);
}

// Format Date & Time in Indian standard
export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Create verified WhatsApp wa.me link with vehicle details
export function createWhatsAppLink(options: {
  phone: string; // e.g. "7020114633"
  carMake?: string;
  carModel?: string;
  carYear?: number;
  carPrice?: number;
  listingId?: string;
  registrationNumber?: string;
  customMessage?: string;
}): { url: string; rawText: string } {
  // Clean phone number: remove +, spaces, dashes, ensure 91 country code for India
  let cleanPhone = options.phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  let text = '';
  if (options.customMessage) {
    text = options.customMessage;
  } else if (options.carMake && options.carModel) {
    const formattedPrice = options.carPrice ? formatINR(options.carPrice) : '';
    const reg = options.registrationNumber ? ` (Reg: ${options.registrationNumber})` : '';
    text = `Hello JK Motors! 👋\nI am interested in buying the *${options.carMake} ${options.carModel} (${options.carYear || ''})*${reg}.\nListed Price: *${formattedPrice}*\nListing ID: #${options.listingId || 'DIRECT'}\n\nPlease share more details, finance options, and availability for a test drive.\nThank you!`;
  } else {
    text = `Hello JK Motors! 👋 I would like to enquire about your available pre-owned cars and finance options.`;
  }

  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`;

  return { url, rawText: text };
}

// Slugify string
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

// Clean and normalize media URLs (strip unnecessary /public/ prefix)
export function formatMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('/public/')) {
    return url.replace('/public/', '/');
  }
  return url;
}

