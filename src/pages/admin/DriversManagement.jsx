import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserCheck, Shield, Plus, X, User, Phone, Car, Star, Check, Search, Filter, FileText, CheckCircle2, XCircle, Eye, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../../constants/routes';
import { driverApi } from '../../api/driver.api';
import { useNotification } from '../../context/NotificationContext';

export default function DriversManagement() {
  const { t } = useTranslation();
  const { addToast } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await driverApi.listDrivers();
      if (res?.data?.data && Array.isArray(res.data.data)) {
        const mapped = res.data.data.map(d => ({
          id: d.id,
          name: d.user?.full_name || "Unknown Chauffeur",
          phone: d.user?.phone || "N/A",
          vehicle: d.assigned_vehicle ? `${d.assigned_vehicle.name || d.assigned_vehicle.brand + ' ' + d.assigned_vehicle.model_name} (${d.assigned_vehicle.vehicle_number})` : "Unassigned",
          status: d.user?.is_active ? "Active" : "Inactive",
          availability: d.status || "Offline",
          rating: "4.90",
          licenseStatus: "Verified",
          verificationStatus: d.user?.is_active ? "Approved" : "Pending",
          license: d.license_number,
          tripsCompleted: 0
        }));
        setDrivers(mapped);
      }
    } catch (err) {
      console.error("Failed to load drivers:", err);
      addToast(err?.message || "Failed to load drivers list.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [rating, setRating] = useState('5.00');
  const [license, setLicense] = useState('');

  const handleOpenModal = () => {
    setName('');
    setPhone('');
    setVehicle('');
    setRating('5.00');
    setLicense('');
    setIsModalOpen(true);
  };

  const handleApprove = (id) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, verificationStatus: "Approved", licenseStatus: "Verified", status: "Active" } : d));
  };

  const handleReject = (id) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, verificationStatus: "Rejected", status: "Inactive" } : d));
  };

  const handleToggleStatus = (id) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newId = `DRV-${101 + drivers.length}`;
    const newDriver = {
      id: newId,
      name: name.trim(),
      phone: phone.trim(),
      vehicle: vehicle.trim() || "Unassigned",
      status: "Active",
      availability: "Available",
      rating: parseFloat(rating).toFixed(2),
      licenseStatus: "Verified",
      verificationStatus: "Approved",
      license: license.trim() || "MH12-2026-0000000",
      tripsCompleted: 0
    };

    setDrivers([...drivers, newDriver]);
    setIsModalOpen(false);
  };

  const filtered = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.phone.includes(searchTerm) ||
                          d.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerification = verificationFilter === 'ALL' || d.verificationStatus === verificationFilter;
    return matchesSearch && matchesVerification;
  });

  return (
    <div className="space-y-6 text-white relative pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black">{t("admin.driversRoster", "Chauffeurs & Drivers Roster")}</h2>
          <p className="text-xs text-slate-400">{t("admin.activeDriversSub", "Police-Verified Drivers Active Across Pan-India Hubs")}</p>
        </div>
        <Link 
          to={ROUTES.ADMIN_ADD_DRIVER} 
          className="bg-[#0B5ED7] hover:bg-blue-700 text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all"
        >
          <Plus className="w-4 h-4" /> {t("admin.registerDriver", "Register New Driver")}
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search driver name, ID or phone..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0B5ED7]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
          <Filter className="w-4 h-4" /> Verification:
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Drivers</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending Audit</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-900/50">
                <th className="p-4">Driver</th>
                <th className="p-4">Phone</th>
                <th className="p-4">License Status</th>
                <th className="p-4">Assigned Vehicle</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0B5ED7]" />
                    <span>Loading Chauffeurs...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    No drivers registered matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {d.name[0]}
                      </div>
                      <div>
                        <div>{d.name}</div>
                        <div className="text-[10px] font-mono text-amber-400">{d.id} • ⭐ {d.rating}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{d.phone}</td>
                    <td className="p-4 font-mono text-slate-400 text-[11px]">
                      <div>{d.license}</div>
                      <span className="text-[10px] text-emerald-400 font-semibold">{d.licenseStatus}</span>
                    </td>
                    <td className="p-4 text-slate-300">{d.vehicle}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                        d.availability === 'Available' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                        d.availability === 'On Duty' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                        'bg-slate-900 text-slate-500 border-slate-800'
                      }`}>
                        {d.availability}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                        d.verificationStatus === 'Approved' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                        d.verificationStatus === 'Pending' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                        'bg-rose-950 text-rose-400 border-rose-800'
                      }`}>
                        {d.verificationStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleStatus(d.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                          d.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        {d.status}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {d.verificationStatus === 'Pending' && (
                          <>
                            <button onClick={() => handleApprove(d.id)} className="p-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg hover:bg-emerald-900" title="Approve Driver">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleReject(d.id)} className="p-1.5 bg-rose-950 text-rose-400 border border-rose-800 rounded-lg hover:bg-rose-900" title="Reject Driver">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button onClick={() => { setSelectedDriver(d); setIsProfileOpen(true); }} className="p-1.5 bg-slate-900 text-slate-300 rounded-lg hover:bg-slate-800" title="View Profile & Documents">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Profile Modal */}
      {isProfileOpen && selectedDriver && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Chauffeur Profile & Verification</h3>
              <button onClick={() => setIsProfileOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-500">Driver ID:</span> <span className="font-mono text-amber-400 font-bold">{selectedDriver.id}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-500">Name:</span> <span className="font-bold text-white">{selectedDriver.name}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-500">Phone:</span> <span>{selectedDriver.phone}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-500">License No:</span> <span className="font-mono text-slate-200">{selectedDriver.license}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-500">Vehicle Assigned:</span> <span>{selectedDriver.vehicle}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-500">Completed Trips:</span> <span className="font-bold text-emerald-400">{selectedDriver.tripsCompleted} Trips</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">Police Background Audit:</span> <span className="text-emerald-400 font-bold">Passed & Verified</span></div>
            </div>
            <button onClick={() => setIsProfileOpen(false)} className="w-full bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Close</button>
          </div>
        </div>
      )}

      {/* Register Driver Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden z-10 text-left p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white">Register New Chauffeur</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Anand Shinde" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                  <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +91 99887 76655" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">License Number</label>
                  <input type="text" value={license} onChange={(e) => setLicense(e.target.value)} placeholder="e.g. MH12-2022-0045612" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Assigned Vehicle</label>
                  <input type="text" value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="e.g. Innova Crysta (MH 12 XY 9999)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#0B5ED7] hover:bg-blue-700 py-2.5 rounded-xl font-bold text-xs text-white">Register Driver</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
