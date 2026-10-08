import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, Eye, Search, Filter, X, Plus } from 'lucide-react';

export default function MediaManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [mediaList, setMediaList] = useState([
    { id: "MED-101", title: "Innova Crysta Exterior Front", category: "Vehicles", url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80", uploadedAt: "2026-02-05", size: "1.2 MB" },
    { id: "MED-102", title: "Shirdi Pilgrimage Temple Exterior", category: "Destinations", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", uploadedAt: "2026-02-04", size: "2.4 MB" },
    { id: "MED-103", title: "Force Urbania 26 Luxury Seater", category: "Vehicles", url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80", uploadedAt: "2026-02-01", size: "1.8 MB" },
    { id: "MED-104", title: "Alibaug Sea Beach Sunset", category: "Destinations", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", uploadedAt: "2026-01-28", size: "3.1 MB" }
  ]);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Upload Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Vehicles');
  const [newUrl, setNewUrl] = useState('');

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newItem = {
      id: `MED-${101 + mediaList.length}`,
      title: newTitle,
      category: newCategory,
      url: newUrl,
      uploadedAt: new Date().toISOString().split('T')[0],
      size: "1.5 MB"
    };

    setMediaList([newItem, ...mediaList]);
    setIsUploadOpen(false);
    setNewTitle('');
    setNewUrl('');
  };

  const handleDelete = () => {
    if (selectedMedia) {
      setMediaList(mediaList.filter(m => m.id !== selectedMedia.id));
      setIsDeleteOpen(false);
    }
  };

  const filtered = mediaList.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-white pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black">Media Assets & Image Library</h2>
          <p className="text-xs text-slate-400">Manage vehicle photos, tour destination banners, and media assets</p>
        </div>
        <button onClick={() => setIsUploadOpen(true)} className="bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
          <Upload className="w-4 h-4" /> Upload New Media
        </button>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search media by title..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0B5ED7]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
          <Filter className="w-4 h-4" /> Category:
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Destinations">Destinations</option>
            <option value="Documents">Documents</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((m) => (
          <div key={m.id} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between group">
            <div className="relative h-40 bg-slate-900 overflow-hidden">
              <img src={m.url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => { setSelectedMedia(m); setIsPreviewOpen(true); }} className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => { setSelectedMedia(m); setIsDeleteOpen(true); }} className="p-2 bg-slate-900 text-rose-400 rounded-xl hover:bg-slate-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-3.5 space-y-1 text-xs">
              <div className="font-extrabold text-white truncate">{m.title}</div>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span className="text-amber-400">{m.category}</span>
                <span>{m.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {isPreviewOpen && selectedMedia && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-4 space-y-3">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-sm font-bold text-white">{selectedMedia.title}</h3>
              <button onClick={() => setIsPreviewOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <img src={selectedMedia.url} alt={selectedMedia.title} className="w-full max-h-[60vh] object-contain rounded-2xl bg-black" />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpload} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Upload Media Asset</h3>
              <button type="button" onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Asset Title</label>
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Innova Crysta Side View" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <option value="Vehicles">Vehicles</option>
                  <option value="Destinations">Destinations</option>
                  <option value="Documents">Documents</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Image URL</label>
                <input type="text" required value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsUploadOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
              <button type="submit" className="flex-1 bg-[#0B5ED7] hover:bg-blue-700 py-2.5 rounded-xl font-bold text-xs text-white">Upload Asset</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteOpen && selectedMedia && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Delete Media Asset</h3>
              <p className="text-xs text-slate-400 mt-1">Are you sure you want to delete <span className="text-white font-bold">{selectedMedia.title}</span>?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 py-2.5 rounded-xl font-bold text-xs text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
