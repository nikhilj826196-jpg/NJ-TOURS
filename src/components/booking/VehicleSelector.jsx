import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { VEHICLE_FLEET } from '../../data/toursData';
import { vehicleApi } from '../../api/vehicle.api';

export default function VehicleSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [dbVehicles, setDbVehicles] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    vehicleApi.listVehicles({ isAvailable: true })
      .then(res => {
        if (isMounted && res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setDbVehicles(res.data.data);
          // If value is not yet a real UUID, default to the first real vehicle's ID
          if (!value || value.startsWith('vh-')) {
            onChange(res.data.data[0].id);
          }
        }
      })
      .catch(err => console.warn("Failed to load DB vehicles:", err));

    return () => { isMounted = false; };
  }, []);

  const vehiclesToDisplay = dbVehicles.length > 0 ? dbVehicles : VEHICLE_FLEET;
  const selectedVehicle = vehiclesToDisplay.find(v => v.id === value) || vehiclesToDisplay[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative text-left" ref={containerRef}>
      {/* Custom Select Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-[56px] px-3.5 rounded-[14px] border border-[#E5E7EB] hover:border-[#F97316] focus:border-[#F97316] bg-[#F8FAFC] hover:bg-white transition-all flex items-center justify-between gap-2 shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img
            src={selectedVehicle.image_url || selectedVehicle.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80"}
            alt={selectedVehicle.name}
            className="w-7 h-7 rounded-lg object-cover border border-[#E5E7EB] shrink-0"
          />
          <div className="truncate text-left">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{selectedVehicle.category || selectedVehicle.type || 'Vehicle'}</div>
            <div className="text-xs font-bold text-[#0F172A] truncate">{selectedVehicle.name}</div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-[16px] shadow-xl border border-[#E5E7EB] py-1.5 z-50 animate-fadeIn max-h-64 overflow-y-auto">
          {vehiclesToDisplay.map((v) => {
            const isSelected = v.id === value;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  onChange(v.id);
                  setOpen(false);
                }}
                className={`w-full p-2.5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-orange-50 text-[#F97316] font-extrabold' : 'hover:bg-slate-50 text-slate-800 font-bold'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <img
                    src={v.image_url || v.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80"}
                    alt={v.name}
                    className="w-7 h-7 rounded-lg object-cover border border-[#E5E7EB] shrink-0"
                  />
                  <div className="truncate text-xs">
                    <div>{v.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">₹{v.per_km_rate || v.pricePerKm || 15}/km</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#F97316] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
