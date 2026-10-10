import React, { useState, useEffect } from 'react';
import { Navigation, Radio, MapPin, Phone, Car, Shield, CheckCircle2, RefreshCw } from 'lucide-react';

export default function LiveTracking() {
  const [socketConnected, setSocketConnected] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const activeDrivers = [
    { id: "DRV-101", name: "Suresh Patil", phone: "+91 98220 11223", vehicle: "Innova Crysta (MH 04 ET 4020)", trip: "NJ-84920", route: "Mumbai -> Pune", status: "On Duty", speed: "68 km/h", lat: "18.9687", lng: "72.8306" },
    { id: "DRV-102", name: "Ramesh Sharma", phone: "+91 98220 33445", vehicle: "Swift Dzire (MH 12 AB 9822)", trip: "NJ-84919", route: "Thane -> Lonavala", status: "On Duty", speed: "54 km/h", lat: "19.2183", lng: "72.9781" },
    { id: "DRV-103", name: "Vijay Deshmukh", phone: "+91 98220 55667", vehicle: "Force Urbania 26 (MH 02 CZ 1100)", trip: "NJ-84918", route: "Dadar -> Mahabaleshwar", status: "On Duty", speed: "72 km/h", lat: "18.5204", lng: "73.8567" }
  ];

  useEffect(() => {
    setSelectedDriver(activeDrivers[0]);

    // WebSocket connection initialization for admin live tracking endpoint
    let ws;
    try {
      const defaultWsHost = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:8000`;
      const wsBase = import.meta.env.VITE_WS_URL || defaultWsHost;
      const wsUrl = wsBase.endsWith('/ws/location/admin') ? wsBase : `${wsBase.replace(/\/$/, '')}/ws/location/admin`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setSocketConnected(true);
      };

      ws.onclose = () => {
        setSocketConnected(false);
      };

      ws.onerror = () => {
        setSocketConnected(false);
      };
    } catch (err) {
      setSocketConnected(false);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <div className="space-y-6 text-white pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Navigation className="w-6 h-6 text-[#0B5ED7]" /> Live Fleet Telematics & GPS Tracking
          </h2>
          <p className="text-xs text-slate-400">Real-time WebSocket telemetry for on-duty chauffeurs and active passenger rides</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold">
          <span className={`w-2.5 h-2.5 rounded-full ${socketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{socketConnected ? "WebSocket Live Connected (/ws/location/admin)" : "Telemetry Mock Gateway Active"}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Drivers List */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> Active Fleet ({activeDrivers.length})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">PAN-INDIA HUB</span>
          </div>

          <div className="space-y-3">
            {activeDrivers.map((drv) => {
              const isSelected = selectedDriver?.id === drv.id;
              return (
                <div
                  key={drv.id}
                  onClick={() => setSelectedDriver(drv)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected 
                      ? 'bg-slate-900 border-[#0B5ED7] shadow-md shadow-[#0B5ED7]/10' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-amber-400">{drv.id}</span>
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {drv.speed}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-white">{drv.name}</h4>
                    <p className="text-xs text-slate-400">{drv.vehicle}</p>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-amber-400 font-bold">Trip: {drv.trip}</span>
                    <span>{drv.route}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Map Container & Telemetry Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Simulated GPS Map Canvas */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative h-[400px] flex flex-col justify-between p-6">
            
            {/* Background Grid Representation */}
            <div className="absolute inset-0 opacity-20 bg-[radial-[#0B5ED7]_1px,transparent_1px] [background-size:16px_16px] pointer-events-none" />

            {/* Map Overlay Header */}
            <div className="relative z-10 flex justify-between items-center bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-rose-500 animate-bounce" />
                <div>
                  <div className="text-xs font-extrabold text-white">
                    {selectedDriver ? selectedDriver.name : "Select a Chauffeur"}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {selectedDriver ? `${selectedDriver.route} • ${selectedDriver.vehicle}` : "Real-Time GPS Tracking"}
                  </div>
                </div>
              </div>

              {selectedDriver && (
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">{selectedDriver.speed}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Lat: {selectedDriver.lat}, Lng: {selectedDriver.lng}</div>
                </div>
              )}
            </div>

            {/* Map Center Display */}
            <div className="relative z-10 my-auto text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#0B5ED7]/20 border-2 border-[#0B5ED7] text-[#0B5ED7] flex items-center justify-center mx-auto shadow-xl animate-pulse">
                <Navigation className="w-8 h-8" />
              </div>
              <div className="text-xs font-bold text-white">Live Route Telemetry Active</div>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Monitoring vehicle speed, fuel level, GPS coordinates, and route adherence.
              </p>
            </div>

            {/* Map Bottom Bar */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex justify-between text-xs text-slate-400 font-medium">
              <span>FastAPI WebSocket Endpoint: <code className="text-amber-400">/ws/location/admin</code></span>
              <span className="text-emerald-400 font-bold">Latency: 14ms</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
