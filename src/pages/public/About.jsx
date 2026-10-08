import React from 'react';
import AboutHero from '../../components/about/AboutHero';
import CompanyStory from '../../components/about/CompanyStory';
import MissionVision from '../../components/about/MissionVision';
import CoreValues from '../../components/about/CoreValues';
import WhyChooseUs from '../../components/about/WhyChooseUs';
import Statistics from '../../components/about/Statistics';
import TeamSection from '../../components/about/TeamSection';
import Certifications from '../../components/about/Certifications';
import Timeline from '../../components/about/Timeline';
import CallToAction from '../../components/about/CallToAction';

export default function About({ onOpenBooking }) {
  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      {/* 1. Hero Banner */}
      <AboutHero onOpenBooking={onOpenBooking} />

      {/* 2. Our Story */}
      <CompanyStory />

      {/* 3. Mission & Vision */}
      <MissionVision />

      {/* 4. Core Values */}
      <CoreValues />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Company Statistics */}
      <Statistics />

      {/* 7. Meet Our Team */}
      <TeamSection />

      {/* 8. Certifications & Trust */}
      <Certifications />

      {/* 9. Journey Timeline */}
      <Timeline />

      {/* 10. Call To Action */}
      <CallToAction onOpenBooking={onOpenBooking} />
    </div>
  );
}
