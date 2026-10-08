import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, Phone, Car, Radio, ShieldCheck } from 'lucide-react';

export default function CustomerTracking() {
  const { t } = useTranslation();
  const [telemetry, setTelemetry] = useState({
    speed: 48,
    lat: 19.0760,
    lng: 72.8777,
    status: 'Moving',
    nextStop: 'Goa Border Toll Plaza',
    eta: '4 hrs 12 mins',
    distanceLeft: '210 km'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate live telemetry variations
      setTelemetry(prev => ({
        ...prev,
        speed: Math.floor(40 + Math.random() * 20),
        lat: prev.lat + 0.0002 * (Math.random() - 0.5),
        lng: prev.lng + 0.0002 * (Math.random() - 0.5)
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-black text-slate-900">Live Vehicle Tracking</h2>
        <p className="text-xs text-slate-500">Real-time GPS telematics status and ETA of your active driver ride</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Info Column */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-4 border border-slate-800 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                {telemetry.status}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> GPS Connected
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Driver Assigned</div>
              <h3 className="text-base font-extrabold text-white mt-0.5">Ramesh Sharma</h3>
              <p className="text-xs text-amber-400 font-medium">Innova Crysta ZX (MH 04 ET 4020)</p>
            </div>

            <div className="border-t border-slate-800 pt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Current Speed</span>
                <span className="font-bold text-white text-sm">{telemetry.speed} km/h</span>
              </div>
              <div>
                <span className="text-slate-500 block">ETA to Drop</span>
                <span className="font-bold text-white text-sm">{telemetry.eta}</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Next Point: <strong>{telemetry.nextStop}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Navigation className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Remaining: <strong>{telemetry.distanceLeft}</strong></span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="tel:+919822011223"
                className="w-full bg-[#0B5ED7] hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow"
              >
                <Phone className="w-3.5 h-3.5" /> Call Driver Partner
              </a>
            </div>
          </div>
        </div>

        {/* Live Simulated Map Frame */}
        <div className="lg:col-span-2 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden min-h-[350px] relative flex items-center justify-center p-6 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="absolute top-4 left-4 z-10 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold flex items-center gap-2">
            <Car className="w-4 h-4 text-[#0B5ED7]" />
            <span>Telemetry: Lat {telemetry.lat.toFixed(4)}, Lng {telemetry.lng.toFixed(4)}</span>
          </div>

          {/* Simple Vector Dashboard Visual Map */}
          <div className="space-y-4 text-center z-10">
            <div className="w-16 h-16 rounded-full bg-[#0B5ED7]/10 text-[#0B5ED7] flex items-center justify-center mx-auto border-2 border-[#0B5ED7] animate-pulse">
              <Navigation className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800">Simulating Live Telematics Path</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Vehicle is active on Mumbai-Pune Expressway route heading towards Calangute, Goa.</p>
            </div>
          </div>

          <div className="absolute inset-0 bg-[#0B5ED7]/5 mix-blend-multiply pointer-events-none" />
        </div>

      </div>
    </div>
  );
}
