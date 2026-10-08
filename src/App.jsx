import React, { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { BookingModal, PackageModal, LoginModal } from './components/Modals';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  const handleSearch = (searchDetails) => {
    setBookingData(searchDetails);
    setIsBookingOpen(true);
  };

  const handleSelectVehicle = (vehicleObj) => {
    setBookingData({ selectedVehicleObj: vehicleObj, estimatedKm: vehicleObj.estimatedKm || 300 });
    setIsBookingOpen(true);
  };

  const handleSelectService = (serviceObj) => {
    setBookingData({ selectedService: serviceObj });
    setIsBookingOpen(true);
  };

  const handleSelectPackage = (pkgObj) => {
    setSelectedPackage(pkgObj);
  };

  return (
    <>
      <AppRoutes
        onSearch={handleSearch}
        onSelectVehicle={handleSelectVehicle}
        onSelectService={handleSelectService}
        onSelectPackage={handleSelectPackage}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Global Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialData={bookingData}
      />

      <PackageModal
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
        pkg={selectedPackage}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  );
}
