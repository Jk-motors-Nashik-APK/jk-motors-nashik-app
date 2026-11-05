/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CustomerApp } from './components/customer/CustomerApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CarDetailModal } from './components/customer/CarDetailModal';
import { FlutterHubModal } from './components/flutter_hub/FlutterHubModal';
import { Car, Enquiry, Offer, DealershipSettings, UserProfile, AuditLog, CarStatus } from './types';
import { StorageService } from './services/storage';
import { ApiService } from './services/api';
import { Language } from './locales/i18n';

export default function App() {
  const [appMode, setAppMode] = useState<'customer' | 'admin'>('customer');
  const [language, setLanguage] = useState<Language>('en');

  // Core Data States
  const [cars, setCars] = useState<Car[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [settings, setSettings] = useState<DealershipSettings>(StorageService.getSettings());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Modals
  const [previewCar, setPreviewCar] = useState<Car | null>(null);
  const [showFlutterHub, setShowFlutterHub] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    const loadedCars = StorageService.getCars();
    const loadedEnquiries = StorageService.getEnquiries();
    const loadedOffers = StorageService.getOffers();
    const loadedSettings = StorageService.getSettings();
    const loadedAuditLogs = StorageService.getAuditLogs();
    const loadedFavs = StorageService.getFavourites();
    const loadedUser = StorageService.getUser();

    setCars(loadedCars);
    setEnquiries(loadedEnquiries);
    setOffers(loadedOffers);
    setSettings(loadedSettings);
    setAuditLogs(loadedAuditLogs);
    setFavourites(loadedFavs);
    setCurrentUser(loadedUser);
  };

  // Favourites Handler
  const handleToggleFavourite = (carId: string) => {
    let updated: string[];
    if (favourites.includes(carId)) {
      updated = favourites.filter(id => id !== carId);
    } else {
      updated = [...favourites, carId];
    }
    setFavourites(updated);
    StorageService.saveFavourites(updated);
  };

  // Car CRUD Handlers
  const handleSaveCar = async (carData: Partial<Car>) => {
    const saved = await ApiService.saveCar(carData);
    setCars(StorageService.getCars());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleDeleteCar = async (id: string) => {
    await ApiService.deleteCar(id);
    setCars(StorageService.getCars());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleUpdateCarStatus = async (id: string, status: CarStatus) => {
    await ApiService.updateCarStatus(id, status);
    setCars(StorageService.getCars());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleDuplicateCar = async (id: string) => {
    await ApiService.duplicateCar(id);
    setCars(StorageService.getCars());
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Offers Handlers
  const handleSaveOffer = async (offerData: Partial<Offer>) => {
    await ApiService.saveOffer(offerData);
    setOffers(StorageService.getOffers());
  };

  const handleDeleteOffer = async (id: string) => {
    await ApiService.deleteOffer(id);
    setOffers(StorageService.getOffers());
  };

  // Settings Handler
  const handleSaveSettings = async (newSettings: DealershipSettings) => {
    await ApiService.saveSettings(newSettings);
    setSettings(newSettings);
    setAuditLogs(StorageService.getAuditLogs());
  };

  return (
    <div className="bg-[#0c0d12] min-h-screen text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-300">
      
      {appMode === 'customer' ? (
        <CustomerApp
          cars={cars}
          settings={settings}
          offers={offers}
          favourites={favourites}
          currentUser={currentUser}
          language={language}
          onLanguageChange={setLanguage}
          onToggleFavourite={handleToggleFavourite}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            StorageService.saveUser(user);
          }}
          onLogout={() => {
            setCurrentUser(null);
            StorageService.saveUser(null);
          }}
          onOpenAdmin={() => setAppMode('admin')}
          onOpenFlutterHub={() => setShowFlutterHub(true)}
        />
      ) : (
        <AdminDashboard
          cars={cars}
          enquiries={enquiries}
          offers={offers}
          settings={settings}
          auditLogs={auditLogs}
          onBackToCustomerApp={() => setAppMode('customer')}
          onOpenFlutterHub={() => setShowFlutterHub(true)}
          onSaveCar={handleSaveCar}
          onDeleteCar={handleDeleteCar}
          onUpdateCarStatus={handleUpdateCarStatus}
          onDuplicateCar={handleDuplicateCar}
          onSaveOffer={handleSaveOffer}
          onDeleteOffer={handleDeleteOffer}
          onSaveSettings={handleSaveSettings}
          onRefreshData={loadAllData}
          onPreviewCar={(car) => setPreviewCar(car)}
        />
      )}

      {/* Admin Preview Car Modal */}
      {previewCar && (
        <CarDetailModal
          car={previewCar}
          settings={settings}
          language={language}
          isFavourite={favourites.includes(previewCar.id)}
          currentUser={currentUser}
          onToggleFavourite={handleToggleFavourite}
          onClose={() => setPreviewCar(null)}
          onSelectCar={(c) => setPreviewCar(c)}
          allCars={cars}
        />
      )}

      {/* Flutter & Supabase Architecture Hub Modal */}
      {showFlutterHub && (
        <FlutterHubModal onClose={() => setShowFlutterHub(false)} />
      )}

    </div>
  );
}
