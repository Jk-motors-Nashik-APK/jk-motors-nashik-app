import { Car, Enquiry, Offer, DealershipSettings, UserProfile, AuditLog } from '../types';

const STORAGE_KEYS = {
  CARS: 'jkmotors_cars_v1',
  ENQUIRIES: 'jkmotors_enquiries_v1',
  OFFERS: 'jkmotors_offers_v1',
  SETTINGS: 'jkmotors_settings_v1',
  USER: 'jkmotors_user_v1',
  FAVOURITES: 'jkmotors_favourites_v1',
  AUDIT_LOGS: 'jkmotors_audit_logs_v1',
};

export const INITIAL_SETTINGS: DealershipSettings = {
  id: 'settings-1',
  dealership_name: 'JK MOTORS',
  dealership_name_hindi: 'जे. के. मोटर्स',
  proprietor: 'Naresh Joshi (नरेश जोशी)',
  whatsapp_number: '7020114633',
  secondary_phone: '9271807774',
  instagram_url: 'https://instagram.com/jkmotors_nashik',
  address: 'Opposite Icon World of Tiles / Triveni Ceramics, Near Nashik Highway',
  city: 'Nashik',
  state: 'Maharashtra',
  pincode: '422009',
  business_hours: 'Monday – Sunday: 9:30 AM to 8:30 PM',
  support_email: 'jkmotors.nashik@gmail.com',
  privacy_policy_url: '/privacy',
  terms_url: '/terms',
  currency: 'INR',
  currency_symbol: '₹',
  logo_url: '/assets/jk-motors-logo.svg',
};

export const INITIAL_CARS: Car[] = [
  {
    id: 'car-celerio-2016',
    slug: 'maruti-suzuki-celerio-vxi-2016-white',
    make: 'Maruti Suzuki',
    model: 'Celerio',
    variant: 'VXi Pure Petrol',
    model_year: 2016,
    registration_year: 2016,
    price: 349000,
    negotiable: true,
    offer_price: 339000,
    kilometres: 70774,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'Hatchback',
    ownership_count: 1,
    colour: 'Superior White',
    registration_location: 'Nashik (MH 15)',
    registration_number: 'MH 15 FN 0155',
    description: 'Dec 2016 Maruti Celerio VXi in pristine showroom condition. Pure petrol single-handed driven with genuine 70,774 km on the odometer. Features chilling air conditioning, dual tone comfortable seat covers, 4 power windows, and Pioneer sound system. Guaranteed non-accidental with full verification. Available for instant delivery with up to ₹3,00,000 loan assistance.',
    features: [
      'Single Owner Pure Petrol',
      'Chilling AC & Heater',
      '4 Power Windows',
      'Pioneer Audio System with USB/AUX',
      'Dual-tone Fabric Seat Covers',
      'Central Locking with Key',
      'Clean Interior & Smooth Clutch',
      'Loan Available up to ₹3,00,000'
    ],
    status: 'published',
    media: [
      {
        id: 'media-celerio-vid',
        car_id: 'car-celerio-2016',
        media_type: 'video',
        url: '/assets/aistudio/VID-20261104-WA0014_2147fa0a.mp4',
        display_order: 1,
        is_cover: true,
        alt_text: 'Maruti Celerio VXi video walkaround by Naresh Joshi',
      },
      {
        id: 'media-celerio-img1',
        car_id: 'car-celerio-2016',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0005_d36d0584.jpg',
        display_order: 2,
        is_cover: false,
        alt_text: 'Maruti Celerio White Exterior',
      }
    ],
    created_at: '2026-11-01T10:00:00.000Z',
    updated_at: '2026-11-04T12:00:00.000Z',
    published_at: '2026-11-01T10:30:00.000Z',
    estimated_loan_amount: 280000,
    estimated_emi: 5880,
    featured: true,
  },
  {
    id: 'car-duster-2016',
    slug: 'renault-duster-rxz-2016-white',
    make: 'Renault',
    model: 'Duster',
    variant: 'RxZ Top Model (Diesel)',
    model_year: 2016,
    registration_year: 2016,
    price: 435000,
    negotiable: true,
    offer_price: 425000,
    kilometres: 99850,
    fuel_type: 'Diesel',
    transmission: 'Manual',
    body_type: 'SUV',
    ownership_count: 2,
    colour: 'Pearl White',
    registration_location: 'Nashik (MH 15)',
    registration_number: 'MH 15 FF 9959',
    description: '2016 Renault Duster RxZ Top Model. Rugged high ground clearance SUV powered by the legendary 1.5 dCi diesel engine known for incredible highway mileage (20+ km/l) and punchy torque. Loaded with factory touchscreen MediaNav system, dual airbags, ABS, alloy wheels, roof rails, and clean leatherette seat covers. Finance possible up to ₹3,50,000 - ₹4,00,000.',
    features: [
      'Top Model RxZ Diesel',
      'High Ground Clearance (205mm)',
      'Touchscreen Infotainment with Bluetooth',
      'Dual Airbags & ABS with EBD',
      'OEM Alloy Wheels & Roof Rails',
      'Leatherette Premium Seat Covers',
      'Powerful AC with Rear Vents',
      'Finance up to ₹4 Lakh'
    ],
    status: 'published',
    media: [
      {
        id: 'media-duster-vid',
        car_id: 'car-duster-2016',
        media_type: 'video',
        url: '/assets/aistudio/VID-20261104-WA0019_df17b738.mp4',
        display_order: 1,
        is_cover: true,
        alt_text: 'Renault Duster RxZ walkaround video with Naresh Joshi',
      },
      {
        id: 'media-duster-img1',
        car_id: 'car-duster-2016',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0003_b7ac20e2.jpg',
        display_order: 2,
        is_cover: false,
        alt_text: 'Renault Duster Exterior at JK Motors',
      }
    ],
    created_at: '2026-11-02T11:00:00.000Z',
    updated_at: '2026-11-04T12:00:00.000Z',
    published_at: '2026-11-02T11:30:00.000Z',
    estimated_loan_amount: 360000,
    estimated_emi: 7560,
    featured: true,
  },
  {
    id: 'car-seltos-2019',
    slug: 'kia-seltos-gtx-plus-sunroof-2019-red',
    make: 'Kia',
    model: 'Seltos',
    variant: 'GTX+ / HTX Sunroof (Top Model)',
    model_year: 2019,
    registration_year: 2019,
    price: 1049000,
    negotiable: true,
    offer_price: 1025000,
    kilometres: 90400,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'SUV',
    ownership_count: 1,
    colour: 'Intense Red / Wine',
    registration_location: 'Kalyan / Dombivli (MH 05)',
    registration_number: 'MH 05 DZ 7002',
    description: '2019 Kia Seltos Top Model with Electric Sunroof and Push Button Start. 1st Owner vehicle in head-turning Intense Red color with VIP registration number. Features panoramic 10.25-inch touchscreen with navigation, Bose sound setup, 6 airbags, leatherette ventilated upholstery, LED headlamps with DRLs, and cruise control. Full service records available. Loan available up to ₹9,00,000.',
    features: [
      'Electric Sunroof',
      'Push Button Start & Smart Keyless Entry',
      '10.25" HD Touchscreen with Apple CarPlay/Android Auto',
      'Crown Jewel LED Headlights & DRLs',
      'Cruise Control & Steering Controls',
      'VIP Registration Number (MH 05 DZ 7002)',
      'Dual-Tone Alloy Wheels with Fresh Tyres',
      'Loan Approved up to ₹9,00,000'
    ],
    status: 'published',
    media: [
      {
        id: 'media-seltos-vid',
        car_id: 'car-seltos-2019',
        media_type: 'video',
        url: '/assets/aistudio/VID-20261104-WA0018_1c1d51ed.mp4',
        display_order: 1,
        is_cover: true,
        alt_text: 'Kia Seltos Sunroof Walkaround Video at JK Motors',
      },
      {
        id: 'media-seltos-img1',
        car_id: 'car-seltos-2019',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0009_04766760.jpg',
        display_order: 2,
        is_cover: false,
        alt_text: 'Kia Seltos at JK Motors Lot',
      }
    ],
    created_at: '2026-11-03T09:00:00.000Z',
    updated_at: '2026-11-04T12:00:00.000Z',
    published_at: '2026-11-03T09:30:00.000Z',
    estimated_loan_amount: 850000,
    estimated_emi: 17850,
    featured: true,
  },
  {
    id: 'car-creta-2021',
    slug: 'hyundai-creta-sx-executive-2021-black',
    make: 'Hyundai',
    model: 'Creta',
    variant: 'SX Executive Automatic (Diesel)',
    model_year: 2021,
    registration_year: 2021,
    price: 1180000,
    negotiable: false,
    kilometres: 41200,
    fuel_type: 'Diesel',
    transmission: 'Automatic',
    body_type: 'SUV',
    ownership_count: 1,
    colour: 'Phantom Black',
    registration_location: 'Nashik (MH 15)',
    registration_number: 'MH 15 HP 4422',
    description: 'Immaculate 2021 Hyundai Creta SX Executive Diesel Automatic. Effortless driving experience in city traffic with paddle shifters, panoramic sunroof, wireless mobile charging, and premium black aesthetics. Driven only 41,200 km by a single owner with complete Hyundai company service history. Comprehensive insurance active.',
    features: [
      'Diesel Automatic with Paddle Shifters',
      'Panoramic Sunroof',
      'Wireless Phone Charger',
      'Diamond Cut Alloy Wheels',
      'Rear Reclining Seats & Sunblinds',
      'Keyless Smart Entry with Remote Engine Start'
    ],
    status: 'published',
    media: [
      {
        id: 'media-creta-img1',
        car_id: 'car-creta-2021',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0002_9ea5637b.jpg',
        display_order: 1,
        is_cover: true,
        alt_text: 'Hyundai Creta Phantom Black',
      }
    ],
    created_at: '2026-10-25T10:00:00.000Z',
    updated_at: '2026-11-04T10:00:00.000Z',
    published_at: '2026-10-25T11:00:00.000Z',
    estimated_loan_amount: 950000,
    estimated_emi: 19950,
    featured: true,
  },
  {
    id: 'car-city-2020',
    slug: 'honda-city-zx-5th-gen-cvt-2020-brown',
    make: 'Honda',
    model: 'City',
    variant: 'ZX 5th Gen (CVT Automatic)',
    model_year: 2020,
    registration_year: 2020,
    price: 975000,
    negotiable: true,
    offer_price: 950000,
    kilometres: 38400,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'Sedan',
    ownership_count: 1,
    colour: 'Golden Brown Metallic',
    registration_location: 'Pune (MH 12)',
    registration_number: 'MH 12 SP 8801',
    description: '5th Generation Honda City ZX Top End Automatic. Iconic 1.5L i-VTEC petrol engine with ultra-smooth 7-speed CVT gearbox. Equipped with LaneWatch Blind Spot Camera, electric one-touch sunroof, full LED jewel-eye headlights, and plush leather interior. Non-accidental, doctor-driven vehicle in spotless condition.',
    features: [
      'Honda LaneWatch Blind Spot Camera',
      'One-Touch Electric Sunroof',
      '7-Speed CVT with Paddle Shifters',
      'Pure i-VTEC Petrol Engine',
      '8-inch Advanced Touchscreen with Alexa Connectivity',
      '6 Airbags, VSA and Hill Start Assist'
    ],
    status: 'published',
    media: [
      {
        id: 'media-city-img1',
        car_id: 'car-city-2020',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0006_a918259b.jpg',
        display_order: 1,
        is_cover: true,
        alt_text: 'Honda City ZX Sedan',
      }
    ],
    created_at: '2026-10-28T14:00:00.000Z',
    updated_at: '2026-11-04T10:00:00.000Z',
    published_at: '2026-10-28T15:00:00.000Z',
    estimated_loan_amount: 800000,
    estimated_emi: 16800,
    featured: false,
  },
  // DELIVERED / SOLD VEHICLES (Showcasing real customer success from uploaded media)
  {
    id: 'car-brezza-sold-2018',
    slug: 'maruti-suzuki-vitara-brezza-zdi-plus-2018-silver',
    make: 'Maruti Suzuki',
    model: 'Vitara Brezza',
    variant: 'ZDi+ (Diesel)',
    model_year: 2018,
    price: 695000,
    negotiable: false,
    kilometres: 62000,
    fuel_type: 'Diesel',
    transmission: 'Manual',
    body_type: 'Compact SUV',
    ownership_count: 1,
    colour: 'Premium Silver',
    registration_location: 'Nashik (MH 15)',
    registration_number: 'MH 15 EX 8377',
    description: 'Successfully delivered to our happy customer on Dussehra! 1st Owner Vitara Brezza ZDi+ with dual-tone alloy wheels, SmartPlay infotainment, and verified 62,000 km.',
    features: ['Single Owner', 'Delivered at JK Motors', '100% Finance Assisted'],
    status: 'sold',
    media: [
      {
        id: 'media-brezza-delivery',
        car_id: 'car-brezza-sold-2018',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0002_9ea5637b.jpg',
        display_order: 1,
        is_cover: true,
        alt_text: 'Vitara Brezza MH 15 EX 8377 Customer Key Handover',
      }
    ],
    created_at: '2026-10-10T10:00:00.000Z',
    updated_at: '2026-10-24T18:00:00.000Z',
    published_at: '2026-10-10T10:00:00.000Z',
  },
  {
    id: 'car-ciaz-sold-2017',
    slug: 'maruti-suzuki-ciaz-vxi-plus-2017-silver',
    make: 'Maruti Suzuki',
    model: 'Ciaz',
    variant: 'VXi+ Smart Hybrid',
    model_year: 2017,
    price: 545000,
    negotiable: false,
    kilometres: 58000,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'Sedan',
    ownership_count: 1,
    colour: 'Metallic Silky Silver',
    registration_location: 'Nashik (MH 15)',
    registration_number: 'MH 15 FF 7705',
    description: 'Delivered to a proud family from Nashik! Spacious luxury sedan with projector headlamps and SHVS mild-hybrid fuel efficiency.',
    features: ['Delivered with Ceremony Key', 'Verified Paperwork & RTO Transfer Complete'],
    status: 'sold',
    media: [
      {
        id: 'media-ciaz-delivery',
        car_id: 'car-ciaz-sold-2017',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0006_a918259b.jpg',
        display_order: 1,
        is_cover: true,
        alt_text: 'Maruti Ciaz MH 15 FF 7705 Handover Ceremony at JK Motors',
      }
    ],
    created_at: '2026-10-12T10:00:00.000Z',
    updated_at: '2026-10-26T18:00:00.000Z',
    published_at: '2026-10-12T10:00:00.000Z',
  },
  {
    id: 'car-wagonr-sold-2020',
    slug: 'maruti-suzuki-wagonr-vxi-2020-white',
    make: 'Maruti Suzuki',
    model: 'WagonR',
    variant: 'VXi 1.2L Big Engine',
    model_year: 2020,
    price: 485000,
    negotiable: false,
    kilometres: 44000,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'Hatchback',
    ownership_count: 1,
    colour: 'Arctic White',
    registration_location: 'Navi Mumbai (MH 43)',
    registration_number: 'MH 43 BK 4793',
    description: 'Delivered with evening key ceremony at JK Motors. Tall boy hatchback with best-in-class cabin room and ultra-reliable 1.2L engine.',
    features: ['Evening Delivery Ceremony', 'MH 43 RTO Transfer Complete'],
    status: 'sold',
    media: [
      {
        id: 'media-wagonr-delivery',
        car_id: 'car-wagonr-sold-2020',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0005_d36d0584.jpg',
        display_order: 1,
        is_cover: true,
        alt_text: 'WagonR Delivery at JK Motors',
      }
    ],
    created_at: '2026-10-15T10:00:00.000Z',
    updated_at: '2026-10-28T19:00:00.000Z',
    published_at: '2026-10-15T10:00:00.000Z',
  },
  {
    id: 'car-tiago-sold-2021',
    slug: 'tata-tiago-xz-plus-2021-white',
    make: 'Tata',
    model: 'Tiago',
    variant: 'XZ+ Dual Tone Top Model',
    model_year: 2021,
    price: 575000,
    negotiable: false,
    kilometres: 31000,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'Hatchback',
    ownership_count: 1,
    colour: 'Opal White Dual Tone',
    registration_location: 'Nashik (MH 15)',
    registration_number: 'MH 15 HG 1727',
    description: 'Delivered to newlywed couple in Nashik with full flower garland & big ceremonial key. 4-Star Global NCAP safety rating and Harman 8-speaker audio.',
    features: ['4-Star NCAP Safety', 'Harman Audio', 'Delivered at JK Motors'],
    status: 'sold',
    media: [
      {
        id: 'media-tiago-delivery',
        car_id: 'car-tiago-sold-2021',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0009_04766760.jpg',
        display_order: 1,
        is_cover: true,
        alt_text: 'Tata Tiago MH 15 HG 1727 Customer Delivery',
      }
    ],
    created_at: '2026-10-18T10:00:00.000Z',
    updated_at: '2026-10-30T17:00:00.000Z',
    published_at: '2026-10-18T10:00:00.000Z',
  },
  {
    id: 'car-eeco-sold-2019',
    slug: 'maruti-suzuki-eeco-7-seater-2019-silver',
    make: 'Maruti Suzuki',
    model: 'Eeco',
    variant: '7-Seater AC with CNG',
    model_year: 2019,
    price: 390000,
    negotiable: false,
    kilometres: 52000,
    fuel_type: 'CNG',
    transmission: 'Manual',
    body_type: 'MUV',
    ownership_count: 1,
    colour: 'Silky Silver',
    registration_location: 'Nashik (MH 15)',
    registration_number: 'MH 15 CT 7839',
    description: 'Delivered to family business customer for commercial & family use. Economical running cost with factory fitted CNG and factory AC.',
    features: ['7-Seater Cabin', 'Low Running Cost with CNG', 'Delivered at JK Motors'],
    status: 'sold',
    media: [
      {
        id: 'media-eeco-delivery',
        car_id: 'car-eeco-sold-2019',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0004_a28823c9.jpg',
        display_order: 1,
        is_cover: true,
        alt_text: 'Maruti Eeco Handover at JK Motors',
      }
    ],
    created_at: '2026-10-20T10:00:00.000Z',
    updated_at: '2026-10-31T16:00:00.000Z',
    published_at: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'car-ciaz-white-garland-sold',
    slug: 'maruti-suzuki-ciaz-white-garland-2019',
    make: 'Maruti Suzuki',
    model: 'Ciaz',
    variant: 'Alpha Luxury Edition',
    model_year: 2019,
    price: 649000,
    negotiable: false,
    kilometres: 51000,
    fuel_type: 'Diesel',
    transmission: 'Manual',
    body_type: 'Sedan',
    ownership_count: 1,
    colour: 'Pearl Arctic White',
    registration_location: 'Thane / Nashik (MH 04)',
    registration_number: 'MH 04 AR 2105',
    description: 'Proud handover to Deshmukh family! Handed over with fresh red rose garland, traditional coconut puja, and big ceremonial key.',
    features: ['Vedic Puja Delivery', 'Garland Key Ceremony', '100% Verified RC Paperwork'],
    status: 'sold',
    media: [
      {
        id: 'media-ciaz-garland-delivery',
        car_id: 'car-ciaz-white-garland-sold',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0008.jpg',
        display_order: 1,
        is_cover: true,
        alt_text: 'Maruti Ciaz MH 04 AR 2105 Garland Key Handover Ceremony at JK Motors',
      }
    ],
    created_at: '2026-10-22T10:00:00.000Z',
    updated_at: '2026-11-01T15:00:00.000Z',
    published_at: '2026-10-22T10:00:00.000Z',
  },
  {
    id: 'car-kwid-sold',
    slug: 'renault-kwid-climber-2018-white',
    make: 'Renault',
    model: 'Kwid',
    variant: 'RXT 1.0L',
    model_year: 2018,
    price: 285000,
    negotiable: false,
    kilometres: 43000,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'Hatchback',
    ownership_count: 1,
    colour: 'Fiery White',
    registration_location: 'Kalyan (MH 05)',
    registration_number: 'MH 05 CM 9527',
    description: 'Delivered to young first-time car buyer in Nashik! Budget friendly, economical running, and spotless showroom-level finish.',
    features: ['First Car Celebration', 'Low Running Cost', 'Instant RTO NOC'],
    status: 'sold',
    media: [
      {
        id: 'media-kwid-delivery',
        car_id: 'car-kwid-sold',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0010.jpg',
        display_order: 1,
        is_cover: true,
        alt_text: 'Renault Kwid MH 05 CM 9527 Customer Handover at JK Motors',
      }
    ],
    created_at: '2026-10-24T10:00:00.000Z',
    updated_at: '2026-11-02T16:00:00.000Z',
    published_at: '2026-10-24T10:00:00.000Z',
  },
  {
    id: 'car-celerio-auto-sold',
    slug: 'maruti-suzuki-celerio-zxi-automatic-2019',
    make: 'Maruti Suzuki',
    model: 'Celerio',
    variant: 'ZXi AMT Automatic',
    model_year: 2019,
    price: 435000,
    negotiable: false,
    kilometres: 48000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'Hatchback',
    ownership_count: 1,
    colour: 'Superior White',
    registration_location: 'Thane (MH 04)',
    registration_number: 'MH 04 GM 9757',
    description: 'Delivered with quick on-spot loan approval and ceremony key! Automatic hassle-free city hatchback in mint condition.',
    features: ['Automatic AMT Gearbox', 'On-Spot Loan Sanction', 'Delivered at JK Motors'],
    status: 'sold',
    media: [
      {
        id: 'media-celerio-auto-delivery',
        car_id: 'car-celerio-auto-sold',
        media_type: 'image',
        url: '/assets/aistudio/IMG-20261104-WA0012.jpg',
        display_order: 1,
        is_cover: true,
        alt_text: 'Maruti Celerio MH 04 GM 9757 Handover at JK Motors',
      }
    ],
    created_at: '2026-10-26T10:00:00.000Z',
    updated_at: '2026-11-03T17:00:00.000Z',
    published_at: '2026-10-26T10:00:00.000Z',
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'offer-festive-dhamaka',
    title: 'Festival Dhamaka: Free 1st Major Service & 1-Year RSA',
    title_hindi: 'त्यौहारी धमाका: फ्री 1st सर्विस व 1 साल रोडसाइड असिस्टेंस',
    description: 'Book any vehicle this week and receive complimentary full comprehensive service, fluid change, and 1-Year 24x7 Roadside Assistance across Maharashtra.',
    discount_amount: 15000,
    starts_at: '2026-11-01T00:00:00.000Z',
    ends_at: '2026-11-30T23:59:59.000Z',
    status: 'active',
    terms: 'Valid on confirmed bookings made with min ₹10,000 token before November 30. Applicable to all retail pre-owned cars.',
    applicable_car_ids: [],
    created_at: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'offer-low-emi-finance',
    title: 'Zero Down-Payment & Lowest 8.75% Interest Loan',
    title_hindi: 'जीरो डाउन पेमेंट व मात्र 8.75% की दर पर आसान कार लोन',
    description: 'Exclusive finance tie-up with HDFC, ICICI, SBI, and Mahindra Finance. On-spot loan approval in 2 hours with minimal Aadhaar and PAN paperwork.',
    discount_amount: 10000,
    starts_at: '2026-11-01T00:00:00.000Z',
    ends_at: '2026-12-15T23:59:59.000Z',
    status: 'active',
    terms: 'Subject to bank credit verification and CIBIL score > 700. Same-day delivery on sanction.',
    applicable_car_ids: ['car-celerio-2016', 'car-duster-2016', 'car-seltos-2019'],
    created_at: '2026-11-01T00:00:00.000Z',
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-101',
    customer_name: 'Anil Sonawane (अनिल सोनावणे)',
    customer_phone: '9822014589',
    car_id: 'car-celerio-2016',
    car_summary: {
      make: 'Maruti Suzuki',
      model: 'Celerio VXi',
      year: 2016,
      price: 349000,
      registration_number: 'MH 15 FN 0155',
      cover_image: '/assets/aistudio/VID-20261104-WA0014_2147fa0a.mp4',
    },
    source: 'whatsapp_click',
    message: 'Hello, saw the walkaround video of Celerio on Instagram/App. I live in Nashik Road. Can you arrange ₹2.5 Lakh loan through State Bank?',
    status: 'visit_scheduled',
    assigned_to: 'Naresh Joshi',
    preferred_visit_date: 'Tomorrow, 4:00 PM',
    loan_required: true,
    notes: [
      {
        id: 'note-1',
        enquiry_id: 'enq-101',
        author_name: 'Naresh Joshi',
        note: 'Customer called and confirmed test drive for tomorrow 4 PM. Aadhaar & PAN card ready for finance calculation.',
        created_at: '2026-11-04T11:20:00.000Z'
      }
    ],
    history: [
      {
        id: 'hist-1',
        enquiry_id: 'enq-101',
        changed_by: 'System',
        old_status: 'new',
        new_status: 'contacted',
        created_at: '2026-11-04T10:15:00.000Z'
      },
      {
        id: 'hist-2',
        enquiry_id: 'enq-101',
        changed_by: 'Naresh Joshi',
        old_status: 'contacted',
        new_status: 'visit_scheduled',
        created_at: '2026-11-04T11:25:00.000Z'
      }
    ],
    created_at: '2026-11-04T10:05:00.000Z',
    updated_at: '2026-11-04T11:25:00.000Z',
  },
  {
    id: 'enq-102',
    customer_name: 'Vikram Shinde',
    customer_phone: '9890123456',
    car_id: 'car-seltos-2019',
    car_summary: {
      make: 'Kia',
      model: 'Seltos Top Model Sunroof',
      year: 2019,
      price: 1049000,
      registration_number: 'MH 05 DZ 7002',
      cover_image: '/assets/aistudio/VID-20261104-WA0018_1c1d51ed.mp4',
    },
    source: 'app_form',
    message: 'Interested in the red Kia Seltos with sunroof. What is the lowest cash offer? Also have a 2015 Swift for exchange.',
    status: 'negotiation',
    assigned_to: 'Naresh Joshi',
    loan_required: false,
    notes: [
      {
        id: 'note-2',
        enquiry_id: 'enq-102',
        author_name: 'Naresh Joshi',
        note: 'Offered ₹10.25 Lakh final for direct payment. Agreed to evaluate his 2015 Swift exchange value on Friday.',
        created_at: '2026-11-04T14:00:00.000Z'
      }
    ],
    history: [
      {
        id: 'hist-3',
        enquiry_id: 'enq-102',
        changed_by: 'Naresh Joshi',
        old_status: 'new',
        new_status: 'negotiation',
        created_at: '2026-11-04T14:05:00.000Z'
      }
    ],
    created_at: '2026-11-04T12:30:00.000Z',
    updated_at: '2026-11-04T14:05:00.000Z',
  },
  {
    id: 'enq-103',
    customer_name: 'Rahul Deshmukh',
    customer_phone: '9422789123',
    car_id: 'car-duster-2016',
    car_summary: {
      make: 'Renault',
      model: 'Duster RxZ Diesel',
      year: 2016,
      price: 435000,
      registration_number: 'MH 15 FF 9959',
      cover_image: '/assets/aistudio/VID-20261104-WA0019_df17b738.mp4',
    },
    source: 'callback',
    message: 'Requested urgent callback regarding highway diesel mileage and suspension check.',
    status: 'new',
    assigned_to: 'Staff',
    loan_required: true,
    notes: [],
    history: [],
    created_at: '2026-11-04T16:15:00.000Z',
    updated_at: '2026-11-04T16:15:00.000Z',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actor_name: 'Naresh Joshi (Owner)',
    action: 'PUBLISH_CAR',
    entity_type: 'car',
    entity_id: 'car-seltos-2019',
    details: 'Published 2019 Kia Seltos GTX+ Sunroof (MH 05 DZ 7002) at ₹10,49,000 with walkaround video',
    created_at: '2026-11-03T09:30:00.000Z'
  },
  {
    id: 'log-2',
    actor_name: 'Naresh Joshi (Owner)',
    action: 'MARK_SOLD',
    entity_type: 'car',
    entity_id: 'car-tiago-sold-2021',
    details: 'Delivered Tata Tiago XZ+ (MH 15 HG 1727) to customer. Handed over ceremonial key.',
    created_at: '2026-10-30T17:00:00.000Z'
  },
  {
    id: 'log-3',
    actor_name: 'Staff - Finance',
    action: 'UPDATE_ENQUIRY',
    entity_type: 'enquiry',
    entity_id: 'enq-101',
    details: 'Scheduled test drive visit for Anil Sonawane (Celerio VXi)',
    created_at: '2026-11-04T11:25:00.000Z'
  }
];

// LocalStorage Helper Service
export class StorageService {
  static getCars(): Car[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARS);
      if (data) {
        const parsed: Car[] = JSON.parse(data);
        const migrated: Car[] = parsed.map(c => ({
          ...c,
          media: (c.media || []).map(m => ({
            ...m,
            url: (m.url || '').replace(/^\/public\//, '/'),
          }))
        }));
        return migrated;
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    this.saveCars(INITIAL_CARS);
    return INITIAL_CARS;
  }

  static saveCars(cars: Car[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
    } catch (e) {
      console.error('Storage write failed', e);
    }
  }

  static getEnquiries(): Enquiry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      if (data) {
        const parsed: Enquiry[] = JSON.parse(data);
        return parsed.map(e => ({
          ...e,
          car_summary: e.car_summary ? {
            ...e.car_summary,
            cover_image: e.car_summary.cover_image ? e.car_summary.cover_image.replace(/^\/public\//, '/') : e.car_summary.cover_image,
          } : e.car_summary
        }));
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    this.saveEnquiries(INITIAL_ENQUIRIES);
    return INITIAL_ENQUIRIES;
  }

  static saveEnquiries(enquiries: Enquiry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.error('Storage write failed', e);
    }
  }

  static getOffers(): Offer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OFFERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    this.saveOffers(INITIAL_OFFERS);
    return INITIAL_OFFERS;
  }

  static saveOffers(offers: Offer[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    } catch (e) {
      console.error('Storage write failed', e);
    }
  }

  static getSettings(): DealershipSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        const merged: DealershipSettings = {
          ...INITIAL_SETTINGS,
          ...parsed,
          logo_url: parsed.logo_url || INITIAL_SETTINGS.logo_url || '/assets/jk-motors-logo.svg',
        };
        return merged;
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    this.saveSettings(INITIAL_SETTINGS);
    return INITIAL_SETTINGS;
  }

  static saveSettings(settings: DealershipSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Storage write failed', e);
    }
  }

  static getFavourites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    return ['car-celerio-2016', 'car-seltos-2019'];
  }

  static saveFavourites(carIds: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(carIds));
    } catch (e) {
      console.error('Storage write failed', e);
    }
  }

  static getUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    // Default logged in demo profile for immediate high-end UX
    const defaultUser: UserProfile = {
      id: 'cust-demo-1',
      full_name: 'Shreyansh Singh',
      phone: '+91 9822014633',
      role: 'customer',
      created_at: new Date().toISOString()
    };
    return defaultUser;
  }

  static saveUser(user: UserProfile | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error('Storage write failed', e);
    }
  }

  static getAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    this.saveAuditLogs(INITIAL_AUDIT_LOGS);
    return INITIAL_AUDIT_LOGS;
  }

  static saveAuditLogs(logs: AuditLog[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Storage write failed', e);
    }
  }

  static addAuditLog(action: string, entity_type: AuditLog['entity_type'], entity_id: string, details: string, actor_name: string = 'Naresh Joshi (Owner)'): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      actor_name,
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString(),
    };
    logs.unshift(newLog);
    this.saveAuditLogs(logs.slice(0, 50)); // Keep latest 50
  }
}
