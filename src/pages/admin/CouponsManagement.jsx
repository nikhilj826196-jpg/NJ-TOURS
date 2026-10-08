import React, { useState } from 'react';
import { Tag, Plus, Search, Edit2, Trash2, Calendar, Percent, Check, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function CouponsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [coupons, setCoupons] = useState([
    { id: "CPN-101", code: "WELCOME10", discountType: "PERCENTAGE", discountValue: 10, minAmount: 1500, maxDiscount: 500, expiryDate: "2026-12-31", usageLimit: 500, status: "Active" },
    { id: "CPN-102", code: "FESTIVE500", discountType: "FIXED", discountValue: 500, minAmount: 4000, maxDiscount: 500, expiryDate: "2026-10-31", usageLimit: 200, status: "Active" },
    { id: "CPN-103", code: "SUMMER15", discountType: "PERCENTAGE", discountValue: 15, minAmount: 3000, maxDiscount: 1000, expiryDate: "2026-06-30", usageLimit: 100, status: "Inactive" }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  const handleOpenAdd = () => {
    setSelectedCoupon(null);
    setCode('');
    setDiscountType('PERCENTAGE');
    setDiscountValue('');
    setMinAmount('');
    setMaxDiscount('');
    setExpiryDate('');
    setUsageLimit('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setSelectedCoupon(c);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setMinAmount(c.minAmount);
    setMaxDiscount(c.maxDiscount);
    setExpiryDate(c.expiryDate);
    setUsageLimit(c.usageLimit);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    if (selectedCoupon) {
      setCoupons(coupons.map(c => c.id === selectedCoupon.id ? {
        ...c, code: code.toUpperCase(), discountType, discountValue: Number(discountValue),
        minAmount: Number(minAmount || 0), maxDiscount: Number(maxDiscount || 0), expiryDate, usageLimit: Number(usageLimit || 100)
      } : c));
    } else {
      const newC = {
        id: `CPN-${101 + coupons.length}`,
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minAmount: Number(minAmount || 0),
        maxDiscount: Number(maxDiscount || 0),
        expiryDate: expiryDate || "2026-12-31",
        usageLimit: Number(usageLimit || 100),
        status: "Active"
      };
      setCoupons([...coupons, newC]);
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
  };

  const handleDelete = () => {
    if (selectedCoupon) {
      setCoupons(coupons.filter(c => c.id !== selectedCoupon.id));
      setIsDeleteOpen(false);
    }
  };

  const filtered = coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 text-white pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black">Coupons & Promo Codes</h2>
          <p className="text-xs text-slate-400">Manage promotional discounts, minimum thresholds, and expiry limits</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
          <Plus className="w-4 h-4" /> Create Promo Coupon
        </button>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search coupon code..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0B5ED7]"
          />
        </div>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-900/50">
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Min Spend</th>
                <th className="py-3.5 px-4">Max Discount</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Limit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-black text-amber-400 text-sm tracking-wider">{c.code}</td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : formatCurrency(c.discountValue)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{formatCurrency(c.minAmount)}</td>
                  <td className="py-3.5 px-4 text-slate-300">{formatCurrency(c.maxDiscount)}</td>
                  <td className="py-3.5 px-4 text-slate-400">{c.expiryDate}</td>
                  <td className="py-3.5 px-4 text-slate-300">{c.usageLimit} uses</td>
                  <td className="py-3.5 px-4">
                    <button 
                      onClick={() => handleToggleStatus(c.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                        c.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {c.status}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => handleOpenEdit(c)} className="p-1.5 rounded-lg bg-slate-900 text-amber-400 hover:bg-slate-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setSelectedCoupon(c); setIsDeleteOpen(true); }} className="p-1.5 rounded-lg bg-slate-900 text-rose-400 hover:bg-slate-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">{selectedCoupon ? "Edit Coupon Code" : "Create New Coupon Code"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Coupon Code (Uppercase)</label>
                <input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. MONSOON20" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Discount Type</label>
                  <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Discount Value</label>
                  <input type="number" required value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="e.g. 15 or 500" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Min Spend (₹)</label>
                  <input type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} placeholder="e.g. 2000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Max Discount (₹)</label>
                  <input type="number" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} placeholder="e.g. 800" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Expiry Date</label>
                  <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Usage Limit</label>
                  <input type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="e.g. 100" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
              <button type="submit" className="flex-1 bg-[#0B5ED7] hover:bg-blue-700 py-2.5 rounded-xl font-bold text-xs text-white">
                {selectedCoupon ? "Save Changes" : "Create Coupon"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirmation */}
      {isDeleteOpen && selectedCoupon && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Delete Coupon Code</h3>
              <p className="text-xs text-slate-400 mt-1">Are you sure you want to delete <span className="text-amber-400 font-mono font-bold">{selectedCoupon.code}</span>?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 py-2.5 rounded-xl font-bold text-xs text-white">Delete Coupon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
