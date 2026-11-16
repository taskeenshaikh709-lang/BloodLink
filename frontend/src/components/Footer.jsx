import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, AlertTriangle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Critical Statutory Disclaimer Banner */}
        <div className="mb-10 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Statutory Healthcare Disclaimer</h4>
              <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                BloodLink is a digital communications and availability coordination platform for licensed institutions in the Mumbai Metropolitan Region. 
                <strong> BloodLink never sells blood, does not collect payments for blood units, does not make clinical compatibility determinations, and does not operate transport ambulances.</strong> 
                All blood dispensation is strictly governed by the Drugs & Cosmetics Act, National Blood Transfusion Council (NBTC), and State Blood Transfusion Council (SBTC) Maharashtra.
              </p>
            </div>
          </div>
          <span className="bg-slate-700 text-slate-300 text-[11px] font-mono px-2.5 py-1 rounded whitespace-nowrap">
            SEC. 28C COMPLIANT MODEL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-black text-lg mb-3">
              <span>BLOOD<span className="text-red-500">LINK</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eliminating friction and emergency phone rounds between hospitals and verified blood banks across Mumbai, Thane, and Navi Mumbai.
            </p>
            <div className="mt-4 flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional Verification Protocol</span>
            </div>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Emergency Navigation</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/hospital/new-request" className="hover:text-white transition">New Hospital Requisition</Link></li>
              <li><Link to="/caregiver" className="hover:text-white transition">Family Emergency Helpdesk</Link></li>
              <li><Link to="/verified-directory" className="hover:text-white transition">Mumbai Blood Bank Directory</Link></li>
              <li><Link to="/safety-transfusion" className="hover:text-white transition">Transfusion Safety Guidelines</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Participating Clusters</h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Mumbai City (Parel, Dadar, Byculla)</li>
              <li>• Mumbai Suburban (Bandra, Andheri, Ghatkopar)</li>
              <li>• Thane Metropolitan Region</li>
              <li>• Navi Mumbai (Vashi, Nerul, Belapur)</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Reviewer Demo Hub</h5>
            <p className="text-xs text-slate-400 mb-3">
              Explore role-based access for hospital teams, blood centres, caregivers, voluntary donors, and administrators without live credentials.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">Hospital</span>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">Blood Bank</span>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">Caregiver</span>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">Donor</span>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">Admin</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 BloodLink Prototype. Engineered for Indian Healthcare Infrastructure & Emergency Transfusion Coordination.</p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <Link to="/privacy" className="hover:text-slate-400">Privacy Notice</Link>
            <Link to="/terms" className="hover:text-slate-400">Terms of Coordination</Link>
            <Link to="/safety-transfusion" className="hover:text-slate-400">Clinical Protocol</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
