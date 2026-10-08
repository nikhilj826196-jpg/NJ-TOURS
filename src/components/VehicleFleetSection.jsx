import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Users, 
  Briefcase, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  X, 
  Sparkles, 
  Fuel, 
  Wind, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { vehicleApi } from '../api/vehicle.api';
import { VEHICLE_FLEET } from '../data/toursData';

const DEFAULT_IMAGES = {
  Sedan: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
  SUV: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
  Innova: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
  Traveller: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
  Bus: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
};

export default function VehicleFleetSection({ onSelectVehicle }) {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedModalVehicle, setSelectedModalVehicle] = useState(null);

  const filters = ['All', 'Sedan', 'SUV', 'Innova', 'Traveller', 'Bus'];

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleApi.listVehicles();
      const apiData = response?.data?.data;
      if (Array.isArray(apiData) && apiData.length > 0) {
        setVehicles(apiData);
      } else {
        setVehicles(VEHICLE_FLEET.map(v => ({
          id: v.id,
          name: v.name,
          brand: "NJ Tours",
          model_name: v.name,
          vehicle_number: "MH12-NJ-2026",
          category: v.category === "Tempo Traveller" ? "Traveller" : (v.category === "Innova Crysta" ? "Innova" : v.category),
          seating_capacity: v.seats || 4,
          per_km_rate: v.pricePerKm || 15,
          per_day_rate: v.baseFare || 3000,
          fuel_type: "Diesel",
          is_ac: true,
          is_available: true,
          image_url: v.image
        })));
      }
    } catch (err) {
      console.error("Failed to fetch vehicles from backend API:", err);
      setVehicles(VEHICLE_FLEET.map(v => ({
        id: v.id,
        name: v.name,
        brand: "NJ Tours",
        model_name: v.name,
        vehicle_number: "MH12-NJ-2026",
        category: v.category === "Tempo Traveller" ? "Traveller" : (v.category === "Innova Crysta" ? "Innova" : v.category),
        seating_capacity: v.seats || 4,
        per_km_rate: v.pricePerKm || 15,
        per_day_rate: v.baseFare || 3000,
        fuel_type: "Diesel",
        is_ac: true,
        is_available: true,
        image_url: v.image
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = activeFilter === 'All'
    ? vehicles
    : vehicles.filter(v => {
        const cat = (v.category || '').toLowerCase();
        const filt = activeFilter.toLowerCase();
        if (filt === 'innova') return cat.includes('innova') || (v.name || '').toLowerCase().includes('innova');
        if (filt === 'traveller') return cat.includes('traveller') || cat.includes('tempo');
        return cat === filt;
      });

  return (
    <section id="fleet" className="py-20 bg-[#F8FAFC] text-[#0F172A] border-t border-[#E2E8F0] relative overflow-hidden font-sans">
      <div className="max-w-[1280px] mx-auto px-6 space-y-12 relative z-10">
        
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 bg-[#0B5ED7]/10 text-[#0B5ED7] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#0B5ED7]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VERIFIED FLEET ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight font-serif">
            Vehicles & Fleet
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-semibold max-w-xl mx-auto leading-relaxed">
            Meticulously maintained commercial vehicles for local rides, outstation trips, and group tours.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pb-2">
          {filters.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`text-xs font-bold px-5 py-2.5 rounded-[12px] border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0B5ED7] text-white border-[#0B5ED7] shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[#E2E8F0] shadow-sm'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white rounded-[20px] p-4 border border-slate-200 space-y-4 animate-pulse">
                <div className="h-48 bg-slate-200 rounded-xl" />
                <div className="h-6 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 p-8 rounded-2xl border border-red-200 text-center space-y-4 max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <div>
              <h3 className="font-bold text-red-900 text-base">Unable to load fleet data</h3>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchVehicles}
              className="inline-flex items-center gap-2 bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredVehicles.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 max-w-md mx-auto">
            <Car className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-800 text-base">No vehicles found in this category</h3>
            <p className="text-xs text-slate-500">Try selecting "All" or choosing a different category filter.</p>
          </div>
        )}

        {/* Fleet Grid */}
        {!loading && !error && filteredVehicles.length > 0 && (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
          >
            <AnimatePresence mode="popLayout">
              {filteredVehicles.map((v) => {
                const imageUrl = v.image_url || DEFAULT_IMAGES[v.category] || DEFAULT_IMAGES.SUV;
                const luggageCap = v.seating_capacity > 10 ? "8+ Bags" : (v.seating_capacity > 6 ? "4 Large Bags" : "2 Bags");

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    key={v.id}
                    whileHover={{ y: -6 }}
                    className="bg-white rounded-[20px] overflow-hidden border border-[#E2E8F0] hover:border-[#0B5ED7]/50 group flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden bg-slate-100">
                        <img
                          src={imageUrl}
                          alt={v.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                        {/* Availability Pill */}
                        <div className={`absolute top-4 left-4 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow ${v.is_available ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                          {v.is_available ? 'Available Now' : 'Booked'}
                        </div>

                        {/* Rate Badge */}
                        <div className="absolute top-4 right-4 bg-[#FF8C00] text-white px-3.5 py-1 rounded-full text-xs font-black shadow border border-orange-400">
                          ₹{v.per_km_rate}/km
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <div className="text-[10px] font-black text-[#0B5ED7] uppercase tracking-wider">{v.brand || 'NJ Tours'} • {v.category}</div>
                          <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#0B5ED7] transition-colors duration-300 font-serif mt-0.5">
                            {v.name}
                          </h3>
                        </div>

                        {/* Badges */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-bold">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#0B5ED7]" />
                            <span>{v.seating_capacity} Passengers</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-[#FF8C00]" />
                            <span>{luggageCap}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
                            <Fuel className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{v.fuel_type || 'Diesel'}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
                            <Wind className="w-3.5 h-3.5 text-sky-500" />
                            <span>{v.is_ac ? 'AC Cabin' : 'Non-AC'}</span>
                          </div>
                        </div>

                        {/* Rates Footer */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-medium">Daily Rate</span>
                          <span className="text-base font-extrabold text-[#0F172A]">₹{v.per_day_rate}/day</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 pt-0 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedModalVehicle(v)}
                        className="bg-slate-50 hover:bg-slate-100 text-[#0F172A] font-bold text-xs py-3 rounded-[12px] border border-slate-200 transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectVehicle && onSelectVehicle(v)}
                        className="bg-[#FF8C00] hover:bg-[#E07B00] text-white font-extrabold text-xs py-3 rounded-[12px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* VIEW DETAILS MODAL */}
      <AnimatePresence>
        {selectedModalVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" 
              onClick={() => setSelectedModalVehicle(null)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-[20px] max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative z-10 text-[#0F172A] flex flex-col"
            >
              <button
                onClick={() => setSelectedModalVehicle(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white text-slate-800 hover:bg-slate-50 transition-colors shadow border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-56 bg-slate-100">
                <img
                  src={selectedModalVehicle.image_url || DEFAULT_IMAGES[selectedModalVehicle.category] || DEFAULT_IMAGES.SUV}
                  alt={selectedModalVehicle.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="text-[10px] font-black text-[#FF8C00] uppercase tracking-wider">{selectedModalVehicle.brand} • {selectedModalVehicle.vehicle_number}</div>
                  <h3 className="text-2xl font-bold font-serif text-white">{selectedModalVehicle.name}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4 text-xs font-semibold text-slate-700">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black block uppercase">Category</span>
                    <span className="text-sm font-bold text-slate-900">{selectedModalVehicle.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black block uppercase">Seating</span>
                    <span className="text-sm font-bold text-slate-900">{selectedModalVehicle.seating_capacity} Seats</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black block uppercase">Per KM Rate</span>
                    <span className="text-sm font-bold text-[#0B5ED7]">₹{selectedModalVehicle.per_km_rate}/km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black block uppercase">Daily Flat Rate</span>
                    <span className="text-sm font-bold text-[#FF8C00]">₹{selectedModalVehicle.per_day_rate}/day</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Commercial Insurance & All-India Tourist Permit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500" />
                    <span>Experienced & Uniformed Chauffeur Included</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-black block uppercase">Rate per KM</span>
                  <span className="text-xl font-extrabold text-[#0B5ED7]">₹{selectedModalVehicle.per_km_rate}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectVehicle && onSelectVehicle(selectedModalVehicle);
                    setSelectedModalVehicle(null);
                  }}
                  className="bg-[#FF8C00] hover:bg-[#E07B00] text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
