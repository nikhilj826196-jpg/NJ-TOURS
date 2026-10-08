import React, { useState } from 'react';
import { Package, Plus, Search, Filter, Edit2, Trash2, Eye, MapPin, Clock, DollarSign, X, Check, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function TourPackagesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [packages, setPackages] = useState([
    { id: "PKG-101", name: "Spiritual Shirdi & Shanishingnapur Tour", destination: "Shirdi", duration: "2 Days / 1 Night", price: 6500, status: "Active", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80", description: "Sacred pilgrimage journey with comfortable AC sedan/suv and VIP darshan assistance." },
    { id: "PKG-102", name: "Mahabaleshwar & Panchgani Hill Escape", destination: "Mahabaleshwar", duration: "3 Days / 2 Nights", price: 11200, status: "Active", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", description: "Scenic hill station getaway including strawberry farm visits & sunrise points." },
    { id: "PKG-103", name: "Konkan Coastal Heritage Expedition", destination: "Alibaug & Ratnagiri", duration: "4 Days / 3 Nights", price: 16800, status: "Active", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80", description: "Explore pristine white sand beaches, sea forts, and authentic Malvani cuisine." }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleOpenAdd = () => {
    setSelectedPkg(null);
    setName('');
    setDestination('');
    setDuration('');
    setPrice('');
    setDescription('');
    setImage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setSelectedPkg(pkg);
    setName(pkg.name);
    setDestination(pkg.destination);
    setDuration(pkg.duration);
    setPrice(pkg.price);
    setDescription(pkg.description);
    setImage(pkg.image);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !destination || !price) return;

    if (selectedPkg) {
      setPackages(packages.map(p => p.id === selectedPkg.id ? {
        ...p, name, destination, duration, price: Number(price), description, image: image || p.image
      } : p));
    } else {
      const newPkg = {
        id: `PKG-${101 + packages.length}`,
        name, destination, duration: duration || "3 Days", price: Number(price),
        status: "Active", image: image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80",
        description: description || "Customized luxury tour package."
      };
      setPackages([...packages, newPkg]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedPkg) {
      setPackages(packages.filter(p => p.id !== selectedPkg.id));
      setIsDeleteOpen(false);
    }
  };

  const handleToggleStatus = (id) => {
    setPackages(packages.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p));
  };

  const filtered = packages.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.destination.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 text-white pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black">Tour Packages Management</h2>
          <p className="text-xs text-slate-400">Create, edit, and update holiday & pilgrimage itineraries</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
          <Plus className="w-4 h-4" /> Create New Package
        </button>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tour packages by title or destination..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0B5ED7]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((pkg) => (
          <div key={pkg.id} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-amber-400 border border-slate-800">
                  {pkg.id}
                </div>
                <button 
                  onClick={() => handleToggleStatus(pkg.id)}
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold border ${
                    pkg.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-rose-950 text-rose-400 border-rose-800'
                  }`}
                >
                  {pkg.status}
                </button>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-[#0B5ED7]" /> {pkg.destination}
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> {pkg.duration}
                </div>
                <h3 className="text-base font-extrabold text-white">{pkg.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{pkg.description}</p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-800/80 flex items-center justify-between mt-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting From</span>
                <span className="text-lg font-black text-amber-400">{formatCurrency(pkg.price)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => handleOpenEdit(pkg)} className="p-2 bg-slate-900 text-amber-400 rounded-xl hover:bg-slate-800">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => { setSelectedPkg(pkg); setIsDeleteOpen(true); }} className="p-2 bg-slate-900 text-rose-400 rounded-xl hover:bg-slate-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">{selectedPkg ? "Edit Tour Package" : "Create New Tour Package"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Package Title</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Shirdi & Nashik Divine Yatra" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Destination</label>
                  <input type="text" required value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Shirdi" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Duration</label>
                  <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 2 Days / 1 Night" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Price (₹)</label>
                  <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 7500" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Image URL</label>
                  <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description & Inclusions</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter details..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
              <button type="submit" className="flex-1 bg-[#0B5ED7] hover:bg-blue-700 py-2.5 rounded-xl font-bold text-xs text-white">
                {selectedPkg ? "Save Changes" : "Publish Package"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirmation */}
      {isDeleteOpen && selectedPkg && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Delete Tour Package</h3>
              <p className="text-xs text-slate-400 mt-1">Are you sure you want to delete <span className="text-white font-bold">{selectedPkg.name}</span>?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 py-2.5 rounded-xl font-bold text-xs text-white">Delete Package</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
