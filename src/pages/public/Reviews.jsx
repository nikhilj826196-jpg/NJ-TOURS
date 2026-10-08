import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, Plus, Check } from 'lucide-react';
import TestimonialsSection from '../../components/TestimonialsSection';
import { useTranslation } from 'react-i18next';

export default function Reviews() {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');

  const [reviewsList, setReviewsList] = useState([
    { name: "Rohan Kapoor", rating: 5, comment: "Punctual driver and super clean Innova Crysta for our Mumbai-Goa trip!", date: "Today" },
    { name: "Meera Nair", rating: 5, comment: "Smooth booking process & excellent AC tempo traveller for office picnic.", date: "Yesterday" },
    { name: "Amit Shah", rating: 4, comment: "Great rates and transparent billing. Highly recommended.", date: "3 days ago" }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment || !name) return;

    const newRev = {
      name,
      rating,
      comment,
      date: "Just now"
    };

    setReviewsList([newRev, ...reviewsList]);
    setSuccess(true);
    setComment('');
    setName('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-50 font-sans min-h-screen">

      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#1E293B] text-white py-16 px-4 sm:px-6 text-center space-y-3 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-[#0B5ED7]_1px,transparent_1px] [background-size:20px_20px] pointer-events-none" />
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Customer Testimonials & Ratings</h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium">
          Hear from our thousands of verified passengers, business clients, and tour groups
        </p>
      </div>

      {/* Featured Testimonials */}
      <TestimonialsSection />

      {/* Write a Review Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Create Review Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-left h-fit">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#0B5ED7]" /> Share Your Experience
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Let us know how your journey was with NJ Tours</p>
          </div>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold p-3.5 rounded-xl flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Review submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anand Shinde"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#0B5ED7]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Comment</label>
              <textarea
                rows="4"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the car cleanliness, driving safety, and punctuality?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#0B5ED7]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow"
            >
              <Check className="w-4 h-4" /> Submit Review
            </button>
          </form>
        </div>

        {/* Right Column: User Reviews List (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-black text-slate-900 text-left border-b border-slate-200 pb-3">User Feedback Board</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviewsList.map((rev, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between text-left space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900">{rev.name}</h4>
                    <div className="flex items-center text-amber-400 text-[11px] font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" /> {rev.rating}.0
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">"{rev.comment}"</p>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {rev.date}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
