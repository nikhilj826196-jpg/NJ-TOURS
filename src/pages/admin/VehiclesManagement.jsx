import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Car, Plus, Search, Filter, Edit2, Trash2, ShieldCheck, X, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function VehiclesManagement() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [vehicles, setVehicles] = useState([
    { id: "VH-101", number: "MH 04 ET 4020", brand: "Toyota", model: "Innova Crysta", type: "Luxury MUV", seats: 7, acType: "AC", fuel: "Diesel", pricePerKm: 18, assignedDriver: "Suresh Patil", status: "Available" },
    { id: "VH-102", number: "MH 12 AB 9822", brand: "Maruti Suzuki", model: "Swift Dzire", type: "Executive Sedan", seats: 4, acType: "AC", fuel: "CNG / Petrol", pricePerKm: 14, assignedDriver: "Ramesh Sharma", status: "Booked" },
    { id: "VH-103", number: "MH 02 CZ 1100", brand: "Force Motors", model: "Urbania 26", type: "Mini Bus", seats: 26, acType: "AC", fuel: "Diesel", pricePerKm: 35, assignedDriver: "Vijay Deshmukh", status: "Available" },
    { id: "VH-104", number: "MH 14 CD 5544", brand: "Tata", model: "Nexon EV", type: "Electric SUV", seats: 5, acType: "AC", fuel: "EV", pricePerKm: 16, assignedDriver: "Unassigned", status: "Maintenance" }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [number, setNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('Executive Sedan');
  const [seats, setSeats] = useState(4);
  const [acType, setAcType] = useState('AC');
  const [fuel, setFuel] = useState('Diesel');
  const [pricePerKm, setPricePerKm] = useState(15);
  const [status, setStatus] = useState('Available');
  const [assignedDriver, setAssignedDriver] = useState('');

  const handleOpenAdd = () => {
    setSelectedVehicle(null);
    setNumber('');
    setBrand('');
    setModel('');
    setType('Executive Sedan');
    setSeats(4);
    setAcType('AC');
    setFuel('Diesel');
    setPricePerKm(15);
    setStatus('Available');
    setAssignedDriver('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setSelectedVehicle(v);
    setNumber(v.number);
    setBrand(v.brand);
    setModel(v.model);
    setType(v.type);
    setSeats(v.seats);
    setAcType(v.acType);
    setFuel(v.fuel);
    setPricePerKm(v.pricePerKm);
    setStatus(v.status);
    setAssignedDriver(v.assignedDriver);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!number || !model) return;

    if (selectedVehicle) {
      setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? {
        ...v, number, brand, model, type, seats: Number(seats), acType, fuel, pricePerKm: Number(pricePerKm), status, assignedDriver
      } : v));
    } else {
      const newV = {
        id: `VH-${101 + vehicles.length}`,
        number, brand: brand || "Custom", model, type, seats: Number(seats), acType, fuel, pricePerKm: Number(pricePerKm), status, assignedDriver: assignedDriver || "Unassigned"
      };
      setVehicles([...vehicles, newV]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedVehicle) {
      setVehicles(vehicles.filter(v => v.id !== selectedVehicle.id));
      setIsDeleteOpen(false);
    }
  };

  const filtered = vehicles.filter(v => {
    const matchesSearch = v.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-white pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black">{t("dash.fleetControl", "Fleet Vehicles Control")}</h2>
          <p className="text-xs text-slate-400">Manage 250+ transport assets, pricing per km, and vehicle availability</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
          <Plus className="w-4 h-4" /> Add New Vehicle
        </button>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vehicle number, model or brand..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0B5ED7]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
          <Filter className="w-4 h-4" /> Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((v) => (
          <div key={v.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-[#0B5ED7] text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  {v.type}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                  v.status === 'Available' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                  v.status === 'Booked' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                  v.status === 'Maintenance' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                  'bg-slate-900 text-slate-500 border-slate-800'
                }`}>
                  {v.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">{v.brand} {v.model}</h3>
                <span className="text-xs font-mono text-amber-400 font-bold">{v.number}</span>
              </div>

              <div className="text-xs text-slate-400 space-y-0.5">
                <div>Seating: <span className="text-white font-bold">{v.seats} Seats</span> ({v.acType}, {v.fuel})</div>
                <div>Chauffeur: <span className="text-slate-300 font-semibold">{v.assignedDriver}</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Rate / Km</span>
                <span className="text-base font-black text-amber-400">₹{v.pricePerKm}/km</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => handleOpenEdit(v)} className="p-2 bg-slate-900 text-amber-400 rounded-xl hover:bg-slate-800">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => { setSelectedVehicle(v); setIsDeleteOpen(true); }} className="p-2 bg-slate-900 text-rose-400 rounded-xl hover:bg-slate-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">{selectedVehicle ? "Edit Vehicle Asset" : "Add New Vehicle Asset"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Plate Number</label>
                  <input type="text" required value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. MH 12 AB 9999" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Brand</label>
                  <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Toyota" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Model Name</label>
                  <input type="text" required value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Innova Crysta" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                    <option value="Executive Sedan">Executive Sedan</option>
                    <option value="Luxury MUV">Luxury MUV</option>
                    <option value="Premium SUV">Premium SUV</option>
                    <option value="Mini Bus">Mini Bus</option>
                    <option value="Electric SUV">Electric SUV</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Seats</label>
                  <input type="number" value={seats} onChange={(e) => setSeats(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Aircon</label>
                  <select value={acType} onChange={(e) => setAcType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Rate/Km (₹)</label>
                  <input type="number" value={pricePerKm} onChange={(e) => setPricePerKm(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Assign Driver</label>
                  <input type="text" value={assignedDriver} onChange={(e) => setAssignedDriver(e.target.value)} placeholder="Chauffeur name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
              <button type="submit" className="flex-1 bg-[#0B5ED7] hover:bg-blue-700 py-2.5 rounded-xl font-bold text-xs text-white">Save Vehicle</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirmation */}
      {isDeleteOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Deactivate / Delete Vehicle</h3>
              <p className="text-xs text-slate-400 mt-1">Are you sure you want to remove <span className="text-amber-400 font-mono font-bold">{selectedVehicle.number}</span>?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 py-2.5 rounded-xl font-bold text-xs text-white">Remove Vehicle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
