import React from 'react';
import HeroSection from '../../components/HeroSection';
import ServicesSection from '../../components/ServicesSection';
import DestinationsSection from '../../components/DestinationsSection';
import VehicleFleetSection from '../../components/VehicleFleetSection';
import WhyChooseUs from '../../components/WhyChooseUs';
import StatsSection from '../../components/StatsSection';
import TestimonialsSection from '../../components/TestimonialsSection';
import GallerySection from '../../components/GallerySection';
import AppPromotionSection from '../../components/AppPromotionSection';
import ContactSection from '../../components/ContactSection';

export default function Home({ onSearch, onSelectVehicle, onSelectService, onSelectPackage, onOpenBooking }) {
  return (
    <>
      <HeroSection onSearch={onSearch} onOpenBooking={onOpenBooking} />
      <ServicesSection onSelectService={onSelectService} />
      <DestinationsSection onSelectPackage={onSelectPackage} />
      <VehicleFleetSection onSelectVehicle={onSelectVehicle} />
      <WhyChooseUs />
      <StatsSection />
      <TestimonialsSection />
      <GallerySection />
      <AppPromotionSection />
      <ContactSection />
    </>
  );
}
