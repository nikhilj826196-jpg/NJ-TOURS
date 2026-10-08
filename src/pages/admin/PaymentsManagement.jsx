import React, { useState } from 'react';
import { CreditCard, Search, Filter } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function PaymentsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [payments, setPayments] = useState([
    { id: "PAY-9012", bookingId: "NJ-84920", customer: "Aarav Mehta", amount: 4500, method: "UPI / Razorpay", txnId: "TXN_9988771122", status: "Success", date: "2026-02-08 14:30" },
    { id: "PAY-9013", bookingId: "NJ-84919", customer: "Priya Sharma", amount: 2800, method: "Credit Card", txnId: "TXN_9988771123", status: "Success", date: "2026-02-08 12:15" },
    { id: "PAY-9014", bookingId: "NJ-84918", customer: "Vikram Malhotra", amount: 18500, method: "Netbanking", txnId: "TXN_9988771124", status: "Success", date: "2026-02-08 10:00" },
    { id: "PAY-9015", bookingId: "NJ-84917", customer: "Neha Gupta", amount: 1950, method: "UPI / PhonePe", txnId: "TXN_9988771125", status: "Pending", date: "2026-02-08 15:45" },
    { id: "PAY-9016", bookingId: "NJ-84916", customer: "Sanjay Joshi", amount: 12400, method: "Debit Card", txnId: "TXN_9988771126", status: "Refunded", date: "2026-02-07 18:20" },
    { id: "PAY-9017", bookingId: "NJ-84915", customer: "Karan Patel", amount: 3200, method: "GPay", txnId: "TXN_9988771127", status: "Failed", date: "2026-02-07 09:10" }
  ]);

  const filtered = payments.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.txnId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-white pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black">Payments & Financial Transactions</h2>
          <p className="text-xs text-slate-400">Track payment status, transactions, refunds, and payment gateway logs</p>
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Payment ID, Booking ID, Customer or Txn ID..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0B5ED7]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
          <Filter className="w-4 h-4" /> Filter Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-900/50">
                <th className="py-3.5 px-4">Payment ID</th>
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-400">{p.id}</td>
                  <td className="py-3.5 px-4 font-mono text-amber-400">{p.bookingId}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{p.customer}</td>
                  <td className="py-3.5 px-4 font-black text-white">{formatCurrency(p.amount)}</td>
                  <td className="py-3.5 px-4 text-slate-300">{p.method}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{p.txnId}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                      p.status === 'Success' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                      p.status === 'Pending' ? 'bg-orange-950 text-orange-400 border-orange-800' :
                      p.status === 'Refunded' ? 'bg-purple-950 text-purple-400 border-purple-800' :
                      'bg-rose-950 text-rose-400 border-rose-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
