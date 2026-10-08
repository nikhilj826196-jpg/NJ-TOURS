import React, { useState } from 'react';
import { Star, Eye, EyeOff, Trash2, Search, Filter } from 'lucide-react';

export default function ReviewsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  const [reviews, setReviews] = useState([
    { id: "REV-501", customer: "Rohan Kapoor", bookingId: "NJ-84920", rating: 5, comment: "Punctual driver and super clean Innova Crysta for our Mumbai-Goa trip!", date: "2026-02-08", status: "Visible" },
    { id: "REV-502", customer: "Meera Nair", bookingId: "NJ-84918", rating: 5, comment: "Smooth booking process & excellent AC tempo traveller for office picnic.", date: "2026-02-07", status: "Visible" },
    { id: "REV-503", customer: "Amit Shah", bookingId: "NJ-84915", rating: 2, comment: "Driver arrived 15 mins late due to traffic near Western Express Highway.", date: "2026-02-05", status: "Hidden" },
    { id: "REV-504", customer: "Sunita Reddy", bookingId: "NJ-84912", rating: 4, comment: "Very good experience overall. Car was well maintained and clean.", date: "2026-02-04", status: "Visible" }
  ]);

  const [selectedReview, setSelectedReview] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleToggleStatus = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: r.status === 'Visible' ? 'Hidden' : 'Visible' } : r));
  };

  const handleDelete = () => {
    if (selectedReview) {
      setReviews(reviews.filter(r => r.id !== selectedReview.id));
      setIsDeleteOpen(false);
    }
  };

  const filtered = reviews.filter(r => {
    const matchesSearch = r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'ALL' || r.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-6 text-white pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black">Customer Reviews & Feedback</h2>
          <p className="text-xs text-slate-400">Moderate passenger feedback, ratings, and customer satisfaction</p>
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer, booking ID or review content..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0B5ED7]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
          <Filter className="w-4 h-4" /> Rating:
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">⭐ 5 Stars</option>
            <option value="4">⭐ 4 Stars</option>
            <option value="3">⭐ 3 Stars</option>
            <option value="2">⭐ 2 Stars</option>
            <option value="1">⭐ 1 Star</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-white">{r.customer}</h4>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{r.bookingId}</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {r.rating}.0
                </div>
              </div>

              <p className="text-xs text-slate-300 italic">"{r.comment}"</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">{r.date}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleToggleStatus(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold border flex items-center gap-1 cursor-pointer ${
                    r.status === 'Visible' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {r.status === 'Visible' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {r.status}
                </button>
                <button onClick={() => { setSelectedReview(r); setIsDeleteOpen(true); }} className="p-1.5 bg-slate-900 text-rose-400 rounded-lg hover:bg-slate-800">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      {isDeleteOpen && selectedReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Delete Customer Review</h3>
              <p className="text-xs text-slate-400 mt-1">Are you sure you want to delete review from <span className="text-white font-bold">{selectedReview.customer}</span>?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 py-2.5 rounded-xl font-bold text-xs text-white">Delete Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
