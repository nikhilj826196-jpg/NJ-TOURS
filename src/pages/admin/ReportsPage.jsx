import React from 'react';
import { useTranslation } from 'react-i18next';
// from 'react';
import { FileText, Download, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ReportsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6 text-white">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-black">Financial Reports & GST Statements</h2>
        <p className="text-xs text-slate-400">{t("dash.reportsDesc", "Generate monthly revenue audit reports and tax statements")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
          <FileText className="w-8 h-8 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Monthly GST Audit Report (July 2026)</h3>
          <p className="text-xs text-slate-400">Itemized breakdown of toll charges, driver bata, and 5% GST billing.</p>
          <button onClick={() => alert("Downloading Monthly GST PDF...")} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
            <Download className="w-4 h-4" /> Download PDF Report
          </button>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Fleet Utilization & Mileage Analytics</h3>
          <p className="text-xs text-slate-400">Kilometer mileage summary across Sedans, Innovas, and Tempo Travellers.</p>
          <button onClick={() => alert("Downloading Fleet Analytics Excel...")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV Statement
          </button>
        </div>
      </div>
    </div>
  );
}
