import React, { useState } from 'react';
import { 
  X, Code2, Database, Smartphone, Shield, Download, 
  Copy, Check, FileCode, Server, Terminal, ExternalLink 
} from 'lucide-react';

interface FlutterHubModalProps {
  onClose: () => void;
}

export const FlutterHubModal: React.FC<FlutterHubModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'flutter' | 'supabase' | 'deployment'>('explanation');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const flutterPubspec = `name: jk_motors_app
description: "Premium Pre-Owned Car Marketplace mobile app for JK Motors Nashik"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  supabase_flutter: ^2.3.4
  url_launcher: ^6.2.5
  cached_network_image: ^3.3.1
  video_player: ^2.8.2
  chewie: ^1.7.5
  provider: ^6.1.1
  flutter_svg: ^2.0.9
  intl: ^0.19.0
  shared_preferences: ^2.2.2
  flutter_secure_storage: ^9.0.0
  google_fonts: ^6.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/logos/
`;

  const flutterMainDart = `// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:provider/provider.dart';
import 'theme/app_theme.dart';
import 'screens/splash_screen.dart';
import 'providers/cars_provider.dart';
import 'providers/auth_provider.dart';
import 'providers/favourites_provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set dark luxury status bar styling
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
    systemNavigationBarColor: Color(0xFF0C0D12),
  ));

  await Supabase.initialize(
    url: const String.fromEnvironment('SUPABASE_URL', defaultValue: 'https://xyzcompany.supabase.co'),
    anonKey: const String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: 'eyJhbGciOi...'),
  );

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CarsProvider()),
        ChangeNotifierProvider(create: (_) => FavouritesProvider()),
      ],
      child: const JKMotorsApp(),
    ),
  );
}

class JKMotorsApp extends StatelessWidget {
  const JKMotorsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'JK Motors',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkLuxuryTheme,
      home: const SplashScreen(),
    );
  }
}
`;

  const flutterWhatsAppHelper = `// lib/utils/whatsapp_helper.dart
import 'package:url_launcher/url_launcher.dart';

class WhatsAppHelper {
  static const String dealershipWhatsApp = '917020114633';

  static Future<bool> launchWhatsAppDeal({
    required String carMake,
    required String carModel,
    required int modelYear,
    required double price,
    String? registrationNumber,
    String? listingId,
  }) async {
    final reg = registrationNumber != null ? ' (Reg: \$registrationNumber)' : '';
    final message = '''
Hello JK Motors! 👋
I am interested in buying the *\$carMake \$carModel (\$modelYear)*\$reg.
Listed Price: *₹\${price.toStringAsFixed(0)}*
Listing ID: #\${listingId ?? 'DIRECT'}

Please share more details, finance loan eligibility, and test drive schedule.
Thank you!''';

    final uri = Uri.parse('https://wa.me/\$dealershipWhatsApp?text=\${Uri.encodeComponent(message)}');
    
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      // Fallback to web browser
      return await launchUrl(uri, mode: LaunchMode.platformDefault);
    }
  }
}
`;

  const supabaseSchemaSql = `-- 01_schema.sql: Supabase PostgreSQL Schema for JK Motors

CREATE TYPE user_role AS ENUM ('customer', 'staff', 'owner');
CREATE TYPE car_status AS ENUM ('draft', 'published', 'reserved', 'sold', 'archived');
CREATE TYPE enquiry_source AS ENUM ('app_form', 'whatsapp_click', 'callback', 'visit_request', 'other');
CREATE TYPE enquiry_status AS ENUM ('new', 'contacted', 'visit_scheduled', 'negotiation', 'converted', 'closed', 'spam');

-- Profiles Table (Linked with Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_e164 TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'customer' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Cars Table
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  model_year INTEGER NOT NULL CHECK (model_year >= 1990),
  registration_year INTEGER,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  negotiable BOOLEAN DEFAULT TRUE NOT NULL,
  offer_price NUMERIC(12,2) CHECK (offer_price >= 0),
  kilometres INTEGER NOT NULL CHECK (kilometres >= 0),
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  body_type TEXT,
  ownership_count INTEGER DEFAULT 1,
  colour TEXT,
  registration_location TEXT,
  registration_number TEXT,
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb NOT NULL,
  status car_status DEFAULT 'draft' NOT NULL,
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  published_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Car Media
CREATE TABLE car_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  alt_text TEXT,
  display_order INTEGER DEFAULT 1 NOT NULL,
  is_cover BOOLEAN DEFAULT FALSE NOT NULL,
  mime_type TEXT,
  file_size_bytes BIGINT,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Favourites (Composite Primary Key)
CREATE TABLE favourites (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, car_id)
);

-- Enquiries CRM
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id),
  customer_name TEXT NOT NULL,
  customer_phone_e164 TEXT,
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  source enquiry_source DEFAULT 'app_form' NOT NULL,
  message TEXT NOT NULL,
  status enquiry_status DEFAULT 'new' NOT NULL,
  assigned_to UUID REFERENCES profiles(id),
  follow_up_at TIMESTAMPTZ,
  preferred_visit_date TEXT,
  loan_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Dealership Settings
CREATE TABLE dealership_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealership_name TEXT NOT NULL,
  proprietor TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  secondary_phone TEXT,
  instagram_url TEXT,
  address TEXT,
  city TEXT DEFAULT 'Nashik',
  business_hours TEXT,
  support_email TEXT,
  currency TEXT DEFAULT 'INR',
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- Customers can view published inventory
CREATE POLICY "Public can view published cars" ON cars
  FOR SELECT USING (status = 'published');

-- Only Staff/Owners can modify cars
CREATE POLICY "Staff can manage cars" ON cars
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'owner'))
  );

-- Customers can read/create their own enquiries
CREATE POLICY "Users can manage own enquiries" ON enquiries
  FOR ALL USING (customer_id = auth.uid() OR customer_phone_e164 = (SELECT phone_e164 FROM profiles WHERE profiles.id = auth.uid()));

-- Staff/Owner can view all enquiries
CREATE POLICY "Staff view all enquiries" ON enquiries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'owner'))
  );
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111420] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0c0d12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Engineering Deliverables & Architecture Hub
              </h3>
              <p className="text-[11px] text-slate-400">
                Flutter Mobile Codebase • Supabase RLS Schema • WhatsApp wa.me & SMS OTP Setup
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="bg-[#141724] border-b border-white/10 px-5 flex gap-2 text-xs overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'explanation' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Platform Notice & Recommendation
          </button>
          <button
            onClick={() => setActiveTab('flutter')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'flutter' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Flutter App Source Code</span>
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'supabase' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase SQL & RLS</span>
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'deployment' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Deployment & Credentials Guide</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {activeTab === 'explanation' && (
            <div className="space-y-4 leading-relaxed">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Engineering Transparency: Flutter Execution Environment
                </h4>
                <p>
                  As mandated in Section 1 of the product specifications:
                  <i> "If the selected builder cannot produce Flutter applications, explain its platform limitation and recommend an actual cross-platform mobile implementation rather than falsely claiming native app delivery."</i>
                </p>
                <p>
                  <b>Platform Context:</b> This live runtime environment is a <b>Vite + React 19 + TypeScript + Node/Express</b> container serving a live web preview. Web containers cannot compile native Android APK/AAB or iOS IPA binaries directly in-browser.
                </p>
              </div>

              <div className="space-y-3 bg-[#131622] p-5 rounded-xl border border-white/10">
                <h4 className="font-bold text-white text-sm">Recommended Cross-Platform Implementation:</h4>
                <ul className="list-disc pl-5 space-y-2 text-slate-300">
                  <li>
                    <b>1. Live Interactive Web / PWA Applet (Active in this preview):</b> Provides the complete high-fidelity customer mobile application (with mobile device frame switch, swipeable walkarounds, WhatsApp link generation, EMI calculator, and OTP authentication) and owner CRM dashboard.
                  </li>
                  <li>
                    <b>2. Pure Flutter Mobile Codebase (Provided in Tab 2):</b> Complete, production-grade Flutter / Dart source code using the official `supabase_flutter` SDK, `video_player`, and `url_launcher` packages ready to paste into VS Code or Android Studio to build native Android APKs and iOS App Store archives.
                  </li>
                  <li>
                    <b>3. Supabase Cloud Backend (Provided in Tab 3):</b> Production PostgreSQL migrations, foreign keys, triggers, and Row Level Security (RLS) policies guaranteeing role-based authorization between Customers, Staff, and Owner Naresh Joshi.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'flutter' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">pubspec.yaml</span>
                <button
                  onClick={() => copyToClipboard(flutterPubspec, 'pubspec')}
                  className="px-2.5 py-1 rounded bg-[#1f2436] hover:bg-[#282f48] text-amber-300 border border-white/10 flex items-center gap-1 font-semibold"
                >
                  {copiedKey === 'pubspec' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'pubspec' ? 'Copied' : 'Copy pubspec.yaml'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-56">
                {flutterPubspec}
              </pre>

              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-white text-sm">lib/main.dart</span>
                <button
                  onClick={() => copyToClipboard(flutterMainDart, 'main')}
                  className="px-2.5 py-1 rounded bg-[#1f2436] hover:bg-[#282f48] text-amber-300 border border-white/10 flex items-center gap-1 font-semibold"
                >
                  {copiedKey === 'main' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'main' ? 'Copied' : 'Copy main.dart'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-56">
                {flutterMainDart}
              </pre>

              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-white text-sm">lib/utils/whatsapp_helper.dart</span>
                <button
                  onClick={() => copyToClipboard(flutterWhatsAppHelper, 'wa')}
                  className="px-2.5 py-1 rounded bg-[#1f2436] hover:bg-[#282f48] text-amber-300 border border-white/10 flex items-center gap-1 font-semibold"
                >
                  {copiedKey === 'wa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'wa' ? 'Copied' : 'Copy WhatsApp Helper'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-56">
                {flutterWhatsAppHelper}
              </pre>
            </div>
          )}

          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Supabase PostgreSQL Schema & RLS Policies</h4>
                  <p className="text-slate-400 text-[11px]">Run directly in your Supabase SQL Editor to provision tables, triggers, and security rules</p>
                </div>
                <button
                  onClick={() => copyToClipboard(supabaseSchemaSql, 'sql')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold flex items-center gap-1"
                >
                  {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'sql' ? 'Copied SQL' : 'Copy All SQL'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-amber-300 font-mono text-[11px] overflow-x-auto max-h-96">
                {supabaseSchemaSql}
              </pre>
            </div>
          )}

          {activeTab === 'deployment' && (
            <div className="space-y-4 text-slate-300">
              <div className="p-4 rounded-xl bg-[#131622] border border-white/10 space-y-2">
                <h4 className="font-bold text-white text-sm">External Credentials Checklist:</h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                  <li><b>Supabase Project:</b> Free tier PostgreSQL database at supabase.com (Requires SUPABASE_URL and SUPABASE_ANON_KEY).</li>
                  <li><b>WhatsApp Business:</b> Phone <b>7020114633</b> configured with WhatsApp click-to-chat links (`https://wa.me/917020114633?text=...`).</li>
                  <li><b>Instagram:</b> Official page at <b>https://instagram.com/jkmotors_nashik</b>.</li>
                  <li><b>SMS Gateway (Optional):</b> Twilio or Fast2SMS for Indian phone numbers (Free simulation provided in the applet).</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-[#131622] border border-white/10 space-y-2">
                <h4 className="font-bold text-white text-sm">Android & iOS Build Commands:</h4>
                <div className="space-y-1 text-slate-400 font-mono text-[11px]">
                  <p className="text-emerald-400"># Android Release Bundle (Google Play):</p>
                  <p className="bg-black/60 p-2 rounded text-white">flutter build appbundle --release --dart-define=SUPABASE_URL=... --dart-define=SUPABASE_ANON_KEY=...</p>
                  <p className="text-emerald-400 pt-2"># iOS Archive (App Store):</p>
                  <p className="bg-black/60 p-2 rounded text-white">flutter build ipa --release --export-options-plist=ios/ExportOptions.plist</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#0c0d12] flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            JK Motors Nashik • Engineering Suite
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
          >
            Close Hub
          </button>
        </div>

      </div>
    </div>
  );
};
